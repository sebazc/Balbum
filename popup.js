let url;
let title;
let node;



function setURL(urle) {
    document.getElementById("comment").value = urle;
}




document.getElementById("name").value = getCurrentTabTitle();


// Gets focus over add bookmark button
document.getElementById("add_bookmark_button").focus();

// Gets the url of the current tab
/*function getCurrentTabURL() {
    let currentTabURL;
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        currentTabURL = tabs[0].url; // url = tabs[0].url;
        alert(tabs[0].url)
    });
    return currentTabURL;
}
*/
// 

let promise = new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        resolve(tabs[0].url); // url = tabs[0].url;
    });
});

promise.then(setURL);


// Gets the title of the tab, and put it in the name field

function getCurrentTabTitle() {
    let x;
    chrome.tabs.getSelected(null, function(tab) { // gets one item
        //title = tab.title;
        x = tab.title;
        // document.getElementById("name").value = title;
    });
    return x;
}

// Gets the node folder of the last bookmark, and put it in folder field

function getLastBookmarkNodeTitle() {
    chrome.bookmarks.getRecent(1, (bookmarks) => {
        let parent = bookmarks[0].parentId;

        chrome.bookmarks.get(parent, (folders) => {
            node = folders[0].title;
            document.getElementById("folder").value = node;
        });
    });
}




// Add a bookmark for the current tab
document.getElementById("add_bookmark_button").addEventListener("click", () => {
    chrome.bookmarks.create({
        'title': title,
        'url': url,
    });
    window.close();
});

// Enables remove button
/*
chrome.bookmarks.search(url, (bookmark) => {
    document.getElementById("remove_bookmark_button").disabled = false;
});
*/

// Remove bookmark for the current tab
document.getElementById("remove_bookmark_button").addEventListener("click", () => {


    
    chrome.bookmarks.search(url, (bookmark) => {
        node_to_remove = bookmark[0];
        document.getElementById("comment").value = node_to_remove.title;
    });
    
    /*
    chrome.bookmarks.remove(node_to_remove, () => {
        window.close();
    }); */
});



// on close, si description o comment esta completo, preguntar si bookmark

// Create a bookmark folder



// Clear the comment field
document.getElementById("clear_comment_button").addEventListener("click", () => {
    document.getElementById("comment").value = "";
    document.getElementById("comment").focus();
});














/*


chrome.storage.sync.get('allData', function(data) {
  // check if data exists.
  if (data) {
      allData = data;
  } else {
      allData[Object.keys(allData).length] = currentData;
  }
});

chrome.storage.sync.set({'allData': allData}, function() {
  // Notify that we saved.
  message('Settings saved');
});



*/