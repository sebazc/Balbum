

let optionSelected;
let optionId;
let previousOption;

// 
chrome.bookmarks.getRecent(1000, (bookmarks) => { // Gets all bookmarks
    let parentBookmarksId = [];
    bookmarks.forEach(item => { // Gets all bookmarks parentId -> All folders
        parentBookmarksId.push(item.parentId);
    });

    chrome.bookmarks.get(parentBookmarksId, (parentBookmarks) => { // Gets bookmarks folder from ids
        let noRepeatFolder = [];
        for (let i = 0; i < parentBookmarks.length; i++) {
            if (!(noRepeatFolder.includes(parentBookmarks[i].id))) { // Checks if already listed. No -> execute
                let item = document.createElement("li");

                item.setAttribute("id", `${parentBookmarks[i].id}folder`);
                item.innerHTML = `${parentBookmarks[i].title}`;

                document.getElementById("list_folder").append(item);
                noRepeatFolder.push(parentBookmarks[i].id);
            }
        }
    });
});

// Send choosed option to popup
document.getElementById("choose_button").addEventListener("click", (tab) => {
    chrome.tabs.getCurrent((tab) => {
        let message = {
            foo: optionSelected,
            id: optionId
        };
        chrome.runtime.sendMessage(message, () => {});
        window.close();
    });
});


// Closed popup
document.getElementById("cancel_button").addEventListener("click", (tab) => {
    window.close();
});

// Click on option
window.onclick = (element) => {
    if (element.target.nodeName === "LI") {
        optionSelected = element.target.innerHTML;
        optionId = element.target.id.split("f")[0];

        element.target.className = "selected";
        let listOfLi = document.getElementsByTagName("li");

        for (let i = 0; i < listOfLi.length; i++) {
            if (listOfLi[i].innerHTML != element.target.innerHTML) {
                listOfLi[i].className = "";
            }
        }
    }
};

// Double click -> option seleted send 
document.addEventListener("dblclick", (element) => {
    if (element.target.nodeName === "LI") {
        optionSelected = element.target.innerHTML;
        optionId = element.target.id.split("f")[0];

        let message = {
            foo: optionSelected,
            id: optionId
        };
        chrome.runtime.sendMessage(message, () => {
            
        });
        window.close();
    }
});

