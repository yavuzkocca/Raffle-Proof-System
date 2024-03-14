//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import '../base/CustomChanIbcApp.sol';

contract RaffleNFT is ERC721, CustomChanIbcApp {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    string tokenURIPolyWinner;

    constructor(IbcDispatcher _dispatcher) 
    CustomChanIbcApp(_dispatcher) ERC721("ProofOfWinnerNFT", "PolyWinner"){
        tokenURIPolyWinner = "https://i.ibb.co/3y0SGCH/winner-nft.webp";
    }

    function mint(address recipient)
        public
        returns (uint256)
    {
        currentTokenId.increment();
        uint256 tokenId = currentTokenId.current();
        _safeMint(recipient, tokenId);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return tokenURIPolyWinner;
    }

    function updateTokenURI(string memory _newTokenURI) public {
        tokenURIPolyWinner = _newTokenURI;
    }

    // IBC methods

    // This contract only receives packets from the IBC dispatcher

    function onRecvPacket(IbcPacket memory packet) external override onlyIbcDispatcher returns (AckPacket memory ackPacket) {
        (address decodedWinner) = abi.decode(packet.data, (address));

        uint256 winnerNFTId = mint(decodedWinner);

        bytes memory ackData = abi.encode(decodedWinner,winnerNFTId);

        return AckPacket(true, ackData);
    }

    function onAcknowledgementPacket(IbcPacket calldata, AckPacket calldata) external view override onlyIbcDispatcher {
        require(false, "This contract should never receive an acknowledgement packet");
    }

    function onTimeoutPacket(IbcPacket calldata) external view override onlyIbcDispatcher {
        require(false, "This contract should never receive a timeout packet");
    }
}
