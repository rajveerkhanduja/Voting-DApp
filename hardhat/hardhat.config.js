require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    amoy: { 
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 25000000000, //Set to 25 gwei
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};
