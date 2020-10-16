// Generated by CoffeeScript 2.5.1
var emptyHole, getCurrentTab, settings, tabIdInHole;

tabIdInHole = -1;

settings = new Store("settings", {
  focusAfterMove: true,
  movedTabLocation: "after"
});

getCurrentTab = function(callback) {
  return chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function(tabs) {
    return callback(tabs[0]);
  });
};

// Dumps hole contents, does not handle tab movement
emptyHole = function() {
  chrome.browserAction.setIcon({
    path: "icons/empty-128.png"
  });
  chrome.browserAction.setTitle({
    title: "Tabhole - click to store tab"
  });
  return tabIdInHole = -1;
};

// If a tab is closed before it's taken out of the hole, empty the hole
chrome.tabs.onRemoved.addListener(function(tabid, removeInfo) {
  if (tabid === tabIdInHole) {
    return emptyHole();
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  if (tabIdInHole > -1) {
    return getCurrentTab(function(currentTab) {
      return chrome.tabs.get(tabIdInHole, function(tab) {
        var destination, movedTabLocation;
        movedTabLocation = settings.get("movedTabLocation");
        destination = (function() {
          switch (movedTabLocation) {
            case "after":
              return currentTab.index + 1;
            case "before":
              return currentTab.index;
            case "first":
              return 0;
            case "last":
              return -1;
          }
        })();
        // Off-by-one correction for when the source and destination tabs are in the same window
        // and the source is before the destination
        if ((movedTabLocation === "after" || movedTabLocation === "before") && currentTab.windowId === tab.windowId && tab.index < currentTab.index) {
          destination--;
        }
        console.log(`${movedTabLocation} -> ${destination}`);
        if (tab.windowId !== currentTab.windowId || tab.index !== currentTab.index) {
          chrome.tabs.move(tabIdInHole, {
            windowId: currentTab.windowId,
            index: destination
          });
        }
        if (settings.get("focusAfterMove")) {
          chrome.tabs.update(tabIdInHole, {
            selected: true
          });
        }
        return emptyHole();
      });
    });
  } else {
    return getCurrentTab(function(currentTab) {
      chrome.browserAction.setIcon({
        path: "icons/full-128.png"
      });
      chrome.browserAction.setTitle({
        title: `In hole: ${currentTab.title}`
      });
      return tabIdInHole = currentTab.id;
    });
  }
});
