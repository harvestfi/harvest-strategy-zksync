const prompt = require('prompt');
const hre = require("hardhat");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy")

async function main() {
  console.log("Upgradable strategy deployment.");
  console.log("Specify a the vault address, and the strategy implementation's name");
  prompt.start();
  const addresses = require("../test/test-config.js");
  const wallet = await zksyncEthers.getWallet()
  const deployer = new Deployer(hre, wallet);

  const {vaultAddr, strategyName} = await prompt.get(['vaultAddr', 'strategyName']);

  const StrategyImpl = await deployer.loadArtifact(strategyName);
  const impl = await deployer.deploy(StrategyImpl);

  console.log("Implementation deployed at:", impl.target);

  const verificationId = await hre.run("verify:verify", {address: impl.target});

  const StrategyProxy = await deployer.loadArtifact('StrategyProxy');
  const proxy = await deployer.deploy(StrategyProxy, [impl.target]);

  console.log("Proxy deployed at:", proxy.target);

  const strategy = await zksyncEthers.getContractAt(StrategyImpl, proxy.target, wallet);
  await strategy.initializeStrategy(addresses.Storage, vaultAddr);

  console.log("Deployment complete. New strategy deployed and initialised at", proxy.target);
  const result = {}
  result.vault = vaultAddr
  result.strategy = proxy.target

  console.log(result)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
