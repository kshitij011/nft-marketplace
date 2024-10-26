import { useEffect, useState } from "react";
import { ethers } from "ethers";

function Create({ marketplace, nft }) {
    const [image, setImage] = useState("");
    const [price, setPrice] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [hash, setHash] = useState("");
    const [metadataHash, setMetadataHash] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);

    useEffect(() => {
        if (hash) {
            const imageUrl = `https://gold-strict-puma-309.mypinata.cloud/ipfs/${hash}`;
            setImage(imageUrl);
            console.log("Image URL set:", imageUrl);
        }
    }, [hash]);

    useEffect(() => {
        if (metadataHash) {
            const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataHash}`;
            console.log("Metadata URL set:", metadataUrl);
            mintThenList(metadataUrl); // Call mintThenList with the correct metadata URL
        }
    }, [metadataHash]);

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== "undefined") {
            try {
                const fileData = new FormData();
                fileData.append("file", file);
                const request = await fetch(
                    "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_JWT}`,
                        },
                        body: fileData,
                    }
                );
                const response = await request.json();
                setHash(response.IpfsHash);
                setIsUploaded(true);
            } catch (error) {
                console.log("ipfs image upload error: ", error);
            }
        }
    };

    const createNFT = async (e) => {
        e.preventDefault();
        if (image && price && name && description) {
            try {
                // Create metadata
                const metadata = {
                    image: image,
                    price,
                    name,
                    description,
                };

                // Upload metadata to IPFS
                const metadataResponse = await fetch(
                    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_JWT}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(metadata),
                    }
                );
                const metadataJson = await metadataResponse.json();
                setMetadataHash(metadataJson.IpfsHash);
                console.log(
                    "Uploaded metadata to IPFS:",
                    metadataJson.IpfsHash
                );
            } catch (error) {
                console.log("IPFS metadata upload error:", error);
            }
        } else {
            alert("Fill all info");
        }
    };

    const mintThenList = async (uri) => {
        // mint nft
        await (await nft.mint(uri)).wait();
        console.log("NFT mint executed");
        // get tokenId of new nft
        const id = await nft.tokenId();
        // approve marketplace to spend nft
        await (await nft.setApprovalForAll(marketplace.target, true)).wait(); // Use .target to get the address in ethers v6
        // add nft to marketplace
        const listingPrice = ethers.parseEther(price.toString());
        await (await marketplace.makeItem(nft.target, id, listingPrice)).wait();
    };

    return (
        <div className="h-lvh bg-gradient-to-b from-green-300 to-teal-700 via-slate-300">
            <hr />
            <form className="flex mt-5 mx-56 flex-col h-3/5 items-center justify-around  bg-black bg-opacity-20 rounded-lg">
                <input
                    type="file"
                    required
                    name="file"
                    onChange={uploadToIPFS}
                    className=" bg-gray-300 bg-opacity-50 p-2 rounded-md border-2 border-black border-opacity-20"
                />
                <input
                    onChange={(e) => setName(e.target.value)}
                    size="lg"
                    required
                    type="text"
                    placeholder="Name"
                    className=" bg-gray-300 bg-opacity-50 p-2 rounded-md border-2 border-black border-opacity-20"
                />
                <input
                    onChange={(e) => setDescription(e.target.value)}
                    size="lg"
                    required
                    as="textarea"
                    placeholder="Description"
                    className=" bg-gray-300 bg-opacity-50 p-2 rounded-md border-2 border-black border-opacity-20"
                />
                <input
                    onChange={(e) => setPrice(e.target.value)}
                    size="lg"
                    required
                    type="number"
                    placeholder="Price in ETH"
                    className=" bg-gray-300 bg-opacity-50 p-2 rounded-md border-2 border-black border-opacity-20"
                />
                {/* <div className="bg-green-600 bg-opacity-80 px-2 rounded-md text-2xl font-bold text-gray-700 hover:bg-blue-600 border-2 border-black border-opacity-20">
                    <button
                        onClick={createNFT}
                        variant="primary"
                        size="lg"
                    >
                        Create & List NFT!
                    </button>
                </div> */}
                {isUploaded ? (
                    <div className="bg-green-600 bg-opacity-80 px-2 rounded-md text-2xl font-bold text-gray-700 hover:bg-blue-600 border-2 border-black border-opacity-20">
                        <button
                            onClick={createNFT}
                            variant="primary"
                            size="lg"
                        >
                            Create & List NFT!
                        </button>
                    </div>
                ) : (
                    <div className="bg-slate-600 bg-opacity-80 px-2 rounded-md text-2xl font-bold text-gray-700 hover:bg-blue-600 border-2 border-black border-opacity-20">
                        <button
                            variant="primary"
                            size="lg"
                            disabled
                            title="Select image and enter the details above."
                        >
                            Create & List NFT!
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Create;
