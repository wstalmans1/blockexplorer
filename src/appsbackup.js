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

  useEffect(() => {
    async function fetchBlockData() {
      // Fetch the latest block number
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(latestBlockNumber);

      // Using the fetched block number to get block information
      if (latestBlockNumber != null) {
        const info = await alchemy.core.getBlock(latestBlockNumber);
        setBlockInfo(info);
      }
    }

    fetchBlockData();
  }, []); // Ensure this effect runs only once on component mount

  // Function to render block information in a readable format
  const renderBlockInfo = (blockInfo) => {
    return (
      <ul>
        {Object.entries(blockInfo).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {JSON.stringify(value, null, 2)}</li>
        ))}
      </ul>
    );
  };

  return ( 
    <div className="App">
      <div>Block Number from Mainnet: {blockNumber}</div>
      <div>Block Info:</div>
      {blockInfo ? renderBlockInfo(blockInfo) : <p>Loading block information...</p>}
    </div>  
  );
}

export default App;
