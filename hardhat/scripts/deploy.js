const hre = require("hardhat");      

async function main() {
    const votingContract = await hre.ethers.getContractFactory("voting");
    const deployedVotingContract = await votingContract.deploy();
    console.log(`Contract Address deployed: ${deployedVotingContract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


//Contract Address deployed: 0x7CeBF87b4e048E37e33Fa0bC5cbeB7Ab1a1cC050
//https://amoy.polygonscan.com/address/0x7CeBF87b4e048E37e33Fa0bC5cbeB7Ab1a1cC050#code
