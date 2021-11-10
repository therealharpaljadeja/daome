const hre = require("hardhat");

async function getDeployerBalance(deployer) {
	return `Deployer Balance: ${hre.ethers.utils.formatEther(
		await deployer.getBalance()
	)}`;
}

async function main() {
	const testnetAccount = await hre.reef.getSignerByName("testnet_account");
	await testnetAccount.claimDefaultAccount();

	console.log(`Deploying using address: ${testnetAccount._substrateAddress}`);

	console.log(await getDeployerBalance(testnetAccount));

	console.log("Deploying Marketplace Contract");
	const NFTMarket = await hre.reef.getContractFactory(
		"NFTMarket",
		testnetAccount
	);
	const nftMarket = await NFTMarket.deploy();
	await nftMarket.deployed();

	console.log(await getDeployerBalance(testnetAccount));
	console.log(`Marketplace Deployed at ${nftMarket.address}`);

	console.log("Deploying Creators Contract");
	const Creators = await hre.reef.getContractFactory(
		"Creators",
		testnetAccount
	);
	const creators = await Creators.deploy(nftMarket.address);
	await creators.deployed();
	console.log(`Creators deployed at ${creators.address}`);

	console.log(await getDeployerBalance(testnetAccount));
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
