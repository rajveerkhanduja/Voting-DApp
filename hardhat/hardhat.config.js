require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: "0.8.2",
    networks: {
        hardhat: {},
        sepolia: {
            url: process.env.SEPOLIA_URL_WITH_API_KEY,
            accounts: [process.env.PRIVATE_KEY]
        },
    },
};