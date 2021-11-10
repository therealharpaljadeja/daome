// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "./NFT.sol";
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Creator is Ownable {
    string public username;
    string public name;
    string public bio;
    string public profilePicUrl;
    string public nftCollectionName;
    string public nftCollectionSymbol;

    address public nftCollectionAddress;

    constructor(
        string memory _username,
        string memory _name,
        string memory _bio,
        string memory _profilePicUrl,
        string memory _nftCollectionName,
        string memory _nftCollectionSymbol
    ) {
        name = _name;
        username = _username;
        bio = _bio;
        profilePicUrl = _profilePicUrl;
        nftCollectionName = _nftCollectionName;
        nftCollectionSymbol = _nftCollectionSymbol;

        NFT nftCollection = new NFT(nftCollectionName, nftCollectionSymbol);
        nftCollection.transferOwnership(tx.origin);
        nftCollectionAddress = address(nftCollection);
    }
}
