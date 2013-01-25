var deckedTabs = {};

// Listen for requests.
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var tab;
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function(tabs) {
            console.log(tabs);
            // Always get the first tab returned. There shouldn't be more than
            // one, but if so just ignore the others.
            tab = tabs[0];
            if (request === 'gistdeck.start') {
                if (deckedTabs[tab.id]) {
                    sendResponse(true);
                } else {
                    deckedTabs[tab.id] = true;
                    sendResponse(false);
                }
            } else if (request === 'gistdeck.stop') {
                delete deckedTabs[tab.id];
            } else if (request === 'gistdeck.check') {
                sendResponse(deckedTabs[tab.id]);
            }
            return;
        }
    );
});

// Remove tab from deckedTabs when closed.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    delete deckedTabs[tabId];
});
