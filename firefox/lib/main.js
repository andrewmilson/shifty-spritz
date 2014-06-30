var { ToggleButton } = require('sdk/ui/button/toggle')
  , panels = require("sdk/panel")
  , self = require("sdk/self")
  , ports = []
  , ss = require("sdk/simple-storage")
  , array = require('sdk/util/array');

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

function settingsUpdate(message) {
  for (var attrname in message) {
    ss.storage[attrname] = message[attrname];
  }

  for (var i=0; i<ports.length; i++) {
    ports[i].emit('settings-update', ss.storage);
  }
}

panel.port.on('settings-update', settingsUpdate);

exports.main = function() {
  var pageMod = require("sdk/page-mod");

  pageMod.PageMod({
    include: "*",
    contentScriptWhen: 'end',
    contentStyleFile: [
      self.data.url("css/style.css"),
      self.data.url("css/droid-sans.css"),
      self.data.url("css/font-awesome.css")
    ],
    contentScriptFile: [
      self.data.url("js/jquery.js"),
      self.data.url("js/spritzify.js")
    ],
    onAttach: function(worker) {
      array.add(ports, worker.port);
      worker.port.emit("settings-update", ss.storage);
      worker.port.on("understood-changes", function(message) { settingsUpdate(message); })

      worker.on('detach', function() {
        array.remove(ports, this.port);
      });

      worker.on('pageshow', function() {
        array.add(ports, this.port);
      });

      worker.on('pagehide', function() {
        array.remove(ports, this.port);
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
