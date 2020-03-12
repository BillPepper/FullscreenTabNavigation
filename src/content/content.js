const tabBar = document.createElement("div");
tabBar.id = "pepper_tabBar";
document.body.prepend(tabBar);

let barEnabled = false;

const fakeTabs = [
  { title: "GitHub" },
  { title: "Stack Overflow" },
  { title: "Twitter" }
];

const setBarEnabled = bool => {
  console.log("set bar", bool);
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
  const newTab = document.createElement("a");
  newTab.innerText = tab.title;
  if (tab.title === "GitHub") {
    newTab.classList.add("active");
    console.log("found active tab");
  }
  tabBar.appendChild(newTab);
};

const receiveMessage = msg => {
  console.log("content got message", msg);
};

tabBar.addEventListener("mouseenter", () => {
  setBarEnabled(true);
});

tabBar.addEventListener("mouseleave", () => {
  setBarEnabled(false);
});

document.addEventListener("keydown", e => {
  if (e.keyCode === 18) {
    toggleBar();
  }
});

fakeTabs.map(tab => addTab(tab));
const port = chrome.runtime.connect({ name: "pepper_port" });
port.onMessage.addListener(receiveMessage);
