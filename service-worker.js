chrome.bookmarks.onRemoved.addListener(node => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let url = tabs[0].url;
        console.log(url)
        chrome.storage.sync.remove(`${url}`)
    })
})

// Check if tab is already bookmarked
// function isTabBookmarked() {
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => { // Get current tab url
//         let url = tabs[0].url
//         // console.log("heterer1")

//         chrome.bookmarks.search(url, (bookmark) => { // Get current tab bookmark - if any
//             let node = bookmark[0]
//             // console.log("heterer2")

//             if (node != undefined && node.url == url) { // Is the tab bookmarked? Yes -> execute code below
//                 // console.log("heterer3")
//                 chrome.storage.sync.get(`${url}`, (data) => { // Retrieve comments
//                     if (data[`${url}`] != undefined && data[`${url}`] != "") {
//                         chrome.action.setBadgeText({ text: "✒️" })
//                         // chrome.action.setBadgeBackgroundColor({ color: "#FF0000" })
//                         chrome.action.setBadgeBackgroundColor({ color: "white" })
//                         chrome.action.setBadgeTextColor({ color: "white" })
//                     } else {
//                         chrome.action.setBadgeText({ text: "" })
//                     }
//                 });
//             } else {
//                 chrome.action.setBadgeText({ text: "" })
//             }
//         });
//     });
// }


// isTabBookmarked()
chrome.tabs.onActivated.addListener(isTabBookmarked)
chrome.tabs.onUpdated.addListener(isTabBookmarked)

function isTabBookmarked() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => { // Get current tab url
        let url = tabs[0].url
        // console.log("heterer1")

        chrome.storage.sync.get(`${url}`, (data) => { // Retrieve comments
            if (data[`${url}`] != undefined && data[`${url}`] != "") {
                chrome.action.setBadgeText({ text: "✒️" })
                // chrome.action.setBadgeBackgroundColor({ color: "#FF0000" })
                chrome.action.setBadgeBackgroundColor({ color: "white" })
                chrome.action.setBadgeTextColor({ color: "white" })
            } else {
                chrome.action.setBadgeText({ text: "" })
            }
        });
    });
}