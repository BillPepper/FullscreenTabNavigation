//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("background received message", request, sender);
  sendResponse();
});

let contentPort = null;

const handleNewTab = tab => {
  // chrome.tabs.getAllInWindow(tab.windowId, t => {
  //   console.table(t);
  // });
  if (contentPort) {
    contentPort.postMessage("hello, from background");
  } else {
    console.log("content port not open");
  }
};

const handleCloseTab = tab => {
  console.log("closed tab", tab);
};

chrome.tabs.onCreated.addListener(tab => {
  handleNewTab(tab);
});

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
