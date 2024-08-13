import { ethers, Contract } from "ethers";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import NFTAbi from "./contractsData/NFT.json";
import MarketplaceAbi from "./contractsData/Marketplace.json";
import Home from "./Home";
import Create from "./Create";
import ListedItems from "./ListedItems";
import MyItems from "./MyItems";

// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 marketplace addr
// 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 nft addr

function App() {

  const [account, setAccount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nft, setNft] = useState({});
  const [marketplace, setMarketplace] = useState({});

  const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const marketplaceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  //Metamask Login/Connect
  const web3Handler = async()=>{
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    loadContracts(signer);
  }

  const loadContracts = async(signer) => {
    const marketplace = new Contract(marketplaceAddress, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace);
    //console.log("Marketplace", marketplace.target); // Use .target to get the address in ethers v6
    const nft = new Contract(nftAddress, NFTAbi.abi, signer);
    setNft(nft);
    setLoading(false);
  }

  return (
    <BrowserRouter>
      <Navbar web3Handler={web3Handler} account={account}/>
      {loading ? (
        <h1 className="text-3xl text-gray-600 font-2xl h-lvh flex justify-center items-center">
          ...awaiting metamask connection
        </h1>
      ) :(
        <>
        {/* <Home marketplace={marketplace} nft={nft}/> */}
        <Routes>
            <Route path = "/" element={<Home marketplace={marketplace} nft={nft}/>}/>
            <Route path = "/create" element={<Create marketplace={marketplace} nft={nft}/>}/>
            <Route path = "/my-listed-items" element={<ListedItems marketplace={marketplace} nft={nft} account={account}/>}/>
            <Route path = "/my-items" element={<MyItems marketplace={marketplace} nft={nft} account={account}/>}/>
        </Routes>
        </>
      )
      }
    </BrowserRouter>
  )
}

export default App

// npx hardhat node
// npx hardhat ignition deploy ./ignition/modules/NFT.cjs --network localhost