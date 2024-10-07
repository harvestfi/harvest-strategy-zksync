//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "./SyncSwapStrategy.sol";

contract SyncSwapStrategyMainnet_wrsETH_ETH_aqua is SyncSwapStrategy {

  constructor() {}

  function initializeStrategy(
    address _storage,
    address _vault
  ) public initializer {
    address underlying = address(0x58BA6dDb7aF82A106219Dc412395AD56284BC5b3);
    address stakingPool = address(0x16580b31d68fFd418e1ff40C73DD1421CB83a0A7);
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
      false
    );
    rewardTokens = [zk];
  }
}
