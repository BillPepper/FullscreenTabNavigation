let contentPort = null;
let testPortArray = [];

// const handleUpdateTabs = winId => {
//   chrome.tabs.query({ windowId: winId }, tabs => {
//     if (contentPort) {
//       console.log('have tabs', tabs);
//       contentPort.postMessage({ type: 'tablist', windowId: winId, tabs: tabs });
//     }
//   });
// };

// const handleCloseTab = tab => {
//   console.log('closed tab', tab);
// };

const switchTab = tabId => {
  chrome.tabs.update(tabId, { active: true }, () => {
    console.log('switch to tab', tabId);
  });
};

const handleUpdateTabs = (tabId, changeInfo, tab) => {
  console.log('tab updated', tabId, changeInfo, tab);
};

const handleCloseTab = (tabId, removeInfo) => {
  console.log('tab removed', tabId, removeInfo);
};

// -----

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  handleUpdateTabs(tabId, changeInfo, tab);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  handleCloseTab(tabId, removeInfo);
});

chrome.runtime.onConnect.addListener(port => {
  testPortArray.push(port);
  if (port.name === 'pepper_port') {
    console.log('port opened!', port);
    contentPort = port;

    contentPort.onMessage.addListener(msg => {
      if (msg.type === 'tabclick') {
        switchTab(msg.tabId);
      }
    });

    contentPort.onDisconnect.addListener(msg => {
      console.log('port closed!', msg);
      contentPort = null;
    });
  }
});
