// Initialize options defaults because this options library is garbage
chrome.storage.sync.set({
	"focusAfterMove": true,
	"movedTabLocation": "after"
});

let hole = new Set(); // Set of tab IDs

// Dumps hole contents, does not handle tab movement
const emptyHole = () => {
	chrome.action.setIcon({ path: "../../icons/empty-128.png" });
	chrome.action.setTitle({ title: "Tabhole - click to store tab" });
	hole.clear();
};

const getSetting = async (s) => chrome.storage.sync.get(s).then(x => x[s]);

// If a tab is closed before it's taken out of the hole, empty the hole
chrome.tabs.onRemoved.addListener((id, _) => {
	hole.delete(id);
	if (hole.size == 0) emptyHole();
});

chrome.action.onClicked.addListener(async currentTab => {
	if (hole.size == 0) {
		const tabs = await chrome.tabs.query({ highlighted: true, lastFocusedWindow: true });
		chrome.action.setIcon({ path: "../../icons/full-128.png" });
		chrome.action.setTitle({ title: `In hole:&#013;&#010;${tabs.map(t => t.title).join("&#013;&#010;")}` });
		tabs.forEach(t => hole.add(t.id));
	} else {
		const movedTabLocationSetting = await getSetting("movedTabLocation");

		console.log(`Moving ${hole.size} tabs`);

		// We handle the rightmost tab first to avoid off-by-one complications.
		// This assumes all tabs in the hole are from the same window.
		const tabs = (await Promise.all([...hole].map(id => chrome.tabs.get(id))))
			.sort((a, b) => b.index - a.index);

		let destinationIndex = {
			"after": currentTab.index + 1,
			"before": currentTab.index,
			"first": 0,
			"last": -1
		}[movedTabLocationSetting];

		if (typeof destinationIndex === 'undefined') {
			throw `Invalid movedTabLocation setting: ${movedTabLocationSetting}`;
		}

		for (const tab of tabs) {
			// Correction for when a source tab is in the same window as the destination and before it
			if (["after", "before"].includes(movedTabLocationSetting) && tab.windowId == currentTab.windowId && tab.index <= currentTab.index) {
				destinationIndex--;
			}

			console.log(`Tab #${tab.id} => ${destinationIndex}`);
			await chrome.tabs.move(tab.id, { windowId: currentTab.windowId, index: destinationIndex });
		}

		if (await getSetting("focusAfterMove")) {
			chrome.tabs.update(tabs.at(-1).id, { selected: true });
		}

		emptyHole();
	}
});