// Elements from the page
const refreshButton = document.querySelector("#refresh_button")
const bookmarksManagerButton = document.querySelector("#open_bm_button")
const downloadButton = document.querySelector("#download_page")
const searchInput = document.querySelector("#searchInput")
const searchInputTitle = document.querySelector("#searchInputTitle")
const searchInputComments = document.querySelector("#searchInputComment")
const onlyCheckbox = document.querySelector("#only_commented")
const expandAllCheckbox = document.querySelector("#expand_all_checkbox")

const bookmarksList = document.querySelector("#unordered_list") // List of bookmarks in page

// Prints the bookmark list
chrome.bookmarks.getRecent(100000, (retrievedBookmarkList) => {
    retrievedBookmarkList.forEach(bookmarkNode => {
        let listItem = document.createElement('li')
        let listItemTitle = document.createElement('div')
        let listItemBody = document.createElement('div')
        listItemBody.setAttribute("class", "item_body")

        listItem.setAttribute("id", `${bookmarkNode.id}`)
        listItem.setAttribute("class", "item")
        listItemTitle.setAttribute("id", `${bookmarkNode.id}_title`)
        listItemBody.setAttribute("id", `${bookmarkNode.id}_body`)
        listItemBody.setAttribute('style', 'display: none')

        chrome.bookmarks.get(bookmarkNode.parentId).then(bookmarkItems => { // Gets parent node, for its title/folder name
            let bookmarkNodeParent = bookmarkItems[0]

            chrome.storage.sync.get(bookmarkNode.url, (data) => { // Gets the comment if any

                let listItemSpanFolder = `<span id="${bookmarkNode.id}_span_folder" class="span_folder">${bookmarkNodeParent.title}</span>`
                let listItemSeparator = `<span id="${bookmarkNode.id}_span_separator"> / </span>`
                let listItemSpanTitle = `<span id="${bookmarkNode.id}_span_title" class="span_title">${bookmarkNode.title}</span>`
                let listItemSpanCommentFlag = `<span id="${bookmarkNode.id}_span_comment_flag"></span>`
                let listItemSpanComment = `<span id="${bookmarkNode.id}_span_comment" class="span_comment"></span>`

                let listItemDescription = `
                <label>URL:<\label><br>
                <a id="${bookmarkNode.id}_urlLink" href=${bookmarkNode.url} target="_blank">${bookmarkNode.url}</a><br>
                <p>Date added: <span id="${bookmarkNode.id}_dateAdded">${Date(bookmarkNode.dateAdded)}</span></p><br>

                <label>Comments:</label><br>
                <textarea id="${bookmarkNode.id}_descriptionField" rows="5" cols="100"></textarea><br><br>
                <button id="${bookmarkNode.id}_update_description_button" class="update_button">Update description</button>
                <button id="${bookmarkNode.id}_clear_button" class="clear_button">Clear</button><span id="${bookmarkNode.id}_span_message"></span>
                <button id="${bookmarkNode.id}_remove_button" class="remove_button" style="margin-left: 508px; color: red;">Remove</button>`


                listItemTitle.innerHTML = listItemSpanFolder + listItemSeparator + listItemSpanTitle + listItemSpanCommentFlag + listItemSpanComment
                listItemBody.innerHTML = listItemDescription

                if (data[`${bookmarkNode.url}`] != undefined && data[`${bookmarkNode.url}`] != "") {

                    listItemSpanCommentFlag = `<span id="${bookmarkNode.id}_span_comment_flag" class="span_comment_flag">+ Comment </span>`
                    listItemSpanComment = `<span class="span_comment" id="${bookmarkNode.id}_span_comment">${data[`${bookmarkNode.url}`]}</span>`

                    document.getElementById(`${bookmarkNode.id}_descriptionField`).value = data[`${bookmarkNode.url}`]
                    listItemTitle.innerHTML = listItemSpanFolder + listItemSeparator + listItemSpanTitle + listItemSpanCommentFlag + listItemSpanComment
                    document.getElementById(`${bookmarkNode.id}_span_comment_flag`).setAttribute("class", "span_comment_flag")
                }
            })
            listItem.append(listItemTitle)
            listItem.append(listItemBody)
        })
        bookmarksList.append(listItem)
    })
})

// INTERACTABILITY

// Show and hide body sections of list items
window.onclick = (element) => {
    if (element.target.tagName === "LI") {
        elementId = element.target.id
        // console.log(elementId)
        testElement = document.getElementById(`${elementId}_body`)

        if (testElement.style.display !== 'none') {
            testElement.style.display = 'none'
        } else {
            testElement.style.display = ''
            document.getElementById(`${elementId}_descriptionField`).focus();
        }

        document.getElementById(`${elementId}_clear_button`).addEventListener("click", clear_function)
        document.getElementById(`${elementId}_update_description_button`).addEventListener("click", update_function)
        document.getElementById(`${elementId}_remove_button`).addEventListener("click", remove_function)

    }
    if (element.target.tagName === "SPAN" || element.target.tagName === "DIV") {
        falseElementId = element.target.id
        realElementId = document.getElementById(`${falseElementId}`).id.split("_")[0]
        testElement = document.getElementById(`${realElementId}_body`)

        if (testElement.style.display !== 'none') {
            testElement.style.display = 'none'
        } else {
            testElement.style.display = ''
            document.getElementById(`${realElementId}_descriptionField`).focus();
        }

        document.getElementById(`${realElementId}_clear_button`).addEventListener("click", clear_function)
        document.getElementById(`${realElementId}_update_description_button`).addEventListener("click", update_function)
        document.getElementById(`${realElementId}_remove_button`).addEventListener("click", remove_function)
    }
}

