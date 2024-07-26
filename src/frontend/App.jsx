import { ethers } from "ethers";
import { useState } from "react";
import Navbar from "./Navbar";

import NFTAbi from "./contractsData/NFT.json";
import MarketplaceAbi from "./contractsData/Marketplace.json";

// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 marketplace addr
// 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 nft addr

function App() {

  const [account, setAccount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nft, setNft] = useState({});
  const [marketplace, setMarketplace] = useState({});

  const nftAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const marketplaceAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  //Metamask Login/Connect
  const web3Handler = async()=>{
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    loadContracts(signer);
    console.log("web3handler ran");
  }

  const loadContracts = async(signer) => {
    const marketplace = new ethers.Contract(marketplaceAddress, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace);
    const nft = new ethers.Contract(nftAddress, NFTAbi.abi, signer);
    setNft(nft);
    setLoading(false);
  }

  return (
    <>
      <Navbar web3Handler={web3Handler} account={account}/>
      {loading &&
        <h1 className="text-3xl text-gray-600 font-2xl h-lvh flex justify-center items-center">
          ...awaiting metamask connection
        </h1>
      }
    </>
  )
}

export default App
