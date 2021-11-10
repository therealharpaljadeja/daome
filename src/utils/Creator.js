import { ethers } from "ethers"
import Creator from "../abi/Creator.json";

export const getNFTCollectionAddress = async (wallet, creatorAddress) => {
    const creatorContract = new ethers.Contract(creatorAddress, Creator.abi, wallet);
    let result = await creatorContract.nftCollectionAddress();
    return result;
}





