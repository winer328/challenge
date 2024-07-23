import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser'
import Web3 from 'web3'


export default function Home() {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const getUser = useUser()

    useEffect(() => {
        getUser();
        if (typeof window.ethereum !== 'undefined') {
            const web3Instance = new Web3(window.ethereum);
            window.ethereum.request({ method: 'eth_requestAccounts' })
              .then(accounts => {
                if(accounts.find((elem)=>elem===user.wallet) != undefined){
                    web3Instance.eth.getBalance(accounts[0])
                    .then(bal => {
                        const balanceInEth = web3Instance.utils.fromWei(bal, 'ether');
                        setBalance(balanceInEth);
                    })
                    .catch(err => console.error('Error fetching balance:', err));
                    }
              })
              .catch(err => console.error('Error fetching accounts:', err));
          } else {
            alert('Please install Metamask and login again.');
          }
    }, [])

    return (
        <div className='container mt-3'>
            <h2>
                <div className='row'>
                    <div className="mb-12">
                        {user?.email !== undefined ? <div>List user Ethereum balance: {user.wallet} (${balance})</div> : 'Please login first'}
                    </div>
                </div>
            </h2>
        </div>
    )
}
