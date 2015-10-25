// Generated by CoffeeScript 1.9.3
(function() {
  var getCurrentTab, settings, tabIdInHole;

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

  chrome.browserAction.onClicked.addListener(function(tab) {
    if (tabIdInHole > -1) {
      return getCurrentTab(function(currentTab) {
        var destination;
        destination = (function() {
          switch (settings.get("movedTabLocation")) {
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
        console.log((settings.get("movedTabLocation")) + " -> " + destination);
        chrome.tabs.move(tabIdInHole, {
          windowId: tab.windowId,
          index: destination
        });
        chrome.browserAction.setIcon({
          path: "icons/empty-128.png"
        });
        chrome.browserAction.setTitle({
          title: "Tabhole - click to store tab"
        });
        if (settings.get("focusAfterMove")) {
          chrome.tabs.update(tabIdInHole, {
            selected: true
          });
        }
        return tabIdInHole = -1;
      });
    } else {
      return getCurrentTab(function(currentTab) {
        chrome.browserAction.setIcon({
          path: "icons/full-128.png"
        });
        chrome.browserAction.setTitle({
          title: "In hole: " + currentTab.title
        });
        return tabIdInHole = currentTab.id;
      });
    }
  });

}).call(this);