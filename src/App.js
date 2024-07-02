import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchBlocklist, fetchCurrentTabURL, fetchEnableStatus, setEnableStatus } from './utils/chromeAPI';

function App() {
  // State variables to manage the current URL, base URL, blocklist, enable/disable status, and messages.
  const [currentURL, setCurrentURL] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [blocklist, setBlocklist] = useState([]);
  const [isEnabled, setIsEnabled] = useState();
  const [message, setMessage] = useState('');

  // Generating the favicon URL based on the current URL using Google Favicon API.
  const FavIcon = `https://www.google.com/s2/favicons?domain=${currentURL}`;

  // useEffect to run on component mount to get the current tab URL and stored settings.
  useEffect(() => {
    fetchCurrentTabURL((url) => {
      const urlObject = new URL(url);
      setCurrentURL(urlObject.href);
      setBaseURL(urlObject.origin);
    });

    fetchBlocklist((blocklist) => {
      setBlocklist(blocklist);
    });

    fetchEnableStatus((enabled) => {
      setIsEnabled(enabled);
    });
  }, []);

  // useEffect to update storage when user toggle the enable/disable button
  useEffect(() => {
    setEnableStatus(isEnabled, () => {
      console.log(`Extension ${isEnabled ? 'enabled' : 'disabled'}`);
    });
  }, [isEnabled]);

  // Function to refresh the current tab with a delay
  function refreshCurrentTab() {
    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }, 500);
  }

  // Function to add a URL to the blocklist
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

  // Function to remove a URL from the blocklist
  const removeURL = (url) => {
    const updatedBlocklist = blocklist.filter((item) => item !== url);
    chrome.storage.local.set({ url_blocker : { blocklist: updatedBlocklist }}, () => {
      setBlocklist(updatedBlocklist);
      setMessage('');
      refreshCurrentTab();
    });
  };

  return (
    <div id="popup">
      
      <div id="header">
        <div id='app_title'>
          URL Blocker
        </div>
        <button onClick={() => {setIsEnabled(!isEnabled)}} id='app_button'>
          {isEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      <div id="site-details">
        <div id='site-icon'>
          <img src={FavIcon} style={{width: '16px', height: '16px'}} 
          />
        </div>
        <div id='site-url'>
          {baseURL}
        </div>
      </div>

      <div id="block-options">
        <button id='block-button' onClick={() => addURL(baseURL)}>Block this website</button>
        <div id='messageBox'>
          {message}
        </div>
      </div>

      <div id='blocklist-display'>
        <h4>Blocked Websites</h4>
        <ul>
          {blocklist.map((url, index) => (
            <li key={index}>
              {url} 
              <button onClick={() => removeURL(url)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default App;