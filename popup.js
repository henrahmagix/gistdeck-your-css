// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Store CSS data in the "local" storage area.
//
// See note in options.js for rationale on why not to use "sync".
var storage = chrome.storage.local;

var message = document.getElementById('message');
var buttonsWrapper = document.getElementById('buttons');
var buttons = document.getElementsByClassName('styles-button');

// Check if there is CSS specified.
storage.get('urls', function(items) {
  console.log(items);
  // If there are CSS urls specified, add them to the popup as buttons.
  if (items.urls.length > 0) {
    for (var i = 0, item, key, url; i < items.urls.length; i++) {
      item = items.urls[i];
      key = item[0];
      value = item[1];
      addUrlButton(key, value);
    }
    bindEvents();
  } else {
    var optionsUrl = chrome.extension.getURL('options.html');
    var optionsLink = '<a target="_blank" href="' + optionsUrl + '">Add them here.</a>';
    message.innerHTML = 'No style sources set. ' + optionsLink;
  }
});

function addUrlButton(name, url) {
  var newButton = document.createElement('button');
  newButton.appendChild(document.createTextNode(name));
  newButton.setAttribute('data-url', url);
  newButton.setAttribute('class', 'styles-button');
  buttonsWrapper.appendChild(newButton);
}

// Add click events to the buttons.
function bindEvents() {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', addStyles);
  }
}

function addStyles(e) {
  var button = e.target;
  var url = button.getAttribute('data-url');
  var css;
  // Get cross-origin request.
  // Get source CSS from url.
  // Insert CSS into tab.
  chrome.tabs.insertCSS(null, {code: css}, function() {
    if (chrome.extension.lastError) {
      message.innerText = 'Not allowed to inject CSS into special page.';
    } else {
      message.innerText = 'Injected style!';
    }
  });
}

function runGistdeck() {

}
