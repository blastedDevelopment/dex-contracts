import { ethers, network } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { setBalance, time } from "@nomicfoundation/hardhat-network-helpers";
import { GasClaimer } from "../typechain-types";
import IBlastABI from "../abi/contracts/interfaces/IBlast.sol/IBlast.json";
import { abi as ERC20ABI } from "@openzeppelin/contracts/build/contracts/IERC20.json";

const {
  parseEther,
  deployContract,
  formatEther,
  formatUnits,
  getImpersonatedSigner,
  Contract,
  provider,
} = ethers;

let deployer: HardhatEthersSigner;
let tx, receipt;

const USDCBridgeABI = [
  "function bridgeERC20To(address _localToken,address _remoteToken,address to,uint256 _amount,uint32 _minGasLimit,bytes calldata _extraData) public",
];

const USDCBridgeContract = new Contract(
  "0xc644cc19d2A9388b71dd1dEde07cFFC73237Dca8",
  USDCBridgeABI,
  provider
);

const USDCContract = new Contract(
  "0x7f11f79DEA8CE904ed0249a23930f2e59b43a385",
  ERC20ABI,
  provider
);

const USDBContract = new Contract(
  "0x4200000000000000000000000000000000000022",
  ERC20ABI,
  provider
);

const setAddresses = async () => {
  console.log("\n*** SETTING ADDRESSES ***");
  if (network.name === "localhost" || network.name === "hardhat") {
    deployer = await getImpersonatedSigner(
      "0xD8a566C83616BBF2B3762439B1C30bCBa10ee885"
    );
    await setBalance(deployer.address, parseEther("1000"));
  } else {
    [deployer] = await ethers.getSigners();
  }
  console.log(`Deployer: ${deployer.address}`);
};

const bridgeUSDC = async () => {
  console.log("\n*** BRIDGING USDC ***");
  const balance = await USDCContract.balanceOf(deployer.address);
  //@ts-ignore
  tx = await USDCBridgeContract.connect(deployer).bridgeERC20To(
    "0x7f11f79DEA8CE904ed0249a23930f2e59b43a385",
    "0x4200000000000000000000000000000000000022",
    deployer.address,
    balance,
    500000,
    "0x"
  );
  receipt = await tx.wait();
  console.log("Balance After:", await USDCContract.balanceOf(deployer.address));
};

const main = async () => {
  await showGwei();
  await setAddresses();
  const balanceStart = await provider.getBalance(deployer.address);
  //   await bridgeUSDC();
  console.log("Balance USDB:", await USDBContract.balanceOf(deployer.address));

  const balanceFinish = await provider.getBalance(deployer.address);
  console.log(
    "Balance used:",
    formatEther(balanceStart - balanceFinish),
    "ETH"
  );
};

const showGwei = async () => {
  console.log(
    "Current GWEI:",
    Math.round(
      parseFloat(
        formatUnits((await provider.getFeeData()).gasPrice || 0n, "gwei")
      )
    )
  );
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
