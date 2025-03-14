// Utilities
const Utils = require("../utilities/Utils.js");
const {
  setupCoreProtocol,
  depositVault,
} = require("../utilities/hh-utils.js");

const addresses = require("../test-config.js");
const BigNumber = require("bignumber.js");
const { zksyncEthers } = require("hardhat");

const Strategy = "ReactorFusionFoldStrategyMainnet_USDCe";

// Developed and tested at blockNumber 34718520

// Vanilla Mocha test. Increased compatibility with tools that integrate Mocha.
describe("ZKSync Mainnet ReactorFusion USDCe", function() {
  let gasPrice;

  // external contracts
  let underlying;

  // external setup
  let rf = "0x5f7CBcb391d33988DAD74D6Fd683AadDA1123E4D";
  let weth = "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91";
  let usdce = "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4";

  // parties in the protocol
  let governance;
  let farmer1;

  // Core protocol contracts
  let controller;
  let vault;
  let strategy;

  async function setupExternalContracts() {
    underlying = await zksyncEthers.getContractAt("IERC20", "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4");
    console.log("Fetching Underlying at: ", underlying.target);
  }

  before(async function() {
    governance = await zksyncEthers.getWallet();
    gasPrice = await zksyncEthers.providerL2.getGasPrice();

    farmer1 = await zksyncEthers.getWallet();

    await setupExternalContracts();
    [controller, vault, strategy] = await setupCoreProtocol({
      "gasPrice": gasPrice * BigInt(10),
      "existingVaultAddress": null,
      "strategyArtifact": Strategy,
      "strategyArtifactIsUpgradable": true,
      "underlying": underlying,
      "governance": governance,
      "liquidation": [{"zkSwap": [rf, weth]}, {"zkSwap": [rf, weth, usdce]}]
    });
  });

  describe("Happy path", function() {
    it("Farmer should earn money", async function() {
      let farmerOldBalance = new BigNumber(await underlying.balanceOf(farmer1.address));
      console.log("Old balance:", farmerOldBalance.toFixed());
      await depositVault(farmer1, underlying, vault, farmerOldBalance, gasPrice);
      let hours = 10;
      let blocksPerHour = 300;
      let oldSharePrice;
      let newSharePrice;

      for (let i = 0; i < hours; i++) {
        console.log("loop ", i);

        oldSharePrice = new BigNumber(await vault.getPricePerFullShare());
        await controller.connect(governance).doHardWork(vault.target);
        hre.zksyncEthers.provider.send("evm_mine");
        newSharePrice = new BigNumber(await vault.getPricePerFullShare());

        console.log("old shareprice: ", oldSharePrice.toFixed());
        console.log("new shareprice: ", newSharePrice.toFixed());
        console.log("growth: ", newSharePrice.toFixed() / oldSharePrice.toFixed());

        apr = (newSharePrice.toFixed()/oldSharePrice.toFixed()-1)*(24/(blocksPerHour/1800))*365;
        apy = ((newSharePrice.toFixed()/oldSharePrice.toFixed()-1)*(24/(blocksPerHour/1800))+1)**365;

        console.log("instant APR:", apr*100, "%");
        console.log("instant APY:", (apy-1)*100, "%");

        await Utils.advanceNBlock(blocksPerHour);
      }
      await vault.withdraw(new BigNumber(await vault.balanceOf(farmer1)).toFixed(), { from: farmer1 });
      hre.zksyncEthers.provider.send("evm_mine");
      let farmerNewBalance = new BigNumber(await underlying.balanceOf(farmer1)).minus(farmerOldBalance);
      console.log("New balance:", farmerNewBalance.toFixed());
      Utils.assertBNGt(farmerNewBalance, farmerOldBalance);

      apr = (farmerNewBalance.toFixed()/farmerOldBalance.toFixed()-1)*(24/(blocksPerHour*hours/1800))*365;
      apy = ((farmerNewBalance.toFixed()/farmerOldBalance.toFixed()-1)*(24/(blocksPerHour*hours/1800))+1)**365;

      console.log("earned!");
      console.log("APR:", apr*100, "%");
      console.log("APY:", (apy-1)*100, "%");

      await strategy.withdrawAllToVault({from:governance}); // making sure can withdraw all for a next switch
      hre.zksyncEthers.provider.send("evm_mine");
    });
  });
});
