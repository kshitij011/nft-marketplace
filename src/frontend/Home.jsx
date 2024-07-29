import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers';

function Home({marketplace, nft}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const marketplaceItems = async () => {
    console.log("marketplaceItems");
    const itemCount = await marketplace.itemCount()
    let items = []
    console.log("marketplaceItems 1");
    for (let i = 1; i <= itemCount; i++){
    console.log("marketplaceItems 1st");

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
      console.log("marketplaceItems 2");

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

            <div  className='overflow-hidden bg-slate-400'>
              <div>Image</div>
              <div color='secondary'>
                <div>Item Name</div>
                <div>Description of the item.</div>
              </div>
              <div>
                <div className="d-grid">
                  <button >
                    Buy for 1.0 ETH
                  </button>
                </div>
              </div>
            </div>

      {
        items.length > 0 ?
        (<div className="px-5">
          {items.map((item, id) => {
            <div key = {id} className='overflow-hidden'>
              <div src={item.image} />
              <div color='secondary'>
                <div>{item.name}</div>
                <div>{item.description}</div>
              </div>
              <div>
                <div className="d-grid">
                  <button onClick={() => purchaseItem(item)}>
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