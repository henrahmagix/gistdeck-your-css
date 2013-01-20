// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Store CSS data in the "local" storage area.
//
// Usually we try to store settings in the "sync" area since a lot of the time
// it will be a better user experience for settings to automatically sync
// between browsers.
//
// However, "sync" is expensive with a strict quota (both in storage space and
// bandwidth) so data that may be as large and updated as frequently as the CSS
// may not be suitable.
var storage = chrome.storage.local;

// Get at the DOM controls used in the sample.
var resetButton = document.querySelector('button.reset');
var submitButton = document.querySelector('button.submit');
var textarea = document.querySelector('textarea');

// Load any CSS that may have previously been saved.
// loadChanges();

submitButton.addEventListener('click', saveChanges);
resetButton.addEventListener('click', reset);

function saveChanges() {
  // Get the current CSS snippet from the form.
  var cssCode = textarea.value;
  // Check that there's some code there.
  if (!cssCode) {
    message('Error: No CSS specified');
    return;
  }
  // Save it using the Chrome extension storage API.
  storage.set({'css': cssCode}, function() {
    // Notify that we saved.
    message('Settings saved');
  });
}

function loadChanges() {
  storage.get('css', function(items) {
    // To avoid checking items.css we could specify storage.get({css: ''}) to
    // return a default value of '' if there is no css value yet.
    if (items.css) {
      textarea.value = items.css;
      message('Loaded saved CSS.');
    }
  });
}

function reset() {
  // Remove the saved value from storage. storage.clear would achieve the same
  // thing.
  storage.remove('css', function(items) {
    message('Reset stored CSS');
  });
  // Refresh the text area.
  textarea.value = '';
}

function message(msg) {
  var message = document.querySelector('.message');
  message.innerText = msg;
  setTimeout(function() {
    message.innerText = '';
  }, 3000);
}

// Setup the options page.
var inputs = {
  index: 0,
  namePrefix: 'css-input',
  el: document.createElement('input'),
  parent: document.querySelector('.cssInputs'),
  newInput: function(index) {
    var input = this.el.cloneNode();
    input.setAttribute('name', this.namePrefix + index);
    input.setAttribute('id', this.namePrefix + index);
    return input;
  },
  add: function(index) {
    this.parent.appendChild(this.newInput(index));
  },
  init: function(num) {
    this.el.setAttribute('size', 100);
    this.el.setAttribute('placeholder', 'eg: http://www.csszengarden.com/zengarden-sample.css');
    for (var i = 0; i < num; i++) {
      this.add(i);
    }
  }
};
inputs.init(3);
