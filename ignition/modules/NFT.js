// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// export default buildModule("NFT", (m) => {

//   const NFT = m.contract("NFT", []);

//   return { NFT };
// });

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFT", (m) => {

  const NFT = m.contract("NFT", []);
  const Marketplace = m.contract("Marketplace", [1]);

  return { NFT, Marketplace };
});

// 0x5FbDB2315678afecb367f032d93F642f64180aa3
// 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512