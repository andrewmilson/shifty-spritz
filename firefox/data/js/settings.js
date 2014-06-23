(function() {
  $(function() {
    var $colorSelect, $delaySelect, $enableCheckbox, $fontSelect, $sizeSelect, $styleSelect, $wpmSelect;
    $wpmSelect = $("#wpm-select");
    $sizeSelect = $("#size-select");
    $fontSelect = $("#font-select");
    $styleSelect = $("#style-select");
    $colorSelect = $("#color-select");
    $delaySelect = $("#delay-select");
    $enableCheckbox = $("#enable-checkbox");
    chrome.storage.sync.get(["wpm", "color", "size", "style", "font", "delay", "enable"], function(value) {
      $wpmSelect.val(value.wpm || "300");
      $sizeSelect.val(value.size || "25");
      $colorSelect.val(value.color || "#fa3d3d");
      $styleSelect.val(value.style || "bold");
      $fontSelect.val(value.font || "'Droid sans'");
      $delaySelect.val(value.delay || 500);
      $enableCheckbox.attr("checked", (typeof value.enable === "undefined" ? true : !!value.enable));
    });
    $wpmSelect.change(function() {
      return chrome.storage.sync.set({
        wpm: $wpmSelect.val()
      });
    });
    $colorSelect.change(function() {
      return chrome.storage.sync.set({
        color: $colorSelect.val()
      });
    });
    $sizeSelect.change(function() {
      return chrome.storage.sync.set({
        size: $sizeSelect.val()
      });
    });
    $styleSelect.change(function() {
      return chrome.storage.sync.set({
        style: $styleSelect.val()
      });
    });
    $fontSelect.change(function() {
      return chrome.storage.sync.set({
        font: $fontSelect.val()
      });
    });
    $delaySelect.change(function() {
      return chrome.storage.sync.set({
        delay: $delaySelect.val()
      });
    });
    return $enableCheckbox.change(function() {
      return chrome.storage.sync.set({
        enable: $enableCheckbox.is(":checked")
      });
    });
  });

}).call(this);
