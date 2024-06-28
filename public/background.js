chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blocklist: ['example.com', 'test.com'] });
  });
  
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      return { cancel: true };
    },
    { urls: ['*://*.example.com/*', '*://*.test.com/*'] },
    ['blocking']
  );  