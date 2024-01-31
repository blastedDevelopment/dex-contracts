import { ethers, network } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { setBalance, time } from "@nomicfoundation/hardhat-network-helpers";
import { GasClaimer } from "../typechain-types";
import IBlastABI from "../abi/contracts/interfaces/IBlast.sol/IBlast.json";

const {
  parseEther,
  deployContract,
  formatEther,
  formatUnits,
  getImpersonatedSigner,
  Contract,
  provider,
} = ethers;

let gasClaimer: GasClaimer;
let deployer: HardhatEthersSigner;
let tx, receipt;

const BlastContract = new Contract(
  "0x4300000000000000000000000000000000000002",
  IBlastABI,
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

const deployContracts = async () => {
  console.log("\n*** DEPLOYING CONTRACTS ***");
  gasClaimer = await deployContract("GasClaimer", [], deployer);
  await gasClaimer.waitForDeployment();
  console.log(`GasClaimer deployed to ${gasClaimer.target}`);
};

const attachContracts = async () => {
  console.log("\n*** ATTACHING CONTRACTS ***");
  const GasClaimer = await ethers.getContractFactory("GasClaimer", deployer);
  //@ts-ignore
  gasClaimer = GasClaimer.attach(process.env.DEPLOYED_GAS_CLAIMER);
  console.log(`GasClaimer attached to ${gasClaimer.target}`);
};

const wasteGas = async (loop: number) => {
  console.log("\n*** WASTING GAS ***");
  tx = await gasClaimer.wasteGas(loop);
  receipt = await tx.wait();
};

const readGasParams = async () => {
  console.log("\n*** READING GAS PARAMS ***");
  const [etherSeconds, etherBalance, lastUpdated, GasMode] =
    await BlastContract.readGasParams(gasClaimer.target);
  console.log({ etherSeconds, etherBalance, lastUpdated, GasMode });
};

const main = async () => {
  await showGwei();
  await setAddresses();
  const balanceStart = await provider.getBalance(deployer.address);
  // await deployContracts();
  await attachContracts();
  // await wasteGas(10000);
  await readGasParams();
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
