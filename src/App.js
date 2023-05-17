import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ISTEContract from "./ISTE.json";

function App() {
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transferHistory, setTransferHistory] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setSenderAddress(window.web3.eth.defaultAccount);
        } catch (error) {
          console.log(error);
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        setSenderAddress(window.web3.eth.defaultAccount);
      } else {
        console.log("No web3 detected.");
      }
    };

    initWeb3();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const contractAddress = '0x66DaA021242930549eA83d6AF5c3De554033E2E6';
    const ISTE = new web3.eth.Contract(ISTEContract, contractAddress);

    const sender = senderAddress;
    const recipient = recipientAddress;
    const value = web3.utils.toWei(amount, "ether");
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    try {
      const tx = await ISTE.methods.transfer(recipient, value).send({ from: fromAddress });
      console.log(tx);

      const transfer = {
        from: fromAddress,
        to: recipient,
        amount
      };
      setTransferHistory([...transferHistory, transfer]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-800 pb-8">Send ISTE Tokens</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label className="mb-2" htmlFor="recipient">
          Recipient Address:
        </label>
        <input
          className="border border-gray-400 rounded-md py-2 px-4 w-80 mb-4"
          type="text"
          id="recipient"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          required
        />
        <label className="mb-2" htmlFor="amount">
          Amount of Tokens:
        </label>
        <input
          className="border border-gray-400 rounded-md py-2 px-4 w-80 mb-4"
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