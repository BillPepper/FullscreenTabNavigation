//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("background received message", request, sender);
  sendResponse();
});

let contentPort = null;

const handleNewTab = tab => {
  if (contentPort) {
    contentPort.postMessage("hello, from background");
  } else {
    console.log("content port not open");
  }
};

const handleUpdateTabs = tabId => {
  chrome.tabs.query({ windowId: tabId }, tabs => {
    if (contentPort) {
      console.log("have tabs", tabs);
      contentPort.postMessage({ type: "unknow", tabs: tabs });
    }
  });
};

const handleCloseTab = tab => {
  console.log("closed tab", tab);
};

chrome.tabs.onCreated.addListener(tab => {
  handleNewTab(tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
  handleUpdateTabs(tab.windowId)
);

chrome.tabs.onRemoved.addListener(tab => {
  handleCloseTab(tab);
});

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "pepper_port") {
    console.log("port opened!");
    contentPort = port;

    contentPort.onDisconnect.addListener(function(msg) {
      console.log("port closed!", msg);
      contentPort = null;
    });
  }
});
