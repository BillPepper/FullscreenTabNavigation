const tabBar = document.createElement("div");
tabBar.id = "pepper_tabBar";
document.body.prepend(tabBar);

const disableRetracton = true;
let barEnabled = false;

let fakeTabs = [
  { title: "GitHub" },
  { title: "Stack Overflow" },
  { title: "Twitter" }
];

const setBarEnabled = bool => {
  if (bool) {
    tabBar.classList.add("active");
  } else {
    tabBar.classList.remove("active");
  }
};

const toggleBar = () => {
  barEnabled = !barEnabled;
  setBarEnabled(barEnabled);
};

const addTab = tab => {
  let newTab = document.createElement("a");
  let newTabFavIcon = document.createElement("img");
  let newTabText = document.createElement("span");

  newTabFavIcon.src = "https://github.githubassets.com/favicon.ico";
  newTabFavIcon.classList.add("favIcon");
  newTabText.innerText = tab.title;

  newTab.append(newTabFavIcon);
  newTab.append(newTabText);
  tabBar.appendChild(newTab);
};

const clearTabs = () => {
  tabBar.innerHTML = "";
};

const receiveMessage = msg => {
  if (msg.type === "tablist") {
    fakeTabs = [];
    console.log("content: got new tablist");
    clearTabs();
    msg.tabs.forEach(tab => {
      addTab({ title: tab.title });
    });
  }
};

tabBar.addEventListener("mouseenter", () => {
  setBarEnabled(true);
});

tabBar.addEventListener("mouseleave", () => {
  if (!disableRetracton) {
    setBarEnabled(false);
  }
});

document.addEventListener("keydown", e => {
  if (e.keyCode === 18) {
    toggleBar();
  }
});

fakeTabs.map(tab => addTab(tab));
const port = chrome.runtime.connect({ name: "pepper_port" });
port.onMessage.addListener(receiveMessage);
