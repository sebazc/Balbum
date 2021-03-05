

// 
chrome.bookmarks.getRecent(1000, (bookmarks) => {
    let parentBookmarksId = [];
    bookmarks.forEach(item => {
        parentBookmarksId.push(item.parentId);
    });

    chrome.bookmarks.get(parentBookmarksId, (parentBookmarks) => {

        for (let i = 0; i < parentBookmarks.length; i++) {

            let item = document.createElement("li");

            item.setAttribute("id", `${parentBookmarks[i].id}folder`);
            item.innerHTML = `${parentBookmarks[i].title}`;


            document.getElementById("list_folder").append(item);

        }
    });


});

// Send choosed option to popup
document.getElementById("choose_button").addEventListener("click", (tab) => {
    chrome.tabs.getCurrent((tab) => {
        let message = {
            type: "a_message_type",
            foo: "bar"
        };
        chrome.runtime.sendMessage(message, () => {
            window.close();
        });
    });
});

