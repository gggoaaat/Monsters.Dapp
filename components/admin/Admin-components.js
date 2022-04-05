import React, { useReducer, useState, useEffect } from 'react';
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import bannerimg from "../../assets/images/landingpage/monster.gif";
import NFTWalletBridge from '../nftWalletBridge'
import WalletConnectProvider from "@walletconnect/web3-provider";

const AdminComponents = () => {
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

  async function togglePublicMint(props) {

    const returnedhash = await walletBridge1.togglePublicMint()

    //let retu = await loadup(returnedhash)
    if (process.env.debug) {
      console.log(returnedhash)
    }
  }

  async function togglePresaleMint(props) {

    const returnedhash = await walletBridge1.togglePresaleMint()

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

  let newValue = process.env.mintType == "Public" ? process.env.ethValue : process.env.ethWLValue;

  return (
    <>
      <div className="static-slider-head banner2">
        <Container>
        <Row className="">
        <Col lg="6" md="6" >
            <div style={{ backgroundColor: "#fff", marginTop: "150px" }}>
                  <div class="form-horizontal" >
                    <fieldset>

                      {/* <!-- Form Name --> */}
                      <legend>Admin Contract Page</legend>

                      {/* <!-- Button --> */}
                      <div class="form-group">
                        <label class="col-md-4 control-label" for="togglePublicMint">Public Mint</label>
                        <div class="col-md-4">
                          <button id="togglePublicMint" name="togglePublicMint" class="btn btn-primary"  onClick={() => togglePublicMint()}>Toggle</button>
                        </div>
                      </div>

                      {/* <!-- Button --> */}
                      <div class="form-group">
                        <label class="col-md-4 control-label" for="togglePresaleMint">Presale Mint</label>
                        <div class="col-md-4">
                          <button id="togglePresaleMint" name="togglePresaleMint" class="btn btn-primary" onClick={() => togglePresaleMint()}>Toggle</button>
                        </div>
                      </div>

                      {/* <!-- Multiple Radios --> */}
                      <div class="form-group">
                        <label class="col-md-4 control-label" for="radios">Set Revealed</label>
                        <div class="col-md-4">
                          <div class="radio">
                            <label for="radios-0">
                              <input type="radio" name="radios" id="radios-0" value="false" defaultChecked="checked"></input>
                              Hidden
                            </label>
                          </div>
                          <div class="radio">
                            <label for="radios-1">
                              <input type="radio" name="radios" id="radios-1" value="true"></input>
                              Revealed
                            </label>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <button id="submitRevealChange" name="submitRevealChange" class="btn btn-primary">Change Reveal</button>
                        </div>
                      </div>

                      {/* <!-- Text input--> */}
                      <div class="form-group">
                        <label class="col-md-4 control-label" for="transferOwnership">Transfer Ownership</label>
                        <div class="col-md-4">
                          <input id="transferOwnership" name="transferOwnership" type="text" placeholder="newOwner (address)" class="form-control input-md" required="">
                          </input>
                        </div>
                        <div class="col-md-4">
                          <button id="submitChangeOwner" name="submitChangeOwner" class="btn btn-primary">Change Owner</button>
                        </div>
                      </div>

                    </fieldset>
                  </div>
                </div>
            </Col>
            {(!currentUseState.isConnected) ?
              <Col lg="6" md="6" className="align-self-center">                
                <h3 style={{ color: "#fff" }}>DEMO ONLY RINKEBY</h3>
                <h3 className="title">
                  A blockchain project built by Community.
                </h3>
                <h4 className="subtitle font-light">
                  An original collection consisting of 3,333 unique Monsters living on the Ethereum blockchain
                  <br />
                </h4>
                <a
                  onClick={() => walletBridge1.showWeb3Modal()}
                  className="btn btn-success m-r-20 btn-md m-t-30 " style={{ backgroundColor: "#C2C2C2" }}
                >
                  Connect Wallet
                </a>
                <Link href={process.env.mainWWW}>
                  <a className="btn btn-md m-t-30  btn-outline-light " style={{ backgroundColor: "#760680" }}>
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
                <br />
                {currentUseState.hashHtml}
              </Col>
            }
          
          </Row>

        </Container>
      </div>
    </>
  );
};

export default AdminComponents;
