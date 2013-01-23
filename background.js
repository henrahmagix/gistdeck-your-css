var deckedTabs = {};

chrome.extension.onRequest.addListener(onRequest);

function onRequest(request, sender, sendResponse) {
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
                return;
            }

            if (request === 'gistdeck.stop') {
                delete deckedTabs[tab.id];
                return;
            }

            if (request === 'gistdeck.check') {
                sendResponse(deckedTabs[tab.id]);
            }
        }
    );
}
