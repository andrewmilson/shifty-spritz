var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  onHide: handleHide,
  width: 420,
  height: 600
});

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

exports.main = function() {
  var pageMod = require("sdk/page-mod");

  pageMod.PageMod({
    include: "*",
    contentScriptWhen: 'end',
    contentStyleFile: [
      self.data.url("css/style.css"),
      self.data.url("css/font-awesome.css")
      /*"http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css",
      "http://fonts.googleapis.com/css?family=Droid+Sans:400,700"*/
    ],
    contentScriptFile: [
      self.data.url("js/jquery.js"),
      self.data.url("js/spritzify.js")
    ],
    onAttach: function onAttach(worker) {
      worker.postMessage("Hello World");
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
