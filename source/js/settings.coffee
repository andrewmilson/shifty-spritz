$(->
  $wpmSelect = $("#wpm-select")
  $sizeSelect = $("#size-select")
  $fontSelect = $("#font-select")
  $styleSelect = $("#style-select")
  $colorSelect = $("#color-select")

  chrome.storage.sync.get ["wpm", "color", "size", "style", "font"], (value) ->
    $wpmSelect.val value.wpm or "300"
    $sizeSelect.val value.size or "25"
    $colorSelect.val value.color or "#fa3d3d"
    $styleSelect.val value.style or "normal"
    $fontSelect.val value.font or "'Droid sans'"
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
)
