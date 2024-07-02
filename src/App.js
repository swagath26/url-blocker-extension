import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentURL, setCurrentURL] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [blocklist, setBlocklist] = useState([]);
  const [isEnabled, setIsEnabled] = useState();
  const [message, setMessage] = useState('');
  const FavIcon = `https://www.google.com/s2/favicons?domain=${currentURL}`;

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if(tabs[0].url) {
        const url = new URL(tabs[0].url);
        setCurrentURL(url.href);
        setBaseURL(url.origin);
      }
    });

    chrome.storage.local.get('url_blocker', (data) => {
      const app_data = data.url_blocker || {};
      setBlocklist(app_data.blocklist || []);
    });

    chrome.storage.local.get('url_blocker_enabled', (data) => {
      setIsEnabled(data.url_blocker_enabled);
    });

  }, []);

  useEffect(() => {
    chrome.storage.local.set({ url_blocker_enabled : isEnabled }, () => {
      console.log('Extension ', isEnabled ? 'enabled' : 'disabled');
    });
  }, [isEnabled]);

  function refreshCurrentTab() {
    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }, 500);
  }

  const addURL = (url) => {
    if (url) {
      if(!blocklist.includes(url)) {
        const updatedBlocklist = [...blocklist, url];
        chrome.storage.local.set({ url_blocker : { blocklist: updatedBlocklist }}, () => {
          setBlocklist(updatedBlocklist);
          setMessage('Successfully Blocked')
          refreshCurrentTab();
        });
      }
      else {
        setMessage('Website Already Blocked');
        refreshCurrentTab();
      }
    }
    else {
      setMessage('URL is Invalid');
    }
  };

  const removeURL = (url) => {
    const updatedBlocklist = blocklist.filter((item) => item !== url);
    chrome.storage.local.set({ url_blocker : { blocklist: updatedBlocklist }}, () => {
      setBlocklist(updatedBlocklist);
      setMessage('');
      refreshCurrentTab();
    });
  };

  return (
    <div className="popup" style={{width: '400px'}}>
      
      <div className="header" style={{display: 'flex', background: 'white', justifyContent: 'center', alignItems: 'center'}}>
        <div className='app_title' style={{fontSize: '19px', fontWeight: '700', padding: '20px 20px'}}>
          URL Blocker
        </div>
        <button onClick={() => {setIsEnabled(!isEnabled)}} className='app_button' style={{height: 'fit-content', fontSize: '16px', fontWeight: '500', padding: '5px 10px'}}>
          {isEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      <div className="site-details" style={{padding: '20px 20px', display: 'flex', background: '#202020', color: 'white'}}>
        <div className='site-icon' style={{flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src={FavIcon} style={{width: '16px', height: '16px'}} />
        </div>
        <div className='site-icon' style={{flex: '4 1 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '19px', fontWeight: '300'}}>
          {baseURL}
        </div>
      </div>

      <div className="block-options" style={{background: '#202020', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', padding: '20px 20px'}}>
        <button style={{padding: '20px 15px', borderRadius: '20px', background: '#eeeeee', fontSize: '22px', fontWeight: '400', color: '#202020'}} onClick={() => addURL(baseURL)}>Block this website</button>
        <div id='messageBox' style={{padding: '20px 15px', textAlign: 'center', fontSize: '15px', fontWeight: '300', color: 'white'}}>{message}</div>
        {/* <input
          type="text"
          value={newURL}
          onChange={(e) => setNewURL(e.target.value)}
          placeholder="Add a URL to block"
        />
        <button onClick={addNewURL}>Add</button> */}
      </div>

      <div className='blocklist-display' style={{background: 'white', padding: '20px'}}>
        <h4>Blocked Websites</h4>
        <ul>
          {blocklist.map((url, index) => (
            <li style={{fontSize: '16px'}} key={index}>
              {url} <button style={{margin: '5px 15px'}} onClick={() => removeURL(url)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;