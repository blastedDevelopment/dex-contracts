// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.22;

contract GasTracker {

    mapping(address => UserData) private userData;
    mapping(uint256 => uint256) public totalGasPerDayUsed;
    uint256 public contractDeployedTime;

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
    }

    function trackGasUsageEnd() internal {
        address caller = msg.sender;
        uint256 currentDay = getCurrentDay();
        uint256 gasSpentLocal = userData[caller].startGas - gasleft();
        userData[caller].dailyGas[currentDay] += gasSpentLocal;
        totalGasPerDayUsed[currentDay] += gasSpentLocal;
    }

    function exampleFunction() public {
        trackGasUsageStart();
        // logic here
        trackGasUsageEnd();
    }

}