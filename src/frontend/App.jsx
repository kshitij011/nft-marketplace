import { ethers, Contract } from "ethers";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import NFTAbi from "./contractsData/NFT.json";
import MarketplaceAbi from "./contractsData/Marketplace.json";
import Home from "./Home";
import Create from "./Create";
import MyListedItems from "./MyListedItems";
import MyItems from "./MyItems";

function App() {
    const [account, setAccount] = useState(false);
    const [loading, setLoading] = useState(true);
    const [nft, setNft] = useState({});
    const [marketplace, setMarketplace] = useState({});

    const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const marketplaceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    //Metamask Login/Connect
    const web3Handler = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // switching chainId
        // const chainId = await provider.send("eth_chainId", []);
        // if (chainId != "0xaa36a7") {
        //     alert("Switch network to Sepolia Testnet");
        // }

        // if (chainId != "0xaa36a7") {
        //     alert("Switch network to Sepolia Testnet");
        //     await ethereum.request({
        //         method: "wallet_addEthereumChain",
        //         params: [
        //             {
        //                 chainId: "0xaa36a7",
        //                 chainName: "Sepolia test network",
        //                 rpcUrls: ["https://sepolia.infura.io/v3/"],
        //                 nativeCurrency: {
        //                     name: "SepoliaETH",
        //                     symbol: "ETH",
        //                     decimals: 18,
        //                 },
        //                 blockExplorerUrls: ["https://sepolia.etherscan.io"],
        //             },
        //         ],
        //     });
        // }

        loadContracts(signer);
    };

    const loadContracts = async (signer) => {
        const marketplace = new Contract(
            marketplaceAddress,
            MarketplaceAbi.abi,
            signer
        );
        setMarketplace(marketplace);
        const nft = new Contract(nftAddress, NFTAbi.abi, signer);
        setNft(nft);
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-b from-yellow-300 to-yellow-700 via-slate-200">
            <BrowserRouter>
                <Navbar
                    web3Handler={web3Handler}
                    account={account}
                />
                {loading ? (
                    <h1 className="text-3xl text-gray-600 font-2xl h-lvh flex justify-center items-center">
                        ...awaiting metamask connection
                    </h1>
                ) : (
                    <>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Home
                                        marketplace={marketplace}
                                        nft={nft}
                                    />
                                }
                            />
                            <Route
                                path="/create"
                                element={
                                    <Create
                                        marketplace={marketplace}
                                        nft={nft}
                                    />
                                }
                            />
                            <Route
                                path="/my-listed-items"
                                element={
                                    <MyListedItems
                                        marketplace={marketplace}
                                        nft={nft}
                                        account={account}
                                    />
                                }
                            />
                            <Route
                                path="/my-items"
                                element={
                                    <MyItems
                                        marketplace={marketplace}
                                        nft={nft}
                                        account={account}
                                    />
                                }
                            />
                        </Routes>
                    </>
                )}
            </BrowserRouter>
        </div>
    );
}

export default App;

// npx hardhat node
// npx hardhat ignition deploy ./ignition/modules/NFT.cjs --network localhost
