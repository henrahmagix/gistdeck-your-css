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
var addMoreButton = document.querySelector('button.add-more');
var inputs = document.getElementsByClassName('css-url');

// Setup an object to facilitate input creation.
var inputItem = {
  index: 0,
  namePrefix: 'css-url',
  el: document.createElement('input'),
  parent: document.querySelector('.css-inputs'),
  newInput: function(index) {
    var input = this.el.cloneNode();
    input.setAttribute('class', this.namePrefix);
    input.setAttribute('name', this.namePrefix + '-' + index);
    input.setAttribute('id', this.namePrefix + '-' + index);
    return input;
  },
  add: function() {
    this.parent.appendChild(this.newInput(this.index++));
  },
  init: function(num) {
    this.el.setAttribute('size', 100);
    this.el.setAttribute('placeholder', 'eg: http://www.csszengarden.com/zengarden-sample.css');
    for (var i = 0; i < num; i++) {
      this.add();
    }
  }
};

// Load any CSS that may have previously been saved.
loadChanges();

submitButton.addEventListener('click', saveChanges);
resetButton.addEventListener('click', reset);
addMoreButton.addEventListener('click', addInput);

function saveChanges() {
  // Get the CSS urls from the form.
  var urls = [];
  for (var i = 0, url; i < inputs.length; i++) {
    urls.push(inputs.item(i).value);
  }
  // Check that there's some code there.
  if (! urls.length) {
    message('Error: No urlsspecified');
    return;
  }
  // Save it using the Chrome extension storage API.
  storage.set({'urls': urls}, function() {
    // Notify that we saved.
    message('Settings saved');
  });
}

function loadChanges() {
  // Get and set the saved values.
  storage.get({'urls': []}, function(items) {
    // Add as many inputs as needed.
    inputItem.init(items.urls.length);
    // To avoid checking items.css we could specify storage.get({css: ''}) to
    // return a default value of '' if there is no css value yet.
    for (var i = 0, url; i < items.urls.length; i++) {
      url = items.urls[i];
      inputs.item(i).value = url;
    }
    message('Loaded saved urls');
  });
}

function reset(inputIndex, save) {
  // Reset the value of single input, or all inputs if inputIndex not passed.
  if (typeof inputIndex === 'number') {
    inputs.item(inputIndex).value = '';
  } else {
    for (var i = 0; i < inputs.length; i++) {
      inputs.item(i).value = '';
    }
  }
  // Save the changes if asked to.
  if (save) {
    saveChanges();
  }
}

function message(msg) {
  var message = document.querySelector('.message');
  message.innerText = msg;
  setTimeout(function() {
    message.innerText = '';
  }, 3000);
}

function addInput() {
  inputItem.add();
}
