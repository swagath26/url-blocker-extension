chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ url_blocker: { blocklist: [] }});
  chrome.storage.local.set({ url_blocker_enabled: 'true'});
  console.log('Extension installed');
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if(changes.url_blocker) {
    // If the change is with the blocklist
    chrome.storage.local.get('url_blocker_enabled', (data) => {
      if(data.url_blocker_enabled) {
        // If the extension is enabled
        const blocklist = changes.url_blocker.newValue.blocklist;
        const rules = blocklist.map((url, index) => ({
          id: index + 1,
          priority: 1,
          action: {type: 'block'},
          condition: { 
            urlFilter: url, 
            resourceTypes: ['main_frame'] }
        }))
        chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
          const existingRuleIds = existingRules.map(rule => rule.id);
      
          chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds,
            addRules: rules
          });
        });
      }
    });
  }

  if (changes.url_blocker_enabled) {
    // If the change is with enable/disable
    const enabled = changes.url_blocker_enabled.newValue;

    if (!enabled) {
      // If blocking is disabled, remove all dynamic rules
      chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
        const existingRuleIds = existingRules.map(rule => rule.id);

        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: existingRuleIds,
          addRules: []
        });
      });
    } 
    else {
      // If blocking is enabled, re-add the rules
      chrome.storage.local.get('url_blocker', (data) => {
        if (data.url_blocker && data.url_blocker.blocklist) {
          const blocklist = data.url_blocker.blocklist;
          const rules = blocklist.map((url, index) => ({
            id: index + 1,
            priority: 1,
            action: { type: 'block' },
            condition: {
              urlFilter: url,
              resourceTypes: ['main_frame']
            }
          }));

          chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [],
            addRules: rules
          });
        }
      });
    }
  }
});