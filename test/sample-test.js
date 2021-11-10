const { ethers } = require("hardhat");

describe("NFT", function () {
	// it("Creating NFT", async function() {
	//   const NFT = await ethers.getContractFactory("NFT");
	//   const nft = await NFT.deploy("Best Collection", "BC");
	//   await nft.deployed();

	//   const nftCreated = await nft.createToken("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg");
	// });

	// it("List NFT on Market", async function () {
	//   const NFT = await ethers.getContractFactory("NFT");
	//   const nft = await NFT.deploy("Best Collection", "BC");
	//   await nft.deployed();

	//   const nftCreated = await nft.createToken("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg");
	//   // console.log(nftCreated);

	//   const auctionPrice = ethers.utils.parseUnits('0.1', 'ether');

	//   let NFTMarket = await ethers.getContractFactory("NFTMarket");
	//   let nftMarket = await NFTMarket.deploy();
	//   await nftMarket.deployed();

	//   const listingPrice = await nftMarket.getListingPrice();

	//   nftMarket.createMarketItem(nft.address, 1, auctionPrice, { value: listingPrice });

	//   // const created = await nftMarket.fetchItemsCreated();
	//   // console.log(created);
	// });

	// it("Testing ERC20Receivable", async function() {
	//   let totalSupply = ethers.utils.parseUnits("100", "ether");

	//   let Token = await ethers.getContractFactory("Token");
	//   let token = await Token.deploy(totalSupply);
	//   await token.deployed();

	//   let Receiver = await ethers.getContractFactory("Greeter");
	//   let receiver = await Receiver.deploy(token.address);
	//   await receiver.deployed();

	//   const [ firstAddress ] = await ethers.getSigners();
	//   let valueToPay = ethers.utils.parseUnits("300", "ether");
	//   token.approve(receiver.address, valueToPay);

	//   let walletBalance = await token.balanceOf(firstAddress.address);
	//   console.log(ethers.utils.formatEther(walletBalance.toString()));

	//   let allowance = await token.connect(firstAddress.address).allowance(firstAddress.address, receiver.address);
	//   console.log(ethers.utils.formatEther(allowance.toString()));

	//   await receiver.payERC20();

	//   let balanceOfReceiver = await token.balanceOf(receiver.address);
	//   console.log(ethers.utils.formatEther(balanceOfReceiver.toString()));

	// });

	// it("Buying NFT using ERC20 Token", async function () {
	//   let totalSupply = ethers.utils.parseUnits("100", "ether");

	//   let Token = await ethers.getContractFactory("Token");
	//   let token = await Token.deploy(totalSupply);
	//   await token.deployed();

	//   const NFT = await ethers.getContractFactory("NFT");
	//   const nft = await NFT.deploy("Best Collection", "BC");
	//   await nft.deployed();

	//   const nftCreated = await nft.createToken("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg");

	//   let NFTMarket = await ethers.getContractFactory("NFTMarket");
	//   let nftMarket = await NFTMarket.deploy();
	//   await nftMarket.deployed();

	//   const auctionPrice = ethers.utils.parseUnits('10', 'ether');
	//   const listingPrice = await nftMarket.getListingPrice();

	//   const [ firstSigner, buyerSigner ] = await ethers.getSigners();
	//   await nft.connect(firstSigner).approve(nftMarket.address, 1);

	//   await token.connect(firstSigner).transfer(buyerSigner.address, ethers.utils.parseUnits('10', 'ether'));

	//   await nftMarket.createMarketItem(nft.address, token.address, 1, auctionPrice, { value: listingPrice });

	//   await token.connect(buyerSigner).approve(nftMarket.address, auctionPrice);

	//   await nftMarket.connect(buyerSigner).createMarketSale(nft.address, 1);
	//   let nftBalance = await nft.balanceOf(buyerSigner.address);
	// });

	it("Creating a creator, launching an NFT collection, launching a token and listing NFT on marketplace for the token", async function () {
		// deploying marketplace
		let NFTMarket = await ethers.getContractFactory("NFTMarket");
		let nftMarket = await NFTMarket.deploy();
		await nftMarket.deployed();

		const listingPrice = await nftMarket.getListingPrice();

		// deploying creators contract
		let Creators = await ethers.getContractFactory("Creators");
		let creators = await Creators.deploy(nftMarket.address);
		await creators.deployed();

		const [firstSigner, buyerSigner] = await ethers.getSigners();

		// create creator
		await creators.registerUser(
			"azure1050",
			"test",
			"Test",
			"http://www.google.com",
			"NFTCollection",
			"NFT"
		);

		// get creator address from creators.
		let creator = await creators.getCreatorAddressByUsername("azure1050");
		console.log(creator);
		let Creator = await ethers.getContractFactory("Creator");
		let creatorContract = await Creator.attach(creator);

		// get nftCollectionAddress from creators.
		let nftContractAddress = await creatorContract.nftCollectionAddress();
		let NFT = await ethers.getContractFactory("NFT");

		let nftContract = await NFT.attach(nftContractAddress);

		// mint an nft
		await nftContract
			.connect(firstSigner)
			.createToken(
				"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
			);
		await nftContract
			.connect(firstSigner)
			.createToken(
				"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
			);
		await nftContract
			.connect(buyerSigner)
			.createToken(
				"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
			);
		await nftContract
			.connect(firstSigner)
			.createToken(
				"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
			);

		console.log(await nftContract.tokenURI(2));

		// let tokenAddress = await creatorContract.tokenAddress();

		// approving token
		await nftContract.connect(firstSigner).approve(nftMarket.address, 1);

		// list on marketplace
		await nftMarket
			.connect(firstSigner)
			.createMarketItem(
				nftContractAddress,
				1,
				ethers.utils.parseUnits("0.1", "ether"),
				{ value: listingPrice }
			);

		let balanceOf = (
			await nftContract.balanceOf(firstSigner.address)
		).toString();
		let marketplaceBalance = (
			await nftContract.balanceOf(nftMarket.address)
		).toString();
		console.log(marketplaceBalance);

		let fetchMarketItems = await nftMarket.fetchMarketItems();
		console.log(fetchMarketItems);
		for (let i = 0; i < parseInt(balanceOf); i++) {
			console.log(
				await nftContract.tokenOfOwnerByIndex(firstSigner.address, i)
			);
		}

		// console.log(nftMarket.address);
		// console.log(await nftMarket.fetchItemsCreated());

		// buy from marketplace

		// send tokens to buyer for testing.
		// let Token = await ethers.getContractFactory("Token");
		// let tokenContract = await Token.attach(tokenAddress);

		// await tokenContract.connect(firstSigner).transfer(buyerSigner.address, ethers.utils.parseUnits("0.1", "ether"));

		// await tokenContract.connect(buyerSigner).approve(nftMarket.address, ethers.utils.parseUnits("0.1", "ether"));
		await nftMarket
			.connect(buyerSigner)
			.createMarketSale(nftContractAddress, 1, {
				value: ethers.utils.parseUnits("0.1", "ether"),
			});
	});

	// it("asb", async () => {
	//   const NFTMarket = await ethers.getContractFactory("NFT");
	//   let nftMarket = await NFTMarket.attach("0xC717011156750527aFbC9873F6334b49b8170B65");
	//   console.log(`token uri` + await nftMarket.tokenURI(1));
	// })
});
s;
