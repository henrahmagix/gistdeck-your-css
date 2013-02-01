chrome.extension.onMessage.addListener(function(msg, sender, response) {
    if (typeof msg === 'object' && msg.gistdeck) {
        if (msg.style) {
            var styleTag = document.createElement('style');
            styleTag.setAttribute('type', 'text/css');
            styleTag.innerText = msg.style;
            addStyleTag(styleTag);
        } else {
            response('No styles');
        }
    } else {
        response('Not allowed. Must be Gistdeck extension');
    }
    return true;
});
function addStyleTag(styleTag) {
    // Must be called outside of chrome.extension to have access to DOM.
    document.head.appendChild(styleTag);
}
