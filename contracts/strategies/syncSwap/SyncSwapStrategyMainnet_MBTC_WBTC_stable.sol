//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "./SyncSwapStrategy.sol";

contract SyncSwapStrategyMainnet_MBTC_WBTC_stable is SyncSwapStrategy {

  constructor() {}

  function initializeStrategy(
    address _storage,
    address _vault
  ) public initializer {
    address underlying = address(0x57B11C2C0Cdc81517662698A48473938e81d5834);
    address zk = address(0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E);
    address weth = address(0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91);
    address wbtc = address(0xBBeB516fb02a01611cBBE0453Fe3c580D7281011);
    address router = address(0x9B5def958d0f3b6955cBEa4D5B7809b2fb26b059);
    SyncSwapStrategy.initializeBaseStrategy(
      _storage,
      underlying,
      _vault,
      address(0),
      weth,
      wbtc,
      router,
      false
    );
    rewardTokens = [zk];
    setBoolean(_STAKE, false);
  }
}
