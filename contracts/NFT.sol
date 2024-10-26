//SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    constructor() ERC721("MY_NFT", "MN") {}

    uint public tokenId;

    function mint(string memory _tokenURI) external {
        tokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }
}
