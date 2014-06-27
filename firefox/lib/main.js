var { ToggleButton } = require('sdk/ui/button/toggle')
  , panels = require("sdk/panel")
  , self = require("sdk/self")
  , ports = []
  , ss = require("sdk/simple-storage");

// ss.storage = ss.storage || {}

ss.storage.wpm = ss.storage.wpm || "300";
ss.storage.delay = ss.storage.delay || 500;
ss.storage.style = ss.storage.style || "bold";
ss.storage.size = ss.storage.size || "25";
ss.storage.color = ss.storage.color || "#fa3d3d";
ss.storage.font = ss.storage.font || "'Droid sans'";
ss.storage.enable = (typeof ss.enable == "undefined" ? true : !!ss.storage.enable);

var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  contentScriptFile: [
    self.data.url('js/jquery.js'),
    self.data.url('js/settings.js')
  ],
  onHide: handleHide,
  width: 420,
  height: 600
});

panel.port.emit("set-settings", ss.storage);

require("sdk/tabs").activeTab.attach({
  contentScript: 'document.body.style.border = "5px solid red";'
});

var button = ToggleButton({
  id: "shifty-spritz-popup",
  label: "Shifty Spritz",
  icon: {
    "16": "./shifty-spritz-16.png",
    "32": "./shifty-spritz-32.png",
    "64": "./shifty-spritz-64.png"
  },
  onClick: handleClick
});

panel.port.on('settings-update', function(message) {
  console.log("recived loud and clear");

  for (var attrname in message) {
    ss.storage[attrname] = message[attrname];
  }

  for (var i=0; i<ports.length; i++) {
    ports[i].emit('settings-update', ss.storage);
  }
});

exports.main = function() {
  var pageMod = require("sdk/page-mod");

  pageMod.PageMod({
    include: "*",
    contentScriptWhen: 'end',
    contentStyleFile: [
      self.data.url("css/style.css"),
      self.data.url("css/font-awesome.css")
    ],
    contentScriptFile: [
      self.data.url("js/jquery.js"),
      self.data.url("js/spritzify.js")
    ],
    onAttach: function(worker) {
      ports.push(worker.port);
      worker.port.emit("settings-update", ss.storage);

      worker.on('detach', function() {
        var index = ports.indexOf(worker.port);
        if (index > -1)
          ports.splice(index, 1);
      });

      worker.on('pageshow', function() { ports.push(worker.port); });

      worker.on('pagehide', function() {
        var index = ports.indexOf(worker.port);
        if (index !== -1)
          ports.splice(index, 1);
      });
    }
  });
};

// Show the panel when the user clicks the button.
function handleClick(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}
