import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ISTEContract from "./ISTE.json";

function App() {
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transferHistory, setTransferHistory] = useState([]);

  useEffect(() => {
    // this function is used to check if the browser is web3 browser or not basically to check if metamask is installed or not
    const initWeb3 = async () => {
      // checks if the eth provider is available in the browser 
      if (window.ethereum) {
        // creates a new instance of the web3 library
        window.web3 = new Web3(window.ethereum);
        try {
          // allows the user to connect their wallet with the website
          await window.ethereum.enable();
          setSenderAddress(window.web3.eth.defaultAccount);
        } catch (error) {
          console.log(error);
        }
      } else if (window.web3) {
        // creates a new instance of the web3 provider but with the currentProvider
        window.web3 = new Web3(window.web3.currentProvider);
        // sets the sender address to the connected account
        setSenderAddress(window.web3.eth.defaultAccount);
      } else {
        // if metamask is not detected then log the message
        console.log("No web3 detected.");
      }
    };

    // Calls the initWeb3 function to initialize the Web3 provider and retrieve the sender's address.
    initWeb3();
  }, []);

  // this function is called when we submit the form
  const handleSubmit = async (event) => {
    // to prevent the page from reload on submission
    event.preventDefault();

    // allows us to use the web3 library in your code
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const contractAddress = '0x66DaA021242930549eA83d6AF5c3De554033E2E6';
    // creating the ISTE instance to use the functions of the smart contract
    const ISTE = new web3.eth.Contract(ISTEContract, contractAddress);

    // intialising the addresses collected from the form from the user
    const sender = senderAddress;
    const recipient = recipientAddress;
    const value = web3.utils.toWei(amount, "ether");
    // getting the available accounts using the function
    const accounts = await web3.eth.getAccounts();
    // assigns the first address from the promise array to the fromAddress
    const fromAddress = accounts[0];

    try {
      // calls  the transfer method from the ISTE contract and enters the required parameters, the send method sends the amount to the required address
      const tx = await ISTE.methods.transfer(recipient, value).send({ from: fromAddress });
      console.log(tx);

      // creates a transfer object with the new details
      const transfer = {
        from: fromAddress,
        to: recipient,
        amount
      };
      // updates the transfer history
      setTransferHistory([...transferHistory, transfer]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-[#19A7CE]  text-white">
      <div className="flex pl-11 pt-5 text-center  ">
      <h1 className="text-4xl">🚀 Web.Sol</h1>
      </div>
      <div className="flex justify-center items-center p-7">
      <h2 className="mb-2 text-6xl pt-3 pd-3 " >
        Send ISTE Tokens
        </h2>
      </div>
      </div>
      <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <div className="flex justify-center ">
        <label className="m-7 text-3xl pt-4" htmlFor="recipient">
          🏠 Recipient Address:
        </label>
        </div>
        <div className=" text-2xl  ">
        <input
          className=" border-b border-black text-black text-xl p-4 focus:outline-0 placeholder:text-black "
          placeholder="Enter Address"
          type="text"
          id="recipient"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          required
        />
        </div>
        <div className="flex justify-center">
        <label className="m-7 text-3xl pt-4" htmlFor="amount">
          💲 Amount of Tokens:
        </label>
        </div>
        <div className=" text-2xl  ">
        <input
          className="border-b border-black text-black text-xl p-4 focus:outline-0 placeholder:text-black "
          placeholder="Enter tokens"
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        </div>
        <div className=" mt-5 pt-7 ">
        <button className="rounded-full text-lg pt-3 pb-3 pl-6 pr-6 border-2 text-black border-[#19A7CE]  hover:bg-[#19A7CE] hover:text-white mb-5">
          Send Tokens 🛫
        </button>
        </div>
      </form>
      </div>
      {transferHistory.length > 0 && (
        <div className="flex justify-center items-center mb-5">
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">From</th>
                <th className="border border-gray-400 px-4 py-2">To</th>
                <th className="border border-gray-400 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transferHistory.map((transfer) => (
                <tr key={transfer.hash}>
                  <td className="border border-gray-400 px-4 py-2">{transfer.from}</td>
                  <td className="border border-gray-400 px-4 py-2">{transfer.to}</td>
                  <td className="border border-gray-400 px-4 py-2">{transfer.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
}

export default App;

