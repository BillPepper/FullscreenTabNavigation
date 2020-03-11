const tabBar = document.createElement("div");
tabBar.id = "pepper_tabBar";
document.body.prepend(tabBar);

const fakeTabs = [
  { title: "GitHub" },
  { title: "Stack Overflow" },
  { title: "Twitter" }
];

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
  tabBar.classList.add("active");
});

tabBar.addEventListener("mouseleave", () => {
  tabBar.classList.remove("active");
});

fakeTabs.map(tab => addTab(tab));
const port = chrome.runtime.connect({ name: "pepper_port" });
port.onMessage.addListener(receiveMessage);
