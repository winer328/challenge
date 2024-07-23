import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../api/apiConfig'

export default function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const first_name = useRef()
    const last_name = useRef()
    const email = useRef()
    const password = useRef()
    const password2 = useRef(undefined)

    const wallet = useRef()
    const [wallet_address, setWallet] = useState("");
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [error, setError] = useState(null);

    const checkIfWalletIsConnected = useCallback(async () => {
        try {
          if (window.ethereum) {
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            const account = accounts[0];
            setIsWalletConnected(true);
            setWallet(account);
            setError(null);
          } else {
            setError("Please install a MetaMask wallet.");
            console.log("No Metamask detected");
          }
        } catch (error) {
          setIsWalletConnected(false);
          setError("Please try to reconnect to your MetaMask wallet.");
          console.log(error);
        }
      }, []);


    async function onSubmitForm(event) {
        event.preventDefault()
        const data = {
            first_name: first_name.current.value,
            last_name: last_name.current.value,
            email: email.current.value,
            password: password.current.value,
            password2: password2.current.value,
            wallet: wallet.current.value
          };

        setLoading(true)

        try {
            const response = await axiosInstance.post('auth/register', JSON.stringify(data))

            setLoading(true)

            navigate('/auth/login')
        } catch (error) {
            setLoading(false)
            // TODO: handle errors
        }
    }

    return (
        <div className='container'>
            <h2>Register</h2>
            <form onSubmit={onSubmitForm}>
                <div className="mb-3">
                    <input type="text" placeholder='First Name' autoComplete='off' className='form-control' id='first_name' ref={first_name} />
                </div>
                <div className="mb-3">
                    <input type="text" placeholder='Last Name' autoComplete='off' className='form-control' id='last_name' ref={last_name} />
                </div>
                <div className="mb-3">
                    <input type="email" placeholder='Email' autoComplete='off' className='form-control' id="email" ref={email} />
                </div>
                <div className="mb-3">
                    <input type="password" placeholder='Password' autoComplete='off' className='form-control' id="password" ref={password} />
                </div>
                <div className="mb-3">
                    <input type="password" placeholder='Confirm Password' autoComplete='off' className='form-control' id="passwordConfirmation" ref={password2} />
                </div>
                <div className="mb-3">
                    <div className="mb-3">{error && <div>{error}</div>}</div>
                    <button className="wallet-button btn btn-info mb-3"  type="button" onClick={checkIfWalletIsConnected}>
                        {isWalletConnected ? "Reconnect" : "Connect Wallet"}
                    </button>
                    <div className="mb-3">
                        <input type="text" placeholder='Wallet address' autoComplete='off' className='form-control' id='wallet' ref={wallet} value={wallet_address} disabled/>
                    </div>
                </div>
                <div className="mb-3">
                    <button disabled={loading} className='btn btn-success' type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}
