// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../base/CustomChanIbcApp.sol';

contract Raffle is CustomChanIbcApp {
    
    address public manager;
    address[] public players;
    address public winner;
    bool ibcNFTMinted;
    
    constructor( IbcDispatcher _dispatcher) CustomChanIbcApp(_dispatcher) {
        manager = msg.sender;

    }

    

    function enter() public payable {
        require(msg.value > 0.01 ether, "Minimum 0.01 ether required to enter the raffle.");
        
        players.push(msg.sender);
    }

    function pickWinner() public restricted {
        require(players.length > 0, "No players participated in the raffle.");
        
        uint index = random() % players.length;
        winner = players[index];
        payable(winner).transfer(address(this).balance);
        
        ibcNFTMinted = false;
        players = new address[](0);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can pick a winner.");
        _;
    }

    // IBC methods

    /**
     * @dev Sends a packet with a greeting message over a specified channel.
     * @param channelId The ID of the channel to send the packet to.
     * @param timeoutSeconds The timeout in seconds (relative).
     
     */
    function sendPacket(
        bytes32 channelId,
        uint64 timeoutSeconds
        
        
    ) external {
        require(ibcNFTMinted == false, "Already has a ProofOfVote NFT minted on counterparty");

        
        bytes memory payload = abi.encode(winner);

        uint64 timeoutTimestamp = uint64((block.timestamp + timeoutSeconds) * 1000000000);

        dispatcher.sendPacket(channelId, payload, timeoutTimestamp);
    }

    function onRecvPacket(IbcPacket memory) external override view onlyIbcDispatcher returns (AckPacket memory ackPacket) {
        require(false, "This function should not be called");

        return AckPacket(true, abi.encode("This function should not be called"));
    }

    function onAcknowledgementPacket(IbcPacket calldata, AckPacket calldata ack) external override onlyIbcDispatcher {
        ackPackets.push(ack);
        
        // decode the ack data, find the address of the voter the packet belongs to and set ibcNFTMinted true
        (address winnerNFT, uint256 winnerNFTId) = abi.decode(ack.data, (address, uint256));
        
        ibcNFTMinted = true;
    }

    function onTimeoutPacket(IbcPacket calldata packet) external override onlyIbcDispatcher {
        timeoutPackets.push(packet);
        // do logic
    }
}

