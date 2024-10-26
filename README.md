# Run the project

1. Install node modules and dependencies
   `npm i`

2. Start hardhat node
   `npx hardhat node`

3. Deploy smart contracts on local hardhat node.
   `npx hardhat ignition deploy ./ignition/modules/NFT.cjs --network localhost`

4. Run the project
   `npm run dev`

Note:
Please create the following variables (API Keys) from pinata.cloud website and include in your .env file:
VITE_PINATA_API_KEY
VITE_PINATA_API_SECRET
VITE_JWT
