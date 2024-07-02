// Get the active tab's URL
export const fetchCurrentTabURL = (callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url) {
        callback(tabs[0].url);
      }
    });
};

// Get the stored blocklist
export const fetchBlocklist = (callback) => {
    chrome.storage.local.get('url_blocker', (data) => {
      const app_data = data.url_blocker || {};
      callback(app_data.blocklist || []);
    });
};

// Get the enable/disable status
export const fetchEnableStatus = (callback) => {
    chrome.storage.local.get('url_blocker_enabled', (data) => {
      callback(data.url_blocker_enabled);
    });
};

// Set the enable/disable status
export const setEnableStatus = (isEnabled, callback) => {
    chrome.storage.local.set({ url_blocker_enabled: isEnabled }, () => {
      callback();
    });
};  