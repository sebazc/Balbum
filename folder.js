

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