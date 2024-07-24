const {expect} = require("chai");

describe("NFTMarketplace", function(){
  let deployer, add1, add2, nft, marketplace;
  let feePercent = 1;

  this.beforeEach(async function(){
    // Get contract factories
    const NFT = await ethers.getContractFactory("NFT");
    const Marketplace = await ethers.getContractFactory("Marketplace");
    // Get signers
    [deployer, add1, add2] = await ethers.getSigners();
    // Deploy contracts
    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  });

  describe("Deployment", function(){
    it("Should track name and symbol of the nft collection.", async function(){
      expect(await nft.name()).to.equal("MY_NFT")
      expect(await nft.symbol()).to.equal("MN")
    })
    it("Should track feeAccount and feePercent of the marketplace.", async function(){
      expect(await marketplace.feeAccount()).to.equal(deployer.address)
      expect(await marketplace.feePercent()).to.equal(feePercent)
    })
  })

  // describe("Minting NFTs", function(){
  //   it("Should track each minted NFT", async function(){
  //     //address1 mints an NFT
  //     await nft.connect(add1).mint(URI)
  //     expect(await nft.tokenCount()).to.equal(1);
  //     expect(await nft.balanceOf(add1.address).to.equal(1));
  //     expect(await nft.tokenURI(1).to.equal(URI));
  //     //address2 mints an NFT
  //     await nft.connect(add2).mint(URI)
  //     expect(await nft.tokenCount()).to.equal(2);
  //     expect(await nft.balanceOf(add2.address).to.equal(1));
  //     expect(await nft.tokenURI(2).to.equal(URI));
  //   })
})