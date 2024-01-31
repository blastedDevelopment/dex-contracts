// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract GasTracker {
    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private users;
    mapping(address => UserData) private userData;
    mapping(uint256 => uint256) public totalGasPerDayUsed;
    uint256 public contractDeployedTime;
    uint256 public totalGasUsed;

    struct UserData {
        mapping(uint256 => uint256) dailyGas;
        uint256 startGas;
    }
    constructor() {
        contractDeployedTime = block.timestamp;
    }

    function getCurrentDay() public view returns (uint256) {
        return (block.timestamp - contractDeployedTime) / 1 days;
    }

    function trackGasUsageStart() internal {
        address caller = msg.sender;
        userData[caller].startGas = gasleft();
        users.add(caller);
    }

    function trackGasUsageEnd() internal {
        address caller = msg.sender;
        uint256 currentDay = getCurrentDay();
        uint256 gasSpentLocal = userData[caller].startGas - gasleft();
        userData[caller].dailyGas[currentDay] += gasSpentLocal;
        totalGasUsed += gasSpentLocal;
        totalGasPerDayUsed[currentDay] += gasSpentLocal;
    }

    function exampleFunction() public {
        trackGasUsageStart();
        // logic here
        trackGasUsageEnd();
    }

    function getTotalUsers() public view returns (uint256) {
        return users.length();
    }

    function getUserAtIndex(uint256 index) public view returns (address) {
        require(index < users.length(), "Index out of bounds");
        return users.at(index);
    }
}