import Web3 from "web3";
import Web3Modal from "web3modal";
import React, { useReducer, useState, useEffect } from 'react';
import ContractABI from "./logoABI"
import Whitelist4 from "./Whitelist4";

let provider = null;
let web3 = null;
let accounts = null;
let networkId = null;
//const balance2 = null;
let connectedWalletAddress = null;
let contract = null;
let ethersContract = null;
const ethersProvider = null;
const etherABI = null;
let signer = null;
let hashArray = [];

export default function NFTWalletBridge(e) {

    const tokenAddress = e.bridgeParams.tokenAddress;
    const providerOptions = e.bridgeParams.providerOptions;

    const [isConnected, setConnected] = useState(false);
    const [tokenBalance, setTokenBalance] = useState({ trueBalance: 'N/A', theBalance: 'N/A', connectedWalletAddress: 'N/A', filteredAddress: 'N/A', isWhiteListed : false });
    const [isWaiting, setIsWaiting] = useState(false);
    const [numMinted, setnumMinted] = useState(0);
    const [txs, setTxs] = useState(hashArray);
    const [loaded, setLoaded] = useState(true);
    const [hashTx, sethashTx] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isWhiteListed, setIsWhiteListed] = useState(false);

    //const mintType = process.env.mintType 

    //const initValue = { setxmPower, setConnected };

    const contractABI = ContractABI()


    async function showWeb3Modal() {
        provider = null;
        try {



            const web3Modal = new Web3Modal({
                cacheProvider: false, // optional
                providerOptions
                //disableInjectedProvider: false // required
            });

            web3Modal.clearCachedProvider()

            await launchWeb3ModalConnection(web3Modal);

            setConnected(true)

            if (!accounts) {
                accounts = await web3.eth.getAccounts();

                networkId = await web3.eth.net.getId();

                connectedWalletAddress = accounts[0].toLowerCase();

                contract = new web3.eth.Contract(contractABI, tokenAddress, { from: connectedWalletAddress, gas: process.env.defaultGas });
                let totalShares = await contract.methods.totalSupply.call()

                let resultTS = await totalShares.call();
                //console.log(`totalShares: ${resultTS}`)
                setnumMinted(resultTS)


                let balance2 = await web3.eth.getBalance(accounts[0]);

                balance2 = web3.utils.fromWei(balance2, "ether")
                const filtered = connectedWalletAddress.substr(0, 6) + "..." + connectedWalletAddress.substr(connectedWalletAddress.length - 6);
                
                let thisReturn = await CheckIfOnWhitelist(process.env.mintType, connectedWalletAddress)
                // let thisReturn = false
                // if ((mintType == "Pre-Sale" && whitelist.indexOf(connectedWalletAddress) > -1) || mintType == "Public" )
                // {
                //     thisReturn = true
                // } 
                
                setTokenBalance({ trueBalance: balance2, theBalance: balance2, connectedWalletAddress: connectedWalletAddress, filteredAddress: filtered , 
                    isWhiteListed : thisReturn
                });
            }
        }
        catch (e) { }
    }

    async function CheckIfOnWhitelist(saleType, thisAddress) {
        let displayMint = false;

        const whitelist = Whitelist4();
        let lowerCaseWhitelist = []
        whitelist.forEach(element => {
            lowerCaseWhitelist.push(element.toLowerCase())
        });

        //console.log(lowerCaseWhitelist)

        if (saleType == "Public") {
            displayMint = true;
        }
        else {           
            if (lowerCaseWhitelist.indexOf(thisAddress.toLowerCase()) > -1) {
                displayMint = true;
            }
        }

        setIsWhiteListed(displayMint);

        return displayMint;
    }

    async function disconnect() {
        // await provider.close();
        provider = null;

        const web3Modal = new Web3Modal({
            cacheProvider: true, // optional
            providerOptions
            //disableInjectedProvider: false // required
        });
        web3Modal.clearCachedProvider()
        setConnected(false)
        window.localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    }

    async function launchWeb3ModalConnection(web3Modal) {

        provider = await web3Modal.connect();

        if (process.env.debug) {
            console.log(provider);
            // console.log(signer);
        }

        web3 = new Web3(provider)

        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts) => {
            if (process.env.debug) {
                console.log(accounts);
            }
        });

        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
            if (process.env.debug) {
                console.log(chainId);
                console.log("connect" + " - " + error);
            }
        });

        // Subscribe to provider connection
        provider.on("connect", (info) => {
            if (process.env.debug) {
                console.log(info);
                console.log("connect" + " - " + error);
            }
        });

        // Subscribe to provider disconnection
        provider.on("disconnect", (error) => {

            console.log("disconnect" + " - " + error);
            provider = null;
            setConnected(false);
            setTokenBalance({ theBalance: 'N/A', connectedWalletAddress: 'N/A', isWhiteListed : false })
            disconnect()
        });

        provider.on("disconnect", (error) => {

            console.log("disconnect" + " - " + error);
            provider = null;
            setConnected(false);
            setTokenBalance({ theBalance: 'N/A', connectedWalletAddress: 'N/A', isWhiteListed : false })
            disconnect()
        });
        return ethersProvider;//new Web3(provider);
    }

    function print(str) {
        const p = document.createElement("p");
        p.innerText = str;

        document.getElementById("userWalletAddress").appendChild(p);
    }

    // function ShowWalletConnect(props) {
    //     const isLoggedIn = checkIfLoggedIN(props);
    //     if (isLoggedIn) {
    //         return (
    //             <Button variant="outlined" size="Large" sx={{
    //                 border: '1px solid rgba(46, 125, 50, 0.5)',
    //                 color: 'success.main',
    //             }} onClick={() => disconnect()}>Disconnect Wallet</Button>
    //         );
    //     }
    //     return (
    //         <div className="showPortisBtn">
    //             <Button variant="outlined" size="Large" sx={{
    //                 border: '1px solid rgba(46, 125, 50, 0.5)',
    //                 color: 'success.main',
    //             }} onClick={() => showWeb3Modal()}>Connect to Wallet</Button>
    //         </div>);
    // }

    function checkIfLoggedIN(props) {
        return props == undefined ? false : true && props.isConnected == undefined ? false : props.isConnected;
    }


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    async function sendMint(Amount) {

        if (process.env.debug) {
            console.log(Amount);
        }

        //const TotalTokens = 0.075 * Amount;

        let ethValue = 0;

        if (process.env.mintType == "Public") {
            ethValue = +process.env.ethValue;
        }
        else {
            ethValue = +process.env.ethWLValue;
        }
        const TotalTokens = Math.round((ethValue * Amount) * 10000) / 10000
        //const TotalTokens = (+process.env.ethValue).toFixed(4) * Amount;

        let currentGasPrice = await web3.eth.getGasPrice()

        if (process.env.debug) {
            console.log(`currentGasPrice: ${currentGasPrice}`)
        }

        let gas_price = process.env.defaultGas;//Web3.fromWei(currentGasPrice, 'gwei') 

        if (process.env.debug) {
            console.log(`gas_price: ${gas_price}`)
        }

        var tokens = web3.utils.toWei(TotalTokens.toString(), 'ether')
        var bntokens = web3.utils.toBN(tokens)
        contract = new web3.eth.Contract(contractABI, tokenAddress, { from: connectedWalletAddress, gas: process.env.defaultGas * Amount });
        setIsWaiting(true)
        setErrorMessage("");


        if (process.env.mintType == "Public") {
            let txTransfer = await contract.methods
                .openKitchenMint(process.env.messagehash, Amount)
                .send({ from: connectedWalletAddress, value: bntokens })
                .on('transactionHash', function (hash) {
                    //hashArray = [];

                    hashArray.push({ id: 1, txHash: hash, filteredTxHash: hash.substr(0, 10) + "..." + hash.substr(hash.length - 10) });
                    setTxs(hashArray);
                    sethashTx(GetHashes(txs));
                    //console.log(hash);
                })
                .then(function (result) {
                    setIsWaiting(false);
                    //alert('Transaction success');
                }).catch(function (e) {
                    setIsWaiting(false)
                    setErrorMessage(e.message)
                    console.log(e)
                });

        }
        if (process.env.mintType == "Pre-Sale") {
            let txTransfer1 = await contract.methods
                .privateBanquetMint(process.env.messagehash, Amount)
                .send({ from: connectedWalletAddress, value: bntokens })
                .on('transactionHash', function (hash) {
                    //hashArray = [];

                    hashArray.push({ id: 1, txHash: hash, filteredTxHash: hash.substr(0, 10) + "..." + hash.substr(hash.length - 10) });
                    setTxs(hashArray);
                    sethashTx(GetHashes(txs));
                    //console.log(hash);
                })
                .then(function (result) {
                    setIsWaiting(false);
                    //alert('Transaction success');
                }).catch(function (e) {
                    setIsWaiting(false)
                    setErrorMessage(e.message)
                    console.log(e)
                });
        }


        // let txTransfer = await contract.methods.mint1(Amount).estimateGas()
        // .then(function (estimate) {
        //   console.log("Estimated gas to execute mint: ", estimate);
        // });

        //let txTransfer = await contract.methods.mint1(Amount).call();
        //let txTransfer2 = txTransfer.estimateGas({from: connectedWalletAddress});
        //console.log(txTransfer);
        return {};
    }

    function GetHashes(props) {

        // setTxs(props);

        const resultData = txs.map(element => {
            return (
                <tr key={element.id}>
                    <td><a href={process.env.blockExplorerURL + "tx/" + element.txHash} target="_blockexplorer">{element.filteredTxHash}</a></td>
                </tr>
            )
        });

        return (
            <>
                <table><thead><tr><th>Mint Transaction Link</th></tr></thead><tbody>{loaded ? resultData : <tr><td colSpan="3">Loading</td></tr>}</tbody></table>
            </>
        )
    }

    return {
        web3: function () {
            return web3;
        },
        // transfer: function (walletAddress, tokenAmount) {
        //     return transfer(walletAddress, tokenAmount);
        // },
        showWeb3Modal: function () {
            return showWeb3Modal();
        },
        disconnect: function (amount) {
            disconnect()
            return true;
        },
        ShowWalletConnect: function (props) {
            return ShowWalletConnect(props);
        },
        ShowSignature: function (props) {
            return ShowSignature(props);
        },
        getUseStates: function () {
            return {
                isConnected,
                setConnected,
                isWaiting,
                setIsWaiting,
                hash: txs,
                hashHtml: hashTx,
                xmPower: tokenBalance,
                setxmPower: setTokenBalance,
                numMinted: numMinted,
                errorMessage
            }
        },
        sendMint: function (props) {
            const thisP = props;
            sendMint(props)
            return false;
        }
    };
};
