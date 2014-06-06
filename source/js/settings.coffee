$(->
  $wpmSelect = $("#wpm-select")
  $colorSelect = $("#color-select")

  chrome.storage.sync.get ["wpm", "color"], (value) ->
    $wpmSelect.val value.wpm or "300"
    $colorSelect.val value.color or "#fa3d3d"
    return

  $wpmSelect.change ->
    chrome.storage.sync.set
      wpm: $wpmSelect.val()

  $colorSelect.change ->
    chrome.storage.sync.set
      color: $colorSelect.val()
)