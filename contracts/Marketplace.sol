//SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percent on sales
    uint public itemCount;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // indexing will allow us to search offered events using nft & seller addresses as filters.
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    // itemId => item
    mapping(uint => Item) public items;

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // user will pass contract address and it will be converted to solidity contract instance.
    function makeItem(
        IERC721 _nft,
        uint _tokenId,
        uint _price
    ) external nonReentrant {
        require(_price > 0, "Value should be greater than 0");
        itemCount++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // adding new item to items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }
}
