import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-abi-exporter";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        // url: "https://sepolia.blast.io", //blastTestnet
        url: "https://rpc.sepolia.org", //ethTestnet
      },
    },
    blastTest: {
      url: "https://sepolia.blast.io",
      accounts: [
        process.env.PK_DEPLOYER_WALLET!, //Blasted Deployer
      ],
    },
    ethTest: {
      url: "https://rpc.sepolia.org",
      accounts: [
        process.env.PK_DEPLOYER_WALLET!, //Blasted Deployer
      ],
    },
  },
  abiExporter: {
    path: "./abi",
    clear: true,
    flat: false,
    runOnCompile: true,
    only: [],
  },
};

export default config;
