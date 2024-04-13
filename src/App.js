import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';
/*test*/
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState(null);
  const [blockInfo, setBlockInfo] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    async function fetchBlockData() {
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(latestBlockNumber);
      if (latestBlockNumber != null) {
        const info = await alchemy.core.getBlockWithTransactions(latestBlockNumber);
        setBlockInfo(info);
      }
    }
    fetchBlockData();
  }, []);

  const getTransactionReceipt = async (txHash) => {
    const receipt = await alchemy.core.getTransactionReceipt(txHash);
    setTransactionDetails(receipt);
  };

  const handleTransactionClick = (txHash) => {
    getTransactionReceipt(txHash);
  };

  // Render functions
  const renderBlockInfo = () => (
    blockInfo ? (
      <ul>
        <li><strong>Hash:</strong> {blockInfo.hash}</li>
        <li><strong>Number of Transactions:</strong> {blockInfo.transactions.length}</li>
      </ul>
    ) : <p>Loading block information...</p>
  );

  const renderTransactionList = () => (
    <div className="transaction-list">
      {blockInfo ? (
        <ul>
          {blockInfo.transactions.map((tx, index) => (
            <li key={index}>
              <button onClick={() => handleTransactionClick(tx.hash)}>
                Transaction {index + 1}: {tx.hash}
              </button>
            </li>
          ))}
        </ul>
      ) : <p>Loading transactions...</p>}
    </div>
  );

  const renderTransactionDetails = () => (
    <div className="transaction-details">
      <h3>Transaction Receipt:</h3>
      {transactionDetails ? (
        <ul>
          {Object.entries(transactionDetails).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {JSON.stringify(value, null, 2)}</li>
          ))}
        </ul>
      ) : <p>Select a transaction to see the details.</p>}
    </div>
  );

  return ( 
    <div className="App">
      <div className="block-info">
        <h2>Block Number: {blockNumber}</h2>
        {renderBlockInfo()}
      </div>
      <div className="split-view">
        {renderTransactionList()}
        {renderTransactionDetails()}
      </div>
    </div>  
  );
}

export default App;
