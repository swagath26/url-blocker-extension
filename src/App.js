import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [blocklist, setBlocklist] = useState([]);
  const [newSite, setNewSite] = useState('');

  useEffect(() => {
    chrome.storage.sync.get('blocklist', (data) => {
      setBlocklist(data.blocklist || []);
    });
  }, []);

  const addSite = () => {
    if (newSite) {
      const updatedBlocklist = [...blocklist, newSite];
      chrome.storage.sync.set({ blocklist: updatedBlocklist }, () => {
        setBlocklist(updatedBlocklist);
        setNewSite('');
      });
    }
  };

  const removeSite = (site) => {
    const updatedBlocklist = blocklist.filter((item) => item !== site);
    chrome.storage.sync.set({ blocklist: updatedBlocklist }, () => {
      setBlocklist(updatedBlocklist);
    });
  };

  return (
    <div className="App">
      <h1>Blocklist</h1>
      <input
        type="text"
        value={newSite}
        onChange={(e) => setNewSite(e.target.value)}
        placeholder="Add a site to block"
      />
      <button onClick={addSite}>Add</button>
      <ul>
        {blocklist.map((site, index) => (
          <li key={index}>
            {site} <button onClick={() => removeSite(site)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;