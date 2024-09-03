async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Voting = await ethers.getContractFactory("voting");
    const voting = await Voting.deploy();
    console.log("Voting contract deployed to:", voting.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});

//Deploying contracts with the account: 0xa8D27B31146764C2E3F717F10cb2aa972e9f9a02
//Voting contract deployed to: 0x58d64505614161fec4496783ACDBb2b1B924DB45