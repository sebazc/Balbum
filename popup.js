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
        let folder = document.getElementById("folder").value; // Get folder (option value) from field

        chrome.bookmarks.get(folder, (bookmark) => {
            if (bookmark[0].id === folder) {
                let node = bookmark[0]; //alert(node.id);

                chrome.bookmarks.create({ // Creates the bookmark
                    'title': title,
                    'url': url,
                    'parentId': node.id
                });

                description = document.getElementById("description").value;
                let data = {};
                data[`${url}`] = description;
                chrome.storage.sync.set(data, () => {
                    document.getElementById("remove_bookmark_button").disabled = false;
                    document.getElementById("update_description_button").disabled = false;
                    document.getElementById("add_comment_button").disabled = false;
                    document.getElementById("comment").disabled = false;
                    document.getElementById("clear_comment_button").disabled = false;

                    document.getElementById("add_bookmark_button").disabled = true; // to review
                    setActivity("Bookmark added"); window.close();
                });
            } else { alert(bookmark[0].title); setActivity("Bookmark could not be added"); }
        });
    });
});

// Remove bookmark for the current tab
document.getElementById("remove_bookmark_button").addEventListener("click", () => {
    let answer = window.confirm("Are you sure you want to remove this bookmark? If so, information will be lost.");
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
document.getElementById("folders_button").addEventListener("click", () => {
    chrome.windows.create({
        url: "folder.html",
        type: "popup",
        height: 500,
        width: 800
    });
});

// Listens to folder popup 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.foo != undefined) {
        let option = document.createElement("option");
        option.value = message.id;
        option.innerHTML = message.foo;
        option.selected = "selected";
        document.getElementById("folder").append(option);
    }
});








// Open options page from button
document.getElementById("options_button").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
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

/* document.getElementById("name").addEventListener("mouseenter", () => {
    this.setAttribute("title", this.innerHTML);
}, false); */

/******************** DECLARATIONS ********************/

// Check if tab is already bookmarked
function isTabBookmarked() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => { // Get current tab
        let url = tabs[0].url;

        chrome.bookmarks.search(url, (bookmark) => { // Get current tab bookmark - if any
            let node = bookmark[0];

            if (node != undefined) { // Is the tab bookmarked? Yes -> execute code
                chrome.bookmarks.get(node.parentId, (new_bookmark) => { // Retrieve correct bookmark folder
                    let new_node = new_bookmark[0];
                    //document.getElementById("folder").value = new_node.title;
                    /* 
                                        let option = document.createElement("option");
                                        option.value = new_node.title;
                                        option.innerHTML = new_node.title;
                                        option.selected = "selected";
                                        document.getElementById("folder").append(option); */

                    let dropdown = document.getElementById("folder");
                    dropdown.innerHTML = `<option id="${new_node.id}">${new_node.title}</option>`;
                });

                document.getElementById("name").value = node.title;
                document.getElementById("remove_bookmark_button").disabled = false;
                document.getElementById("update_description_button").disabled = false;
                document.getElementById("add_comment_button").disabled = false;
                document.getElementById("comment").disabled = false;
                document.getElementById("clear_comment_button").disabled = false;

                document.getElementById("folders_button").disabled = true;
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
        document.getElementById("name").setAttribute("title", tabs[0].title);
    });
}

// Gets the node folder of the last bookmark, and put it in folder field
function setDefaultFolder() {
    chrome.bookmarks.getRecent(100, (bookmarks) => { // 100 -> -> recent bookmarks
        let parents = [];

        bookmarks.forEach((item) => { // Gets list of parent ids
            parents.push(item.parentId);
        });

        chrome.bookmarks.get(parents, (folders) => { // parent ids -> -> parent bookmarks
            let index = 0; // for getting up to 8 options
            let list = []; // To control there are not repeated options

            for (let j = 0; j < parents.length; j++) {
                if (index === 8) {
                    break;
                }

                let option = document.createElement("option");
                option.value = folders[j].id;
                option.innerHTML = folders[j].title;

                if (j === 0) {
                    option.selected = "selected";
                    document.getElementById("folder").append(option);
                    index++;
                    list.push(folders[j].id);
                    continue;
                }

                //alert(folders[j].title);
                if (!(list.includes(folders[j].id))) { // check if current item title = title of previous item
                    document.getElementById("folder").append(option);
                    index++;
                    list.push(folders[j].id);
                }
            }

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
    }, 2000);
}

///////////////////////////////////


// on close, si description o comment esta completo, preguntar si bookmark

// Create a bookmark folder
