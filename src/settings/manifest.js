this.manifest = {
    "name": "Tabhole",
    "icon": chrome.extension.getURL("icons/empty-128.png"),
    "settings": [
        {
            "tab": "General",
            "group": "Features",
            "name": "focusAfterMove",
            "type": "checkbox",
            "label": "Focus on a tab after moving it"
        },
        {
            "tab": "General",
            "group": "Features",
            "name": "movedTabLocation",
            "type": "popupButton",
            "label": "Moved tabs should be placed:",
            "options": {
                "values": [
                    {
                        "value": "after",
                        "text": "After the current tab"
                    },
                    {
                        "value": "before",
                        "text": "Before the current tab"
                    },
                    {
                        "value": "first",
                        "text": "First in the window"
                    },
                    {
                        "value": "last",
                        "text": "Last in the window"
                    }
                ]
            }
        }
    ]
};