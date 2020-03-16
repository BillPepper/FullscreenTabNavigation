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

const switchTab = tabId => {
  chrome.tabs.update(tabId, { active: true }, () => {
    console.log('switch to tab', tabId);
  });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
  handleUpdateTabs(tab.windowId)
);

chrome.tabs.onRemoved.addListener(tab => {
  handleCloseTab(tab);
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'pepper_port') {
    console.log('port opened!');
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
