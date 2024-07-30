import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers';

function Home({marketplace, nft}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const marketplaceItems = async () => {
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++){

      const item = await marketplace.item(i);
      if(!item.sold){
        //get URI url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of the item(item price + fee)
        const totalprice = await marketplace.getTotalPrice(item.itemId);
        // Add item to items array
        items.push({
          totalprice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })

      }
    }
    setItems(items);
    setLoading(false);
    console.log("marketplaceItems executed");
  }
  const purchaseItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, {value: item.totalprice})).wait()
    marketplaceItems();
  }

  useEffect(() => {
    marketplaceItems()
  }, [])

  if(loading) return (
    <div className="p-8">
      <h2>Loading...</h2>
    </div>
  )

  return (
    <div className="flex justify-center">

      <div  className='overflow-hidden bg-purple-800 mt-5 rounded-md ml-5 p-2 justify-between flex flex-col items-center max-h-72 max-w-48'>
        <div className="h-40 flex items-center">
        <img src="https://www.w3schools.com/html/img_girl.jpg" alt="Image" className='max-h-40 max-w-40 rounded object-cover'/>
        </div>
        <div color='secondary' className='overflow-hidden border-t-2 mt-1 text-white'>
          <div>Item Name</div>
          <div className='font-thin text-sm'>Description of the item. This is the image...</div>
        </div>
        <div>
          <div className="bg-green-300 rounded-md p-2 font-bold mt-1">
            <button >
              Buy for 1.0 ETH
            </button>
          </div>
        </div>
      </div>




      {
        items.length > 0 ?
        (<div>
          {items.map((item, id) => {
            <div  className='overflow-hidden bg-purple-800 mt-5 rounded-md ml-5 p-2 justify-between flex flex-col items-center max-h-72 max-w-48'>
            <div className="h-40 flex items-center">
            <img src={item.image} alt={`${itam.name} image`} className='max-h-40 max-w-40 rounded object-cover'/>
            </div>
            <div color='secondary' className='overflow-hidden border-t-2 mt-1 text-white'>
              <div>{item.name}</div>
              <div className='font-thin text-sm'>{item.description}</div>
            </div>
            <div>
              <div className="bg-green-300 rounded-md p-2 font-bold mt-1">
                <button >
                  Buy for {ethers.formatEther(item.totalprice)} ETH
                </button>
              </div>
            </div>
          </div>
          })}
        </div>
        ) : (
          <div className="p-8">
            <h2>No Listed Items</h2>
          </div>
        )
      }
    </div>

  )
}

export default Home