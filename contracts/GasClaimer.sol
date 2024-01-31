// SPDX-License-Identifier: MIT
pragma solidity =0.8.22;

import "./interfaces/IBlast.sol";

contract GasClaimer {
    IBlast public constant BLAST =
        IBlast(0x4300000000000000000000000000000000000002);

    uint256 public counter;
    uint256 public balanceGasStart;
    uint256 public balanceGasFinish;

    constructor() {
        BLAST.configureClaimableGas();
        BLAST.configureGovernor(msg.sender);
    }

    function wasteGas(uint256 loop) external {
        (, balanceGasStart, , ) = BLAST.readGasParams(address(this));
        for (uint256 i = 0; i < loop; i++) {
            counter++;
        }
        (, balanceGasFinish, , ) = BLAST.readGasParams(address(this));
    }
}
