$(->
  $wpmSelect = $("#wpm-select")
  $sizeSelect = $("#size-select")
  $colorSelect = $("#color-select")

  chrome.storage.sync.get ["wpm", "color", "size"], (value) ->
    $wpmSelect.val value.wpm or "300"
    $sizeSelect.val value.size or "25"
    $colorSelect.val value.color or "#fa3d3d"
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
)
