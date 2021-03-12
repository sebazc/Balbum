/* SET UP */



/* BEHAVIOUR */

// Prints the list of bookmarks
chrome.bookmarks.getRecent(10000, (tree) => {
    let parentIds = [];

    tree.forEach(item => {
        parentIds.push(item.parentId);
    });

    chrome.bookmarks.get(parentIds, (parents) => {
        printList(tree, parents);
    });
});

// Opens the information section for the bookmark
window.onclick = (element) => {
    let section = null;
    let itemId = null;

    if (element.target.tagName === "LI") {
        itemId = element.target.id;
        section = document.getElementById(`${element.target.id}-section`); 
    }

    if (element.target.tagName === "SPAN") {
        itemId = document.getElementById(`${element.target.id}`).id.split("s")[0];
        section = document.getElementById(`${itemId}-section`);
    }

    if (section != null) { // Check whether the element clicked has a section element
        if (section.style.display === "none") { // Check if section is open: Yes -> execute // section.style.display
            section.style.display = "block";
            document.getElementById(`${itemId}`).style.fontWeight = "bold";

            section.innerHTML = `
                <label>URL:<\label><br>
                <a id="${itemId}urlLink"></a><br>
                <p>Date added: <span id="${itemId}dateAdded"></span></p><br>

                <label>Description:</label><br>
                <textarea id="${itemId}descriptionField" rows="5" cols="100"></textarea><br><br>
                <button id="${itemId}update_description_button" class="update_button">Update description</button>
                <button id="${itemId}clear_button" class="clear_button">Clear</button><span id="${itemId}span_message"></span>
            `;

            document.getElementById(`${itemId}clear_button`).addEventListener("click", clear_function);
            document.getElementById(`${itemId}update_description_button`).addEventListener("click", update_function);

            chrome.bookmarks.get(itemId, (node) => { // Get bookmark for this item   
                let url = node[0].url;

                document.getElementById(`${itemId}urlLink`).innerText = url;
                document.getElementById(`${itemId}urlLink`).setAttribute("href", url);
                document.getElementById(`${itemId}urlLink`).setAttribute("target", "_blank");

                document.getElementById(`${itemId}dateAdded`).innerText = new Date(node[0].dateAdded);

                chrome.storage.sync.get(url, (data) => { // Gets the description
                    if (data[`${url}`] != undefined) {
                        document.getElementById(`${itemId}descriptionField`).value = data[`${url}`];
                    }
                });
            });
        } else {
            section.style.display = "none";
            section.innerHTML = "";
            document.getElementById(`${itemId}`).style.fontWeight = "";
        }
    }
};


/* DECLARATIONS */

// To print each node
function printList(list, parents) { // add link, does it have information, || list of bookmarks, parents
    let listContainer = document.createElement('div');
    let listElement = document.createElement('ul');

    for (let i = 0; i < list.length; i++) {
        let itemElement = document.createElement('li');
        let itemSection = document.createElement("li");

        itemElement.setAttribute("id", `${list[i].id}`);
        itemElement.innerHTML = `${parents[i].title} / ${list[i].title} <span id="${list[i].id}span_info" style="color:#66ff33; background-color:darkgreen"></span> <span id="${list[i].id}span_text"></span>`;

        itemSection.setAttribute("id", `${list[i].id}-section`);
        itemSection.setAttribute("class", "section");
        //itemSection.innerHTML = `${list[i].url}`;
        itemSection.style.display = "none";


        chrome.storage.sync.get(list[i].url, (data) => { // Gets the description
            if (data[`${list[i].url}`] != undefined && data[`${list[i].url}`] != "") {
                itemElement.innerHTML = `${parents[i].title} / ${list[i].title} <span id="${list[i].id}span_info" style="color:#66ff33; background-color:darkgreen">(+ Information)</span> <span id="${list[i].id}span_text">${data[`${list[i].url}`]}</span>`; 
            }
        }); //#66ff33

        listElement.append(itemElement);
        listElement.append(itemSection);
    }

    listContainer.append(listElement); // Div includes ul element
    document.getElementById("list").append(listContainer); // Div includes div element
}

// Clear description
function clear_function() {
    let str = `${this.id}`.split("c");
    document.getElementById(`${str[0]}descriptionField`).value = "";
    document.getElementById(`${str[0]}descriptionField`).focus();
}

// Update description
function update_function() {
    let str = `${this.id}`.split("u");

    chrome.bookmarks.get(str[0], (bookmark) => {
        let data = {};
        let description = document.getElementById(`${str[0]}descriptionField`).value;

        data[`${bookmark[0].url}`] = description;
        chrome.storage.sync.set(data, () => { // Gets description

            //alert(description);//data[`${bookmark[0].url}`]);
            if (data[`${bookmark[0].url}`] = undefined || data[`${bookmark[0].url}`] == "") {
                document.getElementById(`${str[0]}span_info`).innerHTML = "";
                document.getElementById(`${str[0]}span_text`).innerHTML = "";
            } else {
                document.getElementById(`${str[0]}span_info`).innerHTML = "(+ Information)";
                document.getElementById(`${str[0]}span_text`).innerHTML = description; 
            }
            
        });
    });

    message = document.getElementById(`${str[0]}span_message`);
            message.innerText = " Description updated";
            message.style.color = "green";

            setTimeout(() => {
                message.innerText = "";
            }, 2000);
}

// Reload page
document.getElementById("refresh_button").addEventListener("click", () => {
    location.reload();
});

// Open Chrome Bookmarks Manager
document.getElementById("open_bm_button").addEventListener("click", () => {
    chrome.tabs.create({ url: "chrome://bookmarks/" })
});

document.getElementById("export_descriptions").addEventListener("click", () => {
    //alert("hello");
    chrome.storage.local.get(null, function(items) { // null implies all items
        // Convert object to a string.
        var result = JSON.stringify(items);
    
        // Save as file
        var url = 'data:application/json;base64,' + btoa(result);
        chrome.downloads.download({
            url: url,
            filename: 'filename_of_exported_file.json'
        });
    });
});