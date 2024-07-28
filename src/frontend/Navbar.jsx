import React from 'react'
import { Link} from 'react-router-dom'

export default function Navbar({web3Handler, account}) {
  return (
        <div className='bg-slate-500 py-3 text-white text-2xl h-16'>
            <ul className='flex justify-around'>
                <li className='font-bold text-red-400'><Link to="/">Home</Link></li>
                <li><Link to="/create">Create</Link></li>
                <li><Link to="/my-listed-items">My Listed Items</Link></li>
                <li><Link to="/my-items">My Items</Link></li>

                <div>
                    {account ? (
                    <div className="button inline bg-gray-300 px-2 rounded-md text-gray-700"
                    href={`https://etherscan.io/${account}`}
                    target="_blank">
                        {account.slice(0, 5)+'...'+ account.slice(38,42)}
                    </div>
                    ) : (
                        <button className='bg-blue-300 px-2 rounded-md text-green-500 font-bold font-sans' onClick={web3Handler}>Connect wallet</button>
                    )}
                </div>
            </ul>
        </div>
  )
}
