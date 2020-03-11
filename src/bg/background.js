// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  sendResponse();
});

const handleNewTab = tab => {
  console.log("new tab", tab);
  chrome.tabs.getAllInWindow(tab.windowId, t => {
    console.table(t);
  });
  chrome.runtime.sendMessage("runContentScript");
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

chrome.runtime.onMessage.addListener(function(message, callback) {
  if (message == "runContentScript") {
    chrome.tabs.executeScript({
      file: "content.js"
    });
  }
});
