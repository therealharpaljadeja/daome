// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Creator is Ownable {
    string public username;
    string public name;
    string public bio;
    string public profilePicUrl;
    address public nftCollectionAddress;
    address public tokenAddress;

    constructor(
        string memory _username,
        string memory _name,
        string memory _bio,
        string memory _profilePicUrl
    ) {
        name = _name;
        username = _username;
        bio = _bio;
        profilePicUrl = _profilePicUrl;
    }

    function setNFTCollectionAddress(address _nftCollectionAddress) external {
        nftCollectionAddress = _nftCollectionAddress;
    }

    function setTokenAddress(address _tokenAddress) external {
        tokenAddress = _tokenAddress;
    }
}
