#  Quest-Into-The-Polyverse-Phase-1 : Cross-chain Raffle Proof System



# Team Members
@sturec5 - Lead Developer 

@yavuzkocca - Developer

# Description

This application enables a user to enter a Raffle on a contract on OP Sepolia. After the raffle is completed, the winner gets a ERC-721 NFT for free on Base Sepolia even though the users entered via OP Sepolia.


Features:

Uses Polymer x IBC as the cross-chain format

Commits to the spirit of application specific chains/rollups where entering the raffle function can be specialized on one chain, NFT distribution to the winner of the raffle on another and both can form composable applications through interoperability.

# Resources used
The repo uses the ibc-app-solidity-template as starting point and adds custom contracts Raffle and RaffleNFT that implement the custom logic.

It changes the send-packet.js script slightly to adjust to the custom logic.

Additional resources used:

Hardhat

Blockscout

# Steps
After cloning the repo, install dependencies:
```bash
just install
```
And add your private key to the .env file (rename it from .env.example).

Then make sure that the config has the right contracts:

```bash
just set-contracts optimism Raffle && \
just set-contracts base RaffleNFT
```
Compile Contracts:
```bash
just compile
```

## Deployment and Creating channels

Then you can deploy the contract if you want to have a custom version, but you can use the provided contract addresses that are prefilled in the config. 
If you want to deploy your own, run:

```bash
just deploy optimism base false
```

then verify contracts:
```bash
npx hardhat --network optimism verify <ContractAddress> "0x58f1863f75c9db1c7266dc3d7b43832b58f35e83"
```

```bash
npx hardhat --network base verify <ContractAddress> "0xfc1d3e02e00e0077628e8cc9edb6812f95db05dc" "URL"
```

and create a channel:

```bash
just create-channel
```

This updates frontend contract
```bash
node update_frontend.js
```
```bash
cd frontend
```
```bash
yarn
```
```bash
yarn dev
```
Open browser and enter http://localhost:3000/

Enter Raffle then End Raffle with the wallet which the contracts deployed.

Then send packet.

### Sending a packet

Now with an existing channel in the config  run:

```bash
just send-packet optimism false
```
You'll see an active waiting poll in the terminal and will be informed if the packet was sent successfully.

You can check the Nft from Base Sepolia Explorer.

# Proof of Testnet Interaction

After following the steps above you should have interacted with the testnet. You can check this at the IBC Explorer.

Here's the data of our application:

Raffle (OP Sepolia) : 0xA6269f45B3223277046e11f728AAF7354b3a6c93

RaffleNFT (Base Sepolia): 0x3240b3b4dC1E0a542505D688A4A834c40B14C4bc

Channel (OP Sepolia): channel-2126

Channel (Base Sepolia): channel-2127

Proof of Testnet interaction:

[Contract Creation](https://optimism-sepolia.blockscout.com/tx/0x6f059a73e29f6607cf731220b40e455ab4d706aed2d89cee9e090136c4857ec3)

[Create Channel](https://optimism-sepolia.blockscout.com/tx/0x1ae6d167c5b2a49098fbc95ac6906d5b69cf21b70c1ce67bcee3fcff4e52a496)

[Enter Raffle](https://optimism-sepolia.blockscout.com/tx/0xaecba3161c3710bb10d66815b754c947194a7d5d98b262503bfe8b98208cbc91)

[Send Packet](https://optimism-sepolia.blockscout.com/tx/0x7bb7a5ef8d5b6b524ecc2c4bda47544bda1e5eac26fc5e02f0237f732ffcabe9)

[RecvTx](https://base-sepolia.blockscout.com/tx/0xb378dd4736ac72484af47c84ea217401bd3732202d50b74400475b5852f77acf)

[Ack](https://optimism-sepolia.blockscout.com/tx/0xca7721689c961973bdebfcff7625aaf1add07b7fb0d05bcc301c8d4ac646f6fd)

# Challenges Faced
Debugging was a bit tricky when the sendPacket part worked fine on the contract, but there was a problem later with the packet.


# License
 
[MIT](https://choosealicense.com/licenses/mit/)
