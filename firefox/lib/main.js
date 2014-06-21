var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
  id: "shifty-spritz-popup",
  label: "Shifty Spritz",
  icon: {
    "16": "./shifty-spritz-16.png",
    "32": "./shifty-spritz-32.png",
    "64": "./shifty-spritz-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("https://www.mozilla.org/");
}
