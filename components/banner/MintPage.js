import React, { useReducer, useState, useEffect } from 'react';
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import bannerimg from "../../assets/images/landingpage/banner-img.png";
import NFTWalletBridge from '../nftWalletBridge'
import WalletConnectProvider from "@walletconnect/web3-provider";


const MintPage = () => {
  const bridgeParams = {
    tokenAddress: process.env.contractAddress,
    providerOptions: {
      metamask: {
        id: 'injected',
        name: 'MetaMask',
        type: 'injected',
        check: 'isMetaMask'
      },
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          // rpc: {
          //     1: 'https://mainnet.infura.io/v3/b830c8484bf841d795848610ff791d5b'
          // },
          network: process.env.network,
          chainId: process.env.chainId,
          infuraId: process.env.infuraID, // "b830c8484bf841d795848610ff791d5b", // required
          address: process.env.contractAddress //,
          // qrcodeModalOptions: {
          //     mobileLinks: [
          //         'rainbow',
          //         'metamask',
          //         'argent',
          //         'trust',
          //         'imtoken',
          //         'pillar'
          //     ]
          // }
        }
      }
    }
  };

  let dappParams = { bridgeParams: bridgeParams }
  let walletBridge1 = NFTWalletBridge(dappParams);

  let currentUseState = walletBridge1.getUseStates();

  async function SendMint(props) {

    const returnedhash = await walletBridge1.sendMint(props.mint)

    //let retu = await loadup(returnedhash)
    if (process.env.debug) {
      console.log(returnedhash)
    }
  }

  const [formInput, updateFormInput] = useState({
    price: "",
    amount: "1",
  });

  let displayData = true ? walletBridge1.getUseStates().hash : "Loading!" //(<ul>{resultData}</ul>)

  let [mintNum, setNum] = useState(1);
  let incNum = () => {
    if (mintNum < +process.env.maxMintCount) {
      console.log(mintNum)
      console.log(process.env.maxMint)
      console.log(mintNum <= +process.env.maxMint)
      setNum(Number(mintNum) + 1);
    }
  };

  let decNum = () => {
    if (mintNum > 1) {
      setNum(mintNum - 1);
    }
  }

  let handleChange = (e) => {
    if (mintNum > 1 && mintNum <= +process.env.maxMint) {
      setNum(e.target.value);
    }
  }

  let newValue = process.env.mintType == "Public" ? process.env.ethValue : process.env.ethWLValue


  return (
    <>
      <div className="static-slider-head banner2">
        <Container>

          <Row className="">
            {(!currentUseState.isConnected) ?
              <Col lg="6" md="6" className="align-self-center">
                <br></br>
                <h3>DEMO ONLY RINKEBY</h3>
                <h3 className="title">
                  A blockchain project built by Community.
                </h3>
                <h4 className="subtitle font-light">
                  An original collection consisting of 3,333 unique Monsters living on the Ethereum blockchain
                  <br />
                </h4>
                <a
                  onClick={() => walletBridge1.showWeb3Modal()}
                  className="btn btn-success m-r-20 btn-md m-t-30 "
                >
                  Connect Wallet
                </a>
                <Link href={process.env.siteTitle}>
                  <a className="btn btn-md m-t-30  btn-outline-light ">
                    Back Home
                  </a>
                </Link>
              </Col> :
              <Col lg="6" md="6" className="align-self-center">
                <br />
                <p className="connected">
                  {process.env.mintType} Mint Cost : <strong>{newValue} ETH</strong>
                  <br />
                  Wallet address: <strong>{currentUseState.xmPower.filteredAddress}</strong>
                  <br />
                  Eth Balance : <strong>{currentUseState.xmPower.theBalance}</strong>
                  <br />
                  Contract : <strong>{process.env.contractAddress}</strong>
                  <br />
                </p>
                {(currentUseState.xmPower.isWhiteListed == true) ?
                  <><label className="connected">Number to mint (1-{process.env.maxMintCount}):</label>

                    <div className="">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <button className="btn btn-outline-primary" type="button" onClick={decNum}>-</button>
                        </div>
                        <div className="input-group-prepend">
                          <input type="number" id="mints" name="mints" className="form-control" value={mintNum} min="1"
                            max={process.env.maxMintCount}
                            onChange={handleChange} />
                        </div>
                        <div className="input-group-prepend">
                          <button className="btn btn-outline-primary" type="button" onClick={incNum}>+</button>
                        </div>
                      </div>
                    </div>
                    <Link href="">
                      <a className="btn btn-success m-r-20 btn-md m-t-30 btn-outline-dark " onClick={() => SendMint({ mint: mintNum })}>
                        Mint
                      </a>
                    </Link>
                  </>
                  : <h1>You are not on the whitelist</h1>}

                <a
                  onClick={() => walletBridge1.disconnect()}
                  className="btn btn-md m-t-30 btn-outline-light "
                >
                  Disconnect Wallet
                </a>
                <br />
                <br />
                <h4 className="subtitle font-light">
                  NFT&apos;s minted {currentUseState.numMinted} of {process.env.maxMint}
                </h4>
                <br/>
                {currentUseState.hashHtml}
              </Col>
            }
            <Col lg="6" md="6">
              <Image src={bannerimg} alt="WTForks Couple in a tub" />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default MintPage;
