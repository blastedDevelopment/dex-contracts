// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract GasTracker {
    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private users;
    mapping(address => mapping(uint256 => uint256)) public userDailyGas;
    mapping(uint256 => uint256) public totalGasPerDayUsed;
    mapping(address => uint256) private startGas;
    mapping(address => uint256) private gasSpent;

    uint256 public contractDeployedTime;
    uint256 public totalGasUsed;

    constructor() {
        contractDeployedTime = block.timestamp;
    }

    function getCurrentDay() public view returns (uint256) {
        return (block.timestamp - contractDeployedTime) / 1 days;
    }

    function trackGasUsageStart() internal {
        startGas[msg.sender] = gasleft();
        uint256 currentDay = getCurrentDay();
        users.add(msg.sender);
        gasSpent[msg.sender] = startGas[msg.sender] - gasleft();
        userDailyGas[msg.sender][currentDay] += gasSpent[msg.sender];
    }

    function trackGasUsageEnd() internal {
        uint256 currentDay = getCurrentDay();
        gasSpent[msg.sender] = startGas[msg.sender] - gasleft();
        userDailyGas[msg.sender][currentDay] += gasSpent[msg.sender];
        totalGasUsed += gasSpent[msg.sender];
        totalGasPerDayUsed[currentDay] += gasSpent[msg.sender];
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
