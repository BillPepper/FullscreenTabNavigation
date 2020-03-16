let contentPort = null;

const handleUpdateTabs = winId => {
  chrome.tabs.query({ windowId: winId }, tabs => {
    if (contentPort) {
      console.log('have tabs', tabs);
      contentPort.postMessage({ type: 'tablist', windowId: winId, tabs: tabs });
    }
  });
};

const handleCloseTab = tab => {
  console.log('closed tab', tab);
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
  handleUpdateTabs(tab.windowId)
);

chrome.tabs.onRemoved.addListener(tab => {
  handleCloseTab(tab);
});

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === 'pepper_port') {
    console.log('port opened!');
    contentPort = port;

    contentPort.onDisconnect.addListener(function(msg) {
      console.log('port closed!', msg);
      contentPort = null;
    });
  }
});
