
// Set-up ////////////////////////////////////////

setDefaultName();
setDefaultFolder();
isTabBookmarked();

//setCommentsStatus();

// Behaviour ////////////////////////////////////////

// Get focus over add bookmark button
document.getElementById("add_bookmark_button").focus();

// Add a bookmark for the current tab
document.getElementById("add_bookmark_button").addEventListener("click", () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        let url = tabs[0].url; // Get url
        let title = tabs[0].title; // Get title
        let folder = document.getElementById("folder").value; // Get folder

        chrome.bookmarks.search(folder, (bookmark) => {
            let node = bookmark[0];

            chrome.bookmarks.create({
                'title': title,
                'url': url,
                'parentId': node.id
            });
            window.close();
        });
    });   
});

// Remove bookmark for the current tab
document.getElementById("remove_bookmark_button").addEventListener("click", () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        let url = tabs[0].url;

        chrome.bookmarks.search(url, (bookmark) => {
            let node = bookmark[0];

            chrome.bookmarks.remove(node.id); // If there is text in description/comments, ask the user
            window.close();
        });
    });
});

// Update description 
document.getElementById("update_description_button").addEventListener("click", () => {
    description = document.getElementById("description").value;

    let data = {};
    data["de"] = description;
    chrome.storage.sync.set(data, () => {
        alert("Description");
    });
});

// Open popup with folder options
document.getElementById("folder").addEventListener("click", () => {
    chrome.windows.create({url: "folder.html", type: "popup"});
});

// Clear the description field
document.getElementById("clear_description_button").addEventListener("click", () => {
    document.getElementById("description").value = "";
    document.getElementById("description").focus();
});

// Clear the comment field
document.getElementById("clear_comment_button").addEventListener("click", () => {
    document.getElementById("comment").value = "";
    document.getElementById("comment").focus();
});

//document.getElementById("name").addEventListener("mouseenter", () => {});

// Declarations ////////////////////////////////////////

// Check if tab is already bookmarked
function isTabBookmarked() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        let url = tabs[0].url;

        chrome.bookmarks.search(url, (bookmark) => {
            node = bookmark[0];

            if(node != undefined) { // Is the tab bookmarked? Yes -> execute code
                chrome.bookmarks.get(node.parentId, (new_bookmark) => { // Retrieve correct folder
                    new_node = new_bookmark[0];
                    document.getElementById("folder").value = new_node.title;
                });

                document.getElementById("name").value = node.title;
                document.getElementById("remove_bookmark_button").disabled = false;
                document.getElementById("update_description_button").disabled = false;
                document.getElementById("add_comment_button").disabled = false;

                document.getElementById("add_bookmark_button").innerHTML = "Update bookmark";

                chrome.storage.sync.get("de", (description)=> {
                    if(description) {
                        document.getElementById("description").value = description.de;
                    }
                });
            }
        });
    });
}

// Gets the title of the tab, and put it in the name field
function setDefaultName() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        document.getElementById("name").value = tabs[0].title;
    });
}

// Gets the node folder of the last bookmark, and put it in folder field
function setDefaultFolder() {
    chrome.bookmarks.getRecent(1, (bookmarks) => {
        let parent = bookmarks[0].parentId;

        chrome.bookmarks.get(parent, (folders) => {
            node = folders[0].title;
            document.getElementById("folder").value = node;
        });
    });
}




///////////////////////////////////


// on close, si description o comment esta completo, preguntar si bookmark

// Create a bookmark folder




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