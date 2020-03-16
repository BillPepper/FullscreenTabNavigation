const tabBar = document.createElement('div');
tabBar.id = 'pepper_tabBar';
document.body.prepend(tabBar);

const disableRetracton = true;
let barEnabled = false;

let tabs = [];

let thisWinId = undefined;

const setBarEnabled = bool => {
  if (bool) {
    tabBar.classList.add('active');
  } else {
    tabBar.classList.remove('active');
  }
};

const toggleBar = () => {
  barEnabled = !barEnabled;
  setBarEnabled(barEnabled);
};

const addTab = tab => {
  let newTab = document.createElement('a');
  let newTabFavIcon = document.createElement('img');
  let newTabText = document.createElement('span');

  newTab.addEventListener('click', () => {
    console.log('you clicked tab with id', tab.id);
  });
  newTabFavIcon.src = tab.favIcon;
  newTabFavIcon.classList.add('favIcon');
  newTabText.innerText = tab.title;

  newTab.append(newTabFavIcon);
  newTab.append(newTabText);
  tabBar.appendChild(newTab);
};

const clearTabs = () => {
  tabBar.innerHTML = '';
};

const handleNewTablist = msg => {
  if (!thisWinId) {
    thisWinId = msg.windowId;
  }
  if (thisWinId === msg.windowId) {
    tabs = [];
    console.log('content: got new tablist');
    clearTabs();
    msg.tabs.forEach(tab => {
      addTab({ title: tab.title, id: tab.id, favIcon: tab.favIconUrl });
    });
  }
};

const receiveMessage = msg => {
  if (msg.type === 'tablist') {
    handleNewTablist(msg);
  }
};

tabBar.addEventListener('mouseenter', () => {
  setBarEnabled(true);
});

tabBar.addEventListener('mouseleave', () => {
  if (!disableRetracton) {
    setBarEnabled(false);
  }
});

document.addEventListener('keydown', e => {
  if (e.keyCode === 18) {
    toggleBar();
  }
});

tabs.map(tab => addTab(tab));
const port = chrome.runtime.connect({ name: 'pepper_port' });
port.onMessage.addListener(receiveMessage);
