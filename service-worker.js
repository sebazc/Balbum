chrome.bookmarks.onRemoved.addListener(node => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let url = tabs[0].url;
        console.log(url)
        chrome.storage.sync.remove(`${url}`)
    })
})