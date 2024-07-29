import React from 'react'
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function Create() {
    const [image, setImage] = useState('')
    const [price, setPrice] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const uploadToIPFS = async (event) => {
      event.preventDefault()
      const file = event.target.files[0]
      if (typeof file !== 'undefined') {
        try {
          const result = await client.add(file)
          console.log(result)
          setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
        } catch (error){
          console.log("ipfs image upload error: ", error)
        }
      }
    }
    const createNFT = async () => {
      if (!image || !price || !name || !description) return
      try{
        const result = await client.add(JSON.stringify({image, price, name, description}))
        mintThenList(result)
      } catch(error) {
        console.log("ipfs uri upload error: ", error)
      }
    }
    const mintThenList = async (result) => {
      const uri = `https://ipfs.infura.io/ipfs/${result.path}`
      // mint nft
      await(await nft.mint(uri)).wait()
      // get tokenId of new nft
      const id = await nft.tokenId()
      // approve marketplace to spend nft
      await(await nft.setApprovalForAll(marketplace.address, true)).wait()
      // add nft to marketplace
      const listingPrice = ethers.utils.parseEther(price.toString())
      await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
    }

    return (
      <div className="h-lvh border-black ">
        <form className="flex mt-5 mx-14 flex-col h-3/5 items-center justify-around bg-gray-100 rounded-lg">
        <input
          type="file"
          required
          name="file"
          onChange={uploadToIPFS}
          className=' bg-gray-300 p-2 rounded-md'
        />
        <input onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" className=' bg-gray-300 p-2 rounded-md'/>
        <input onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" className=' bg-gray-300 p-2 rounded-md'/>
        <input onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" className=' bg-gray-300 p-2 rounded-md'/>
        <div className="bg-blue-400 px-2 rounded-md text-2xl font-bold text-gray-700 hover:bg-blue-600">
          <button onClick={createNFT} variant="primary" size="lg">
              Create & List NFT!
          </button>
        </div>
      </form>
      </div>
    );
}

export default Create