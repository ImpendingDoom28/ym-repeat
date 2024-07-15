chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const yaMusic = 'https://music.yandex.ru';
let isInitialised = false;

function toggleApp(show) {
  const root = document.querySelector("#repeat-extension");
  if (root) {
    if (show) {
      root.style.display = 'block';
      root.dataset.show = true;
    } else {
      root.style.display = 'none';
      root.dataset.show = false;
    }
  }
};

chrome.action?.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(yaMusic)) {
    if (!isInitialised) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: [ "repeat-extension.js" ]
      });
      isInitialised = true;
    }

    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    if (nextState === 'ON') {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: toggleApp,
        args: [true]
      });
    } else {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: toggleApp,
        args: [false]
      });
    }

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
  }
});