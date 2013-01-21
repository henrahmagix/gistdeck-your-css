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
var sourceItems = document.getElementsByClassName('css-url-wrapper');

// Setup an object to facilitate input creation.
var inputItem = {
  index: 0,
  wrapperPrefix: 'css-url',
  keyPrefix: 'url-key',
  valuePrefix: 'url-value',
  parent: document.querySelector('.css-inputs'),
  add: function() {
    var key = this.newInput(this.index, 'key');
    var value = this.newInput(this.index, 'value');
    var div = document.createElement('div');
    div.setAttribute('id', this.wrapperPrefix + '-' + this.index);
    div.setAttribute('class', this.wrapperPrefix + '-wrapper');
    div.appendChild(key);
    div.appendChild(value);
    this.parent.appendChild(div);
    this.index++;
  },
  newInput: function(index, type) {
    var input = document.createElement('input');
    var classes = this.wrapperPrefix + '-input';
    var size = 0;
    var placeholder = '';
    if (type === 'key') {
      classes += ' ' + this.keyPrefix;
      size = 30;
      placeholder = 'eg: My CSS';
    } else if (type === 'value') {
      classes += ' ' + this.valuePrefix;
      size = 100;
      placeholder = 'eg: http://www.csszengarden.com/zengarden-sample.css';
    }
    input.setAttribute('class', classes);
    input.setAttribute('size', size);
    input.setAttribute('placeholder', placeholder);
    return input;
  },
  init: function(num) {
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

function addInput() {
  inputItem.add();
}

function saveChanges() {
  // Get the CSS urls from the form.
  var urls = [];
  for (var i = 0, item, key, url; i < sourceItems.length; i++) {
    itemChildren = sourceItems.item(i).children;
    key = itemChildren[0].value;
    url = itemChildren[1].value;
    if (url !== '' && key !== '') {
      urls.push([key, url]);
    }
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
    var numberOfItems = Math.max(3, items.urls.length);
    inputItem.init(numberOfItems);
    // To avoid checking items.css we could specify storage.get({css: ''}) to
    // return a default value of '' if there is no css value yet.
    for (var i = 0, item, key, url; i < items.urls.length; i++) {
      item = items.urls[i];
      key = item[0];
      url = item[1];
      sourceItems.item(i).children[0].value = key;
      sourceItems.item(i).children[1].value = url;
    }
    message('Loaded saved urls');
  });
}

function reset(inputIndex, save) {
  // Reset the value of single input, or all inputs if inputIndex not passed.
  if (typeof inputIndex === 'number') {
    sourceItems.item(inputIndex).children[0].value = '';
    sourceItems.item(inputIndex).children[1].value = '';
  } else {
    for (var i = 0; i < sourceItems.length; i++) {
      sourceItems.item(i).children[0].value = '';
      sourceItems.item(i).children[1].value = '';
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
