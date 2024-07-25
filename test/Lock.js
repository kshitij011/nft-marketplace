const {expect} = require("chai");
const { ethers } = require("hardhat");
// const {ethers} = require("ethers")

const toWei = (num) => {
  ethers.parseEther(num.toString());
}

const fromWei = (num) => {
  ethers.formatEther(num);
}

describe("NFTMarketplace", function(){
  let deployer, add1, add2, nft, marketplace;
  let feePercent = 1;
  let URI = "Sample URI";

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

  describe("Minting NFTs", function(){
    it("Should track each minted NFT", async function(){
      //address1 mints an NFT
      await nft.connect(add1).mint(URI)
      expect(await nft.tokenId()).to.equal(1);
      expect(await nft.balanceOf(add1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      //address2 mints an NFT
      await nft.connect(add2).mint(URI)
      expect(await nft.tokenId()).to.equal(2);
      expect(await nft.balanceOf(add2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    })
  })

  // describe("Making marketplace items", function(){
  //   beforeEach(async function(){
  //     await nft.connect(add1).mint(URI)
  //     await nft.connect(add1).setApprovalForAll(marketplace.address, true)
  //   })
  //   it("Should track newly created item, transfer NFT from seller to marketplace and emit offered event", async function(){
  //     //add1 offers their nft at the price of one ether
  //     await expect(marketplace.connect(add1).makeItem(nft.address, 1, toWei(1)))
  //     .to.emit(marketplace, "Offered")
  //     .withArgs(1, nft.address, 1, toWei(1), add1.address);

  //     // Owner of nft should now be the marketplace
  //     expect(await nft.ownerOf(1)).to.equal(marketplace.address);
  //     // Item count should now be equal to 1
  //     expect(await marketplace.itemCount()).to.equal(1);
  //     //Get items from items mapping then check fields to ensure they are correct
  //     const item = await marketplace.items(1);
  //     expect(item.itemId).to.equal(1);
  //     expect(item.nft).to.equal(nft.address);
  //     expect(item.tokenId).to.equal(1);
  //     expect(item.price).to.equal(toWei(1));
  //     expect(item.sold).to.equal(false);
  //   });

  //   it("Should fail if price is set to zero", async function(){
  //     await expect(
  //       marketplace.connect(add1).makeItem(nft.address,1 , 0)
  //     ).to.be.revertedWith("Price must be greater than zero");
  //   });
  // });

  describe("Making marketplace items", function () {
    let price = 1
    let result
    beforeEach(async function () {
      // add1 mints an nft
      await nft.connect(add1).mint(URI)
      // add1 approves marketplace to spend nft
      await nft.connect(add1).setApprovalForAll(marketplace.address, true)
    })


    it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
      // add1 offers their nft at a price of 1 ether
      await expect(marketplace.connect(add1).makeItem(nft.address, 1 , toWei(price)))
        .to.emit(marketplace, "Offered")
        .withArgs(
          1,
          nft.address,
          1,
          toWei(price),
          add1.address
        )
      // Owner of NFT should now be the marketplace
      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      // Item count should now equal 1
      expect(await marketplace.itemCount()).to.equal(1)
      // Get item from items mapping then check fields to ensure they are correct
      const item = await marketplace.items(1)
      expect(item.itemId).to.equal(1)
      expect(item.nft).to.equal(nft.address)
      expect(item.tokenId).to.equal(1)
      expect(item.price).to.equal(toWei(price))
      expect(item.sold).to.equal(false)
    });

    it("Should fail if price is set to zero", async function () {
      await expect(
        marketplace.connect(add1).makeItem(nft.address, 1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });
  });
})