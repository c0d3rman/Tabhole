chrome.options.set("Tabhole settings", [
    {
        "type": "checkbox",
        "name": "focusAfterMove",
        "desc": "Focus on a tab after moving it",
        "default": true
    },
    {
        "type": "select",
        "name": "movedTabLocation",
        "desc": "Moved tabs should be placed:",
        "default": "after",
        "options": [
            {
                "value": "after",
                "desc": "After the current tab"
            },
            {
                "value": "before",
                "desc": "Before the current tab"
            },
            {
                "value": "first",
                "desc": "First in the window"
            },
            {
                "value": "last",
                "desc": "Last in the window"
            }
        ]
    }
]);