import { ethers } from "ethers";
import NFT from "../abi/NFT.json";
import { getNFTCollectionAddress } from "./Creator";
import axios from "axios";
import Creator from "../abi/Creator.json";

export const balanceOf = async (wallet, creatorAddress) => {
    let collectionAddress = getNFTCollectionAddress(wallet, creatorAddress);
    let nftContract = new ethers.Contract(collectionAddress, NFT.abi, wallet);
    let result = await nftContract.balanceOf((await wallet.getAddress()));
    return result;
}

export const mintNFT = async (wallet, creatorAddress, tokenURI, royaltyPercentage) => {
    let collectionAddress = await getNFTCollectionAddress(wallet, creatorAddress);
    let nftContract = new ethers.Contract(collectionAddress, NFT.abi, wallet);
    let result = await nftContract.createToken(tokenURI, royaltyPercentage);
    return result;
}

export const tokenOwnedByUser = async (wallet, creatorAddress) => {
    const ownerAddress = await wallet.getAddress();
    let collectionAddress = await getNFTCollectionAddress(wallet, creatorAddress);
    let nftContract = new ethers.Contract(collectionAddress, NFT.abi, wallet);
    let balanceOfOwner = await balanceOf(wallet, creatorAddress);
    let nfts = [];
    for(let i = 0; i < balanceOfOwner; i++) {
        let tokenId = await nftContract.tokenOfOwnerByIndex(ownerAddress, i);
        let tokenURI = await nftContract.tokenURI(tokenId);
        let response = await axios.get(tokenURI);
        const { name, description } = response.data;
        let ImageUrlSplit = response.data.image.split("/", 4);
        let imageUrl = `https://ipfs.io/ipfs/${ImageUrlSplit[ImageUrlSplit.length - 2] + '/'+ ImageUrlSplit[ImageUrlSplit.length - 1]}`
        let nft = {
            name,
            description,
            image: imageUrl,
            collectionAddress,
            creatorAddress,
            tokenId
        }
        nfts.push(nft);
    }

    return nfts;
}


export const tokenMetadata = async (wallet, creatorAddress, collectionAddress, tokenId) => {
    let nftContract = new ethers.Contract(collectionAddress, NFT.abi, wallet);
    let isApprovedByOwner = await nftContract.isApprovedToMarketplace(process.env.REACT_APP_MARKETPLACE_CONTRACT_REEF, tokenId);
    let owner = await nftContract.ownerOf(tokenId);
    let creatorContract = new ethers.Contract(creatorAddress, Creator.abi, wallet);
    
    let creator = {};
    creator.username = await creatorContract.username();
    creator.name = await creatorContract.name();
    creator.bio = await creatorContract.bio();
    creator.profilePicUrl = await creatorContract.profilePicUrl();

    let tokenURI = await nftContract.tokenURI(tokenId);
    let response = await axios.get(tokenURI);

    const { name, description } = response.data;
    let ImageUrlSplit = response.data.image.split("/", 4);
    let imageUrl = `https://ipfs.io/ipfs/${ImageUrlSplit[ImageUrlSplit.length - 2] + '/'+ ImageUrlSplit[ImageUrlSplit.length - 1]}`
    
    let nft = {
        name,
        description,
        image: imageUrl,
        collectionAddress,
        tokenId,
        creator,
        owner,
        isApprovedByOwner
    }


    return nft;
}

export const approveToMarketplace = async (wallet, collectionAddress, tokenId) => {
    let nftContract = new ethers.Contract(collectionAddress, NFT.abi, wallet);
    await nftContract.approve(process.env.REACT_APP_MARKETPLACE_CONTRACT_REEF, tokenId);
} 

export const withdrawRoyalty = async (collectionAddress, wallet) => {
    let nftContract = new ethers.Contract(collectionAddress, NFT.abi, wallet);
    await nftContract.withdraw();
}