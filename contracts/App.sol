// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
contract Item is ERC721 {
     
    constructor() ERC721("Item", "IT") {
        
        _mint(msg.sender, 10);
    }
}

contract Pool is IERC721Receiver {

    IERC721 public itemNFT;
    uint256 public tokenPrice=1;
    mapping(uint256 => address) public originalOwner;
    mapping(address => uint256) public depositTimestamp;
    mapping(address => uint256) public rewards;

    

    constructor(IERC721 _address) {
        itemNFT = _address;
       
    }
    

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function depositNFT(uint256 tokenId) external {
        originalOwner[tokenId] = msg.sender;
        itemNFT.safeTransferFrom(msg.sender, address(this), tokenId);
        depositTimestamp[msg.sender] = block.timestamp;
    }

    function withdrawNFT(uint256 tokenId) external {
        require(originalOwner[tokenId] == msg.sender, "Not original owner");
        require(block.timestamp >= depositTimestamp[msg.sender] + 30 days, "Tokens are locked");
        itemNFT.safeTransferFrom(address(this), msg.sender, tokenId);
        
    }

    function calculateReward(address _user) internal returns (uint256) {
        uint256 time =depositTimestamp[_user];
        uint256 timeinyears=time/365;
        uint256 interestamount = (tokenPrice * 15 * timeinyears) / 100;
        rewards[_user]=tokenPrice+interestamount;
        return tokenPrice+interestamount;
    }
    
    function claimReward() external {
       uint256 totalReward = calculateReward(msg.sender);
       
       require(rewards[msg.sender] > 0, "No rewards to claim");
       payable(msg.sender).transfer(totalReward);
      rewards[msg.sender] = 0;
    }


}


