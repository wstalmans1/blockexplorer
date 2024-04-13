import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

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
  const renderBlockInfo = (blockInfo) => (
    <ul>
      {Object.entries(blockInfo).map(([key, value]) => {
        if (key === 'transactions' && Array.isArray(value)) {
          return value.map((tx, index) => (
            <li key={index}>
              <strong>Transaction {index}:</strong> {tx.hash}
              <button onClick={() => handleTransactionClick(tx.hash)}>Get Receipt</button>
            </li>
          ));
        }
        return <li key={key}><strong>{key}:</strong> {JSON.stringify(value)}</li>;
      })}
    </ul>
  );

  const renderTransactionDetails = (details) => (
    details ? <div>
      <h3>Transaction Receipt:</h3>
      <ul>
        {Object.entries(details).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {JSON.stringify(value, null, 2)}</li>
        ))}
      </ul>
    </div> : null
  );

  return ( 
    <div className="App">
      <div>Block Number from Mainnet: {blockNumber}</div>
      <div>Block Info:</div>
      {blockInfo ? renderBlockInfo(blockInfo) : <p>Loading block information...</p>}
      <div>{renderTransactionDetails(transactionDetails)}</div>
    </div>  
  );
}

export default App;
