import React from 'react'
import { useState, useEffect } from 'react'

function Home({marketplace, nft}) {
    const marketplaceItems = async () => {
        const itemCount = await marketplace.itemCount()
        let items = []
        for (let i = 1; i <= itemCount; i++){
            const item = await marketplace.item(i);
            if(!item.sold){
                //get URI url from nft contract
                const uri = nft.tokenURI(item.tokenId);
                const response = await fetch(uri);
                const metadata = await response.json();
                // get total price of the item(item price + fee)
                const totalprice = await marketplace.getTotalPrice(item.itemId)
            }
        }
    }

  return (
    <div className="flex justify-center">hello</div>
  )
}

export default Home