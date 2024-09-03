require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: "0.8.2",
    networks: {
        hardhat: {},
        sepolia: {
            url: `https://sepolia.infura.io/v3/096eb421bab148a4bda4d72d6415d9ac`,
            accounts: [`bc8b195941b9bef4c04779953b41d009bfcf7896e2e258ee8d77b4d0d3801ee5`]
        }
    }
};