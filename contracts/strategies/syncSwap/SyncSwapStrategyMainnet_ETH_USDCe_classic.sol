//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "./SyncSwapStrategy.sol";

contract SyncSwapStrategyMainnet_ETH_USDCe_classic is SyncSwapStrategy {

  constructor() {}

  function initializeStrategy(
    address _storage,
    address _vault
  ) public initializer {
    address underlying = address(0x80115c708E12eDd42E504c1cD52Aea96C547c05c);
    address stakingPool = address(0xA1419939e8f8812A7B6A95d82B80fc373cf4cEA9);
    address zk = address(0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E);
    address weth = address(0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91);
    address router = address(0x9B5def958d0f3b6955cBEa4D5B7809b2fb26b059);
    SyncSwapStrategy.initializeBaseStrategy(
      _storage,
      underlying,
      _vault,
      stakingPool,
      zk,
      weth,
      router,
      true
    );
    rewardTokens = [zk];
  }
}