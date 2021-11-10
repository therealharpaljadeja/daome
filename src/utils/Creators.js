import { ethers, providers } from "ethers"
import Creators from "../abi/Creators.json";
import Creator from "../abi/Creator.json";

export const isUserRegistered = async (wallet, evmAddress) => {
    const creatorsContract = new ethers.Contract(process.env.REACT_APP_CREATORS_CONTRACT_REEF, Creators.abi, wallet);
    let result = await creatorsContract.isUserRegistered(evmAddress); 
    return result;
}

export const getCreatorAddressByUsername = async (wallet, username) => {
    const creatorsContract = new ethers.Contract(process.env.REACT_APP_CREATORS_CONTRACT_REEF, Creators.abi, wallet);
    let result = await creatorsContract.getCreatorAddressByUsername(username); 
    return result;
}

export const registerUser = async (wallet, creator) => {
    const creatorsContract = new ethers.Contract(process.env.REACT_APP_CREATORS_CONTRACT_REEF, Creators.abi, wallet);
    let result = await creatorsContract.registerUser(creator.username, creator.name, creator.bio, creator.profilePicUrl, creator.nftCollectionName, creator.nftCollectionSymbol); 
    return result;
}

export const getCreatorAddressBySender = async (wallet) => {
    const creatorsContract = new ethers.Contract(process.env.REACT_APP_CREATORS_CONTRACT_REEF, Creators.abi, wallet);
    let result = await creatorsContract.getCreatorAddressBySender(); 
    return result;
}

export const getCreatorObjFromAddress = async (wallet, contractAddress) => {
    const creatorContract = new ethers.Contract(contractAddress, Creator.abi, wallet);
    let username = await creatorContract.username();
    let name = await creatorContract.name();
    let bio = await creatorContract.bio();
    let profilePicUrl = await creatorContract.profilePicUrl();
    let nftCollectionName = await creatorContract.nftCollectionName();
    let nftCollectionSymbol = await creatorContract.nftCollectionSymbol();
    let nftCollectionAddress = await creatorContract.nftCollectionAddress();

    let royaltyEarned = ethers.utils.formatEther((await wallet.provider.getBalance(nftCollectionAddress)).toString());

    return {
        username,
        name,
        bio,
        nftCollectionName,
        nftCollectionSymbol,
        nftCollectionAddress,
        profilePicUrl,
        royaltyEarned
    }
}