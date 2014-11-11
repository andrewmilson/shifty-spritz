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
    self.port.on('set-settings', function(message) {
      $wpmSelect.val(message.wpm);
      $sizeSelect.val(message.size);
      $colorSelect.val(message.color);
      $styleSelect.val(message.style);
      $fontSelect.val(message.font);
      $delaySelect.val(message.delay);
      $enableCheckbox.attr("checked", message.enable);
    });
    $wpmSelect.on("input", function() {
      self.port.emit('settings-update', {wpm: $wpmSelect.val()});
    });
    $colorSelect.change(function() {
      self.port.emit('settings-update', {color: $colorSelect.val()});
    });
    $sizeSelect.change(function() {
      self.port.emit('settings-update', {size: $sizeSelect.val()});
    });
    $styleSelect.change(function() {
      self.port.emit('settings-update', {style: $styleSelect.val()});
    });
    $fontSelect.change(function() {
      self.port.emit('settings-update', {font: $fontSelect.val()});
    });
    $delaySelect.change(function() {
      self.port.emit('settings-update', {delay: $delaySelect.val()});
    });
    $enableCheckbox.change(function() {
      self.port.emit('settings-update', {enable: $enableCheckbox.is(":checked")});
    });
  });
})()
