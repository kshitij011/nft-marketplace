import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

function renderSoldItems(items) {
    return (
        <>
            <h2>Sold</h2>
            <div>
                {items.map((item, idx) => (
                    <div className="flex justify-center">
                        <div
                            key={idx}
                            className="overflow-hidden bg-red-500 mt-5 rounded-md ml-5 p-2 justify-between flex flex-col items-center max-h-72 w-48"
                        >
                            <div className="h-40 flex items-center">
                                <a href={item.metadata}>
                                    <img
                                        src={item.image}
                                        alt={`${item.name} image`}
                                        className="max-h-40 max-w-40 rounded object-cover"
                                    />
                                </a>
                            </div>

                            <div className="overflow-hidden border-t-2 mt-1 text-white">
                                <div>{item.name}</div>
                                <div className="font-thin text-sm">
                                    Sold for{" "}
                                    {ethers.formatEther(item.totalprice)} ETH
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function ListedItems({ marketplace, nft, account }) {
    const [loading, setLoading] = useState(true);
    const [listedItems, setListedItems] = useState([]);
    const [soldItems, setSoldItems] = useState([]);

    const loadListedItems = async () => {
        let listedItems = [];
        let soldItems = [];
        const itemCount = await marketplace.itemCount();
        for (let index = 1; index <= itemCount; index++) {
            // Here index is itemId
            const i = await marketplace.items(index);
            if (i.seller.toLowerCase() === account) {
                const uri = await nft.tokenURI(i.tokenId);
                const response = await fetch(uri);
                const metadata = await response.json();
                const totalprice = await marketplace.getTotalPrice(i.itemId);

                let item = {
                    totalprice,
                    price: i.price,
                    itemId: i.itmeId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                };
                i.sold ? soldItems.push(item) : listedItems.push(item);
            }
        }
        setLoading(false);
        setListedItems(listedItems);
        setSoldItems(soldItems);
    };

    useEffect(() => {
        loadListedItems();
    }, []);

    if (loading)
        return (
            <div className="p-8 h-lvh w-full bg-gradient-to-b from-orange-500 to-orange-700 via-slate-400">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <div className="flex justify-center flex-row flex-wrap h-lvh w-full bg-gradient-to-b from-orange-500 to-orange-700 via-slate-400">
            {listedItems.length > 0 ? (
                <div className="px-5 py-3">
                    <h2 className="text-white font-bold">Listed Items</h2>
                    <div className="flex justify-center">
                        {listedItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="overflow-hidden bg-purple-800 mt-5 rounded-md ml-5 p-2 justify-between flex flex-col items-center max-h-72 w-48"
                            >
                                <div className="h-40 flex items-center">
                                    <a href={item.metadata}>
                                        <img
                                            src={item.image}
                                            alt={`${item.name} image`}
                                            className="max-h-40 max-w-40 rounded object-cover"
                                        />
                                    </a>
                                </div>
                                <div
                                    color="secondary"
                                    className="overflow-hidden border-t-2 mt-1 text-white"
                                >
                                    <div>{item.name}</div>
                                    <div className="font-thin text-sm">
                                        Listed for{" "}
                                        {ethers.formatEther(item.totalprice)}{" "}
                                        ETH
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {soldItems.length > 0 && renderSoldItems(soldItems)}
                </div>
            ) : (
                <h1 className="text-3xl text-gray-600 font-2xl h-lvh flex justify-center items-center">
                    No listed assets
                </h1>
            )}
        </div>
    );
}

export default ListedItems;
