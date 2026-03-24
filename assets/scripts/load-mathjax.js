(function () 
{
  var currentScript = document.currentScript

  if (!currentScript) 
  {
    return
  }

  var cdnSource = currentScript.dataset.cdnSource
  var localSource = currentScript.dataset.localSource
  var fallbackLoaded = false

  if (!cdnSource || !localSource) 
  {
    return
  }

  function appendScript(source, onError) 
  {
    var script = document.createElement('script')
    script.src = source
    script.defer = true
    script.crossOrigin = 'anonymous'

    if (onError) 
    {
      script.onerror = onError
    }

    document.head.appendChild(script)
  }

  function loadLocal() 
  {
    if (fallbackLoaded) 
    {
      return
    }

    fallbackLoaded = true
    appendScript(localSource)
  }

  appendScript(cdnSource, loadLocal)
})()
