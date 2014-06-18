$(->
  $wpmSelect = $("#wpm-select")
  $sizeSelect = $("#size-select")
  $fontSelect = $("#font-select")
  $styleSelect = $("#style-select")
  $colorSelect = $("#color-select")
  $delaySelect = $("#delay-select")
  $enableCheckbox = $("#enable-checkbox")

  chrome.storage.sync.get ["wpm", "color", "size", "style", "font", "enable"], (value) ->
    $wpmSelect.val value.wpm or "300"
    $sizeSelect.val value.size or "25"
    $colorSelect.val value.color or "#fa3d3d"
    $styleSelect.val value.style or "bold"
    $fontSelect.val value.font or "'Droid sans'"
    $delaySelect.val calue.delay or 500
    $enableCheckbox.attr "checked", (if typeof value.enable is "undefined" then true else !!value.enable)
    return

  $wpmSelect.change ->
    chrome.storage.sync.set
      wpm: $wpmSelect.val()

  $colorSelect.change ->
    chrome.storage.sync.set
      color: $colorSelect.val()

  $sizeSelect.change ->
    chrome.storage.sync.set
      size: $sizeSelect.val()

  $styleSelect.change ->
    chrome.storage.sync.set
      style: $styleSelect.val()

  $fontSelect.change ->
    chrome.storage.sync.set
      font: $fontSelect.val()

  $delaySelect.change ->
    chrome.storage.sync.set
      delay: $delaySelect.val()

  $enableCheckbox.change ->
    chrome.storage.sync.set
      enable: $enableCheckbox.is(":checked")
)
