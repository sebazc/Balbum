// Elements from the page
const refreshButton = document.querySelector("#refresh_button")
const bookmarksManagerButton = document.querySelector("#open_bm_button")
const downloadButton = document.querySelector("#download_page")
const searchInput = document.querySelector("#searchInput")

const bookmarksList = document.querySelector("#unordered_list") // List of bookmarks in page

// Prints the bookmark list
chrome.bookmarks.getRecent(100000, (retrievedBookmarkList) => {
    retrievedBookmarkList.forEach(bookmarkNode => {
        let listItem = document.createElement('li')
        let listItemTitle = document.createElement('div')
        let listItemBody = document.createElement('div')

        listItem.setAttribute("id", `${bookmarkNode.id}`)

        chrome.bookmarks.get(bookmarkNode.parentId).then(bookmarkItems => { // Gets parent node, for its title/folder name
            let bookmarkNodeParent = bookmarkItems[0]

            chrome.storage.sync.get(bookmarkNode.url, (data) => { // Gets the comment if any

                let listItemSpanFolder = `<span id="${bookmarkNode.id}_span_folder" class="span_folder">${bookmarkNodeParent.title}</span>`
                let listItemSpanTitle = `<span id="${bookmarkNode.id}_span_title" class="span_title">${bookmarkNode.title}</span>`
                let listItemSpanCommentFlag = `<span id="${bookmarkNode.id}_span_comment_flag" class="span_comment_flag"></span>`
                let listItemSpanComment = `<span class="span_comment" id="${bookmarkNode.id}_span_comment"></span>`

                let listItemSection = ``
                let listItemSectionUrl = ``
                let listItemSectionDateAdded = ``

                listItemTitle.innerHTML = listItemSpanFolder + " / " + listItemSpanTitle

                if (data[`${bookmarkNode.url}`] != undefined && data[`${bookmarkNode.url}`] != "") {

                    listItemSpanCommentFlag = `<span id="${bookmarkNode.id}_span_comment_flag" class="span_comment_flag">+ Comment </span>`
                    listItemSpanComment = `<span class="span_comment" id="${bookmarkNode.id}_span_comment">${data[`${bookmarkNode.url}`]}</span>`

                    listItemTitle.innerHTML = listItemSpanFolder + " / " + listItemSpanTitle + listItemSpanCommentFlag + listItemSpanComment
                }
            })
            listItem.append(listItemTitle)
        })
        bookmarksList.append(listItem)
    })
})






// Refresh button functionality. It refreshes the page
refreshButton.addEventListener("click", () => {
    location.reload()
});

// Bookmarks Manager button functionality. It opens the chrome bookmarks manager
bookmarksManagerButton.addEventListener("click", () => {
    chrome.tabs.create({ url: "chrome://bookmarks/" })
});

// Download button functionality
downloadButton.addEventListener("click", () => {
    const data = "<!DOCTYPE html>\n" + document.documentElement.outerHTML; // See sources below for why this gets the entire page content.
    const link = document.createElement('a');
    link.setAttribute('download', 'balbum_bookmarks.html');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    link.click(); // In my tests, there was no need to add the element to the document for this to work.
})

// Search field functionality
searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    const itemList = document.querySelector("#unordered_list").querySelectorAll('li')
    itemList.forEach(item => {
        const isVisible = item.innerHTML.toLowerCase().includes(value)
        item.hidden = !isVisible
    })
})
