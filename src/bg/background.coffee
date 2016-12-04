tabIdInHole = -1

settings = new Store "settings",
	focusAfterMove: true
	movedTabLocation: "after"

getCurrentTab = (callback) ->
	chrome.tabs.query {currentWindow: yes, active: yes}, (tabs) ->
		callback tabs[0]

alreadyClicked = no
timer

chrome.browserAction.onClicked.addListener (tab) ->
	if alreadyClicked
		clearTimeout timer
		if tabIdInHole > -1
			getCurrentTab (currentTab) ->
				destination = switch settings.get "movedTabLocation"
					when "after" then currentTab.index + 1
					when "before" then currentTab.index
					when "first" then 0
					when "last" then -1
				chrome.tabs.move tabIdInHole, windowId: tab.windowId, index: destination

				chrome.browserAction.setIcon path: "icons/empty-128.png"
				chrome.browserAction.setTitle title: "Tabhole - click to store tab"

				if settings.get "focusAfterMove"
					chrome.tabs.update tabIdInHole, selected: true
				
				tabIdInHole = -1
		alreadyClicked = no
	else
		alreadyClicked = yes

		timer = setTimeout ->
			clearTimeout timer
			alreadyClicked = no
		, 250

chrome.browserAction.onClicked.addListener (tab) ->
	if tabIdInHole > -1
		getCurrentTab (currentTab) ->
			destination = switch settings.get "movedTabLocation"
				when "after" then currentTab.index + 1
				when "before" then currentTab.index
				when "first" then 0
				when "last" then -1
			console.log "#{settings.get "movedTabLocation"} -> #{destination}"
			chrome.tabs.move tabIdInHole, windowId: tab.windowId, index: destination

			chrome.browserAction.setIcon path: "icons/empty-128.png"
			chrome.browserAction.setTitle title: "Tabhole - click to store tab"

			if settings.get "focusAfterMove"
				chrome.tabs.update tabIdInHole, selected: true
			
			tabIdInHole = -1
	else
		getCurrentTab (currentTab) ->
			chrome.browserAction.setIcon path: "icons/full-128.png"
			chrome.browserAction.setTitle title: "In hole: #{currentTab.title}"

			tabIdInHole = currentTab.id