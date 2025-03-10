//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "./Governable.sol";

contract Controllable is Governable {

  constructor(address _storage) Governable(_storage) {
  }

  modifier onlyController() {
    require(store.isController(msg.sender), "Not a controller");
    _;
  }

  modifier onlyControllerOrGovernance(){
    require((store.isController(msg.sender) || store.isGovernance(msg.sender)),
      "The caller must be controller or governance");
    _;
  }

  function controller() public view returns (address) {
    return store.controller();
  }
}
