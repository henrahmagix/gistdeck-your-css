var decked = false;

// Listen for messages.
chrome.extension.onMessage.addListener(function(data, sender, response) {
    var msg;
    if (typeof data === 'object' && data.gistdeck) {
        if (data.type === 'style' && data.style) {
            msg = addStyle(data.style);
        } else if (data.type === 'script' && data.script) {
            msg = addScript(data.script);
        } else {
            msg = 'No styles';
        }
    } else {
        msg = 'Not allowed. Must be Gistdeck extension';
    }
    response(msg);
});

function addStyle(style) {
    var styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');
    styleTag.innerText = style;
    // Must be called outside of chrome.extension to have access to DOM.
    document.head.appendChild(styleTag);
    return 'Styles added';
}

function addScript(script) {
    if (decked) {
        return true;
    } else {
        decked = true;
        return false;
    }
}