// Clear description
function clear_function() {
    let str = `${this.id}`.split("c");
    document.getElementById(`${str[0]}descriptionField`).value = "";
    document.getElementById(`${str[0]}descriptionField`).focus();
}

// Update description
function update_function() {
    let str = `${this.id}`.split("_");

    chrome.bookmarks.get(str[0], (bookmark) => {
        let data = {};
        let description = document.getElementById(`${str[0]}_descriptionField`).value;

        data[`${bookmark[0].url}`] = description;
        chrome.storage.sync.set(data, () => { // Gets description
            if (data[`${bookmark[0].url}`] = undefined || data[`${bookmark[0].url}`] == "") {
                document.getElementById(`${str[0]}_span_comment_flag`).innerHTML = "";
                document.getElementById(`${str[0]}_span_comment`).innerHTML = "";
                document.getElementById(`${str[0]}_span_comment_flag`).setAttribute("class", "")
            } else {
                document.getElementById(`${str[0]}_span_comment_flag`).innerHTML = "+ Comment ";
                document.getElementById(`${str[0]}_span_comment`).innerHTML = description;
                document.getElementById(`${str[0]}_span_comment_flag`).setAttribute("class", "span_comment_flag")
            }

        });
    });

    message = document.getElementById(`${str[0]}_span_message`)
    message.innerText = " Description updated"
    message.style.color = "green"
    message.style.paddingLeft = "10px"
    document.getElementById(`${str[0]}_remove_button`).style.marginLeft = "386.5px"
    setTimeout(() => {
        message.innerText = ""
        message.style.paddingLeft = "0px"
        document.getElementById(`${str[0]}_remove_button`).style.marginLeft = "508px"
    }, 2000);
}

// Remove bookmark
function remove_function() {
    let str = `${this.id}`.split("_");
    let to_remove_url = document.getElementById(`${str[0]}_urlLink`).getAttribute('href')
    let to_remove_list_item = document.getElementById(`${str[0]}`)

    let answer = window.confirm("Are you sure you want to remove this bookmark?\nIf you do so, comments will be lost.");
    if (answer) {
        // console.log(str[0])
        // console.log(to_remove_url)
        // console.log(to_remove_list_item)

        // remover bookmark con id
        chrome.bookmarks.remove(str[0])
        // remover local storage con url
        chrome.storage.sync.remove(`${to_remove_url}`)
        // remover list item
        to_remove_list_item.remove()
    }
}

// BUTTONS AT THE TOP

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
    searchInputTitle.value = ""
    searchInputComments.value = ""
    onlyCheckbox.checked = false
    const value = e.target.value.toLowerCase()
    const itemList = document.querySelector("#unordered_list").querySelectorAll('li')
    itemList.forEach(item => {
        const isVisible = item.innerHTML.toLowerCase().includes(value)
        item.hidden = !isVisible
    })
})

// Search field for title functionality
searchInputTitle.addEventListener("input", e => {
    searchInput.value = ""
    searchInputComments.value = ""
    onlyCheckbox.checked = false
    const value = e.target.value.toLowerCase()
    const itemList = document.querySelector("#unordered_list").querySelectorAll('li')
    itemList.forEach(item => {
        let spanTitle = document.getElementById(`${item.id}_span_title`)
        const isVisible = spanTitle.innerHTML.toLowerCase().includes(value)
        item.hidden = !isVisible
    })
})

// Search field for commented functionality
searchInputComments.addEventListener("input", e => {
    searchInput.value = ""
    searchInputTitle.value = ""
    onlyCheckbox.checked = false
    const value = e.target.value.toLowerCase()
    const itemList = document.querySelector("#unordered_list").querySelectorAll('li')
    itemList.forEach(item => {
        let spanComment = document.getElementById(`${item.id}_span_comment`)
        const isVisible = spanComment.innerHTML.toLowerCase().includes(value)
        item.hidden = !isVisible
    })
})

// Show list items with comments only
onlyCheckbox.addEventListener("change", () => {
    if (onlyCheckbox.checked) {
        const itemList = document.querySelector("#unordered_list").querySelectorAll('li')
        itemList.forEach(item => {
            let spanComment = document.getElementById(`${item.id}_span_comment_flag`)
            if (spanComment.innerHTML.length == 0) { item.hidden = true }
        })
    } else {
        const itemList = document.querySelector("#unordered_list").querySelectorAll('li')
        itemList.forEach(item => {
            item.hidden = false
        })
        searchInput.value = ""
        searchInputTitle.value = ""
        searchInputComments.value = ""
    }
})

// Expand/contract all list items
expandAllCheckbox.addEventListener("change", () => {
    if (expandAllCheckbox.checked) {
        const itemList = document.querySelector("#unordered_list").querySelectorAll('li')
        itemList.forEach(item => {
            let spanBody = document.getElementById(`${item.id}_body`)
            spanBody.style.display = ''
        })
    } else {
        const itemList = document.querySelector("#unordered_list").querySelectorAll('li')
        itemList.forEach(item => {
            let spanBody = document.getElementById(`${item.id}_body`)
            spanBody.style.display = 'none'
        })
    }
})
