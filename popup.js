// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Store CSS data in the "local" storage area.
//
// See note in options.js for rationale on why not to use "sync".
var storage = chrome.storage.local;

var message = document.getElementById('message');
var styleButtonsWrapper = document.getElementById('style-buttons');
var styleButtons = document.getElementsByClassName('style');
var scriptButton = document.getElementById('script-button');

// Check if there is CSS specified.
storage.get('urls', function(items) {
    // If there are CSS urls specified, add them to the popup as buttons.
    if (items.urls.length > 0) {
        for (var i = 0, item, key, url; i < items.urls.length; i++) {
            item = items.urls[i];
            key = item[0];
            value = item[1];
            addStyleButton(key, value);
        }
        bindEvents();
    } else {
        var optionsUrl = chrome.extension.getURL('options.html');
        var optionsLink = '<a target="_blank" href="' + optionsUrl + '">Add them here.</a>';
        message.innerHTML = 'No style sources set. ' + optionsLink;
    }
});

function addStyleButton(name, url) {
    var newButton = document.createElement('button');
    newButton.appendChild(document.createTextNode(name));
    newButton.setAttribute('data-url', url);
    newButton.setAttribute('class', 'style');
    styleButtonsWrapper.appendChild(newButton);
}

// Add click events to the buttons.
function bindEvents() {
    for (var i = 0; i < styleButtons.length; i++) {
        styleButtons[i].addEventListener('click', addStyle);
    }
    scriptButton.addEventListener('click', runGistdeck);
}

function addStyle(e) {
    // Get current tab.
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function(tabs) {
            var tab = tabs[0];
            var button = e.target;
            var url = button.getAttribute('data-url');
            // Create cross-origin request.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function() {
                fetchStyle(xhr, tab);
            };
            // Go fetch! Good boy!
            xhr.send();
        }
    );
}

function fetchStyle(xhr, tab) {
    // Only do something when this xhr has finished.
    if (xhr.readyState == 4) {
        if (xhr.status === 200) {
            // When xhr has completed and it returned success, check if there's CSS
            // and insert it. xhr.responseText should contain the CSS.
            css = xhr.responseText;
            if (css) {
                // Insert CSS into tab.
                chrome.tabs.sendMessage(tab.id, {gistdeck: true, type: 'style', style: css}, function(response) {
                    if (chrome.extension.lastError) {
                        // Show if there's been an error.
                        message.innerText = 'Not allowed to inject CSS into special page.';
                    } else {
                        // Assumed successful injection. Should do further tests.
                        message.innerText = response;
                    }
                });
            } else {
                // xhr.responseText was empty, so no CSS.
                message.innerText = 'No CSS returned.';
            }
        } else {
            // xhr returned a status other than 200, meaning failure of somekind.
            message.innerText = 'Cross-origin request failed or was denied.';
        }
    }
}

function runGistdeck(e) {
    // Get current tab.
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function(tabs) {
            var tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, {gistdeck: true, type: 'script', script: chrome.extension.getURL('gistdeck.js')}, function(tabIsDecked) {
                if (tabIsDecked) {
                    message.innerText = 'Already running';
                } else {
                    message.innerText = 'Decking out';
                    chrome.tabs.executeScript(tab.id, {file: 'jquery.min.js'}, function(result) {
                        chrome.tabs.executeScript(tab.id, {file: 'gistdeck.js'}, function(result) {
                            if (result) {
                                scriptButton.disabled = true;
                            }
                        });
                    });
                }
            });
        }
    );
}
