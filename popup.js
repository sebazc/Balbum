/******************** SET UP ********************/

setDefaultName();
setDefaultFolder();
isTabBookmarked();

/******************** BEHAVIOUR ********************/

// Get focus over add bookmark button
document.getElementById("add_bookmark_button").focus();

// Add a bookmark for the current tab
document.getElementById("add_bookmark_button").addEventListener("click", () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let url = tabs[0].url; // Get url
        let title = document.getElementById("name").value; // Get name from field
        let folder = document.getElementById("folder").value; // Get folder from field

        chrome.bookmarks.search(folder, (bookmark) => {
            let node = bookmark[0];

            chrome.bookmarks.create({ // Creates the bookmark
                'title': title,
                'url': url,
                'parentId': node.id
            });

            description = document.getElementById("description").value;
            let data = {};
            data[`${url}`] = description;
            chrome.storage.sync.set(data, () => {
                alert("Description saved");
            });

            window.close();
        });
    });
});

// Remove bookmark for the current tab
document.getElementById("remove_bookmark_button").addEventListener("click", () => {
    answer = window.confirm("Are you sure you want to remove this bookmark? If so, information will be lost.");
    if (answer) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => { // Get current tab
            let url = tabs[0].url;

            chrome.bookmarks.search(url, (bookmark) => { // Get current tab bookmark
                let node = bookmark[0];

                chrome.bookmarks.remove(node.id); // Remove current tab bookmark
                chrome.storage.sync.remove(`${url}`); // Remove current tab description
                window.close();
            });
        });
    }
});

// Update description 
document.getElementById("update_description_button").addEventListener("click", () => {
    description = document.getElementById("description").value;

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let url = tabs[0].url;

        let data = {};
        data[`${url}`] = description;
        chrome.storage.sync.set(data, () => {
            setActivity("Description updated");
        });
    });
});

// Open popup with folder options
document.getElementById("folder").addEventListener("click", () => {
    chrome.windows.create({ url: "folder.html", type: "popup" });
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

/******************** DECLARATIONS ********************/

// Check if tab is already bookmarked
function isTabBookmarked() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => { // Get current tab
        let url = tabs[0].url;

        chrome.bookmarks.search(url, (bookmark) => { // Get current tab bookmark - if any
            node = bookmark[0];

            if (node != undefined) { // Is the tab bookmarked? Yes -> execute code
                chrome.bookmarks.get(node.parentId, (new_bookmark) => { // Retrieve correct folder
                    new_node = new_bookmark[0];
                    document.getElementById("folder").value = new_node.title;
                });

                document.getElementById("name").value = node.title;
                document.getElementById("remove_bookmark_button").disabled = false;
                document.getElementById("update_description_button").disabled = false;
                document.getElementById("add_comment_button").disabled = false;

                document.getElementById("add_bookmark_button").disabled = true; // to review

                chrome.storage.sync.get(`${url}`, (data) => { // Retrieve correct description
                    if (data[`${url}`] != undefined) {
                        document.getElementById("description").value = data[`${url}`];
                    }
                });
            }
        });
    });
}

// Gets the title of the tab, and put it in the name field
function setDefaultName() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
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

// Set activity message after action 
function setActivity(message) {
    element = document.getElementById("message");
    element.innerText = `${message}`;
    element.style.color = "green";

    setTimeout(() => {
        element.innerText = "";
        //document.getElementById("activity").innerText = "Activity: ";
    }, 2000);
}

///////////////////////////////////


// on close, si description o comment esta completo, preguntar si bookmark

// Create a bookmark folder
