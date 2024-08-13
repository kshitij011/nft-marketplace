import React from 'react'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react';

function MyItems({marketplace, nft, account}) {
  const [loading, setLoading] = useState(true);
  const [myItems, setMyItems] = useState([]);

  const LoadItems = async () => {
    console.log("inside LoadItems");
    // Fetch purchased items from marketplace by quering offered events with the buyer set as the user
    const filter = await marketplace.filters.Bought(null, null, null, null, null, account);
    const results = await marketplace.queryFilter(filter)

    // Fetch metadata of each nft and add that to listedItem object
    const purchases = await Promise.all(results.map(async i => {
      // Fetch arguments from each results
      i = i.args
      const uri = await nft.tokenURI(i.tokenId)
      const response = await fetch(uri)
      const metadata = await response.json()
      const totalprice = await marketplace.getTotalPrice(i.itemId);

      let item = {
        totalprice,
        price: i.price,
        itemId: i.itmeId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return item
    }))
    setLoading(false)
    setMyItems(purchases)
    console.log("LoadItems executed");

  }

  useEffect(()=>{
    LoadItems();
  }, [])

  if(loading) return (<div className='font-bold flex mt-5 justify-center'><h1>Loading...</h1></div>)

  return (
    <div className='flex justify-center'>
      {myItems.length > 0 ?
      (<div className="flex justify-center">
        {myItems.map((item, idx) =>(
          (<div key={idx} className='overflow-hidden bg-green-400 mt-5 rounded-md ml-5 p-2 justify-between flex flex-col items-center max-h-72 w-48'>
          <div className="h-40 flex items-center">
            <a href={item.metadata}><img src={item.image} alt={`${item.name} image`} className='max-h-40 max-w-40 rounded object-cover'/></a>
          </div>
          <div color='secondary' className='overflow-hidden border-t-2 mt-1 text-white'>
            <div>{item.name}</div>
            <div className='font-thin text-sm'>Bought for {ethers.formatEther(item.totalprice)} ETH</div>
          </div>
        </div>)
        ))}

      </div>) : (
        <div className='font-bold flex mt-5 justify-center'><h1>No Purchases</h1></div>
      )
      }
    </div>
  )
}

export default MyItems