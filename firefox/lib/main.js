var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  onHide: handleHide,
  width: 420,
  height: 600
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
