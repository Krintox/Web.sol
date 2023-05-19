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
      <h1 className="text-4xl font-bold text-gray-800 pb-8">Send ISTE Tokens</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-start">
        <label className="text-2xl" htmlFor="recipient">
          <span className="text-3xl px-4">
            💸
          </span>
          Recipient Address:
        </label>
        <input
          className="border-blue-400 rounded-md p-2 w-full mb-4 bg-transparent border-b-2 outline-none"
          type="text"
          id="recipient"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          required
        />
        <label className="" htmlFor="amount">
          Amount of Tokens:
        </label>
        <input
          className="border-b-2 border-blue-400 rounded-md p-2 w-80 mb-4 bg-transparent"
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
          Send Tokens
        </button>
      </form>
      {transferHistory.length > 0 && (
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800">Transfer History</h2>
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">From</th>
                <th className="border border-gray-400 px-4 py-2">To</th>
                <th className="border border-gray-400 px-4 py-2">Amount</th>
                <th className="border border-gray-400 px-4 py-2">Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {transferHistory.map((transfer) => (
                <tr key={transfer.hash}>
                  <td className="border border-gray-400 px-4 py-2">{transfer.from}</td>
                  <td className="border border-gray-400 px-4 py-2">{transfer.to}</td>
                  <td className="border border-gray-400 px-4 py-2">{transfer.amount}</td>
                  <td className="border border-gray-400 px-4 py-2">{transfer.hash}</td>
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

