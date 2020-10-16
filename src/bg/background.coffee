tabIdInHole = -1

settings = new Store "settings",
	focusAfterMove: true
	movedTabLocation: "after"

getCurrentTab = (callback) ->
	chrome.tabs.query {currentWindow: yes, active: yes}, (tabs) ->
		callback tabs[0]

# Dumps hole contents, does not handle tab movement
emptyHole = ->
	chrome.browserAction.setIcon path: "icons/empty-128.png"
	chrome.browserAction.setTitle title: "Tabhole - click to store tab"
	tabIdInHole = -1

# If a tab is closed before it's taken out of the hole, empty the hole
chrome.tabs.onRemoved.addListener (tabid, removeInfo) ->
	if tabid is tabIdInHole
		emptyHole()

chrome.browserAction.onClicked.addListener (tab) ->
	if tabIdInHole > -1
		getCurrentTab (currentTab) ->
			destination = switch settings.get "movedTabLocation"
				when "after" then currentTab.index + 1
				when "before" then currentTab.index
				when "first" then 0
				when "last" then -1
			console.log "#{settings.get "movedTabLocation"} -> #{destination}"
			chrome.tabs.get tabIdInHole, (tab) ->
				if tab.windowId isnt currentTab.windowId or tab.index isnt currentTab.index
					chrome.tabs.move tabIdInHole, windowId: currentTab.windowId, index: destination

				if settings.get "focusAfterMove"
					chrome.tabs.update tabIdInHole, selected: true
				
				emptyHole()
	else
		getCurrentTab (currentTab) ->
			chrome.browserAction.setIcon path: "icons/full-128.png"
			chrome.browserAction.setTitle title: "In hole: #{currentTab.title}"

			tabIdInHole = currentTab.id