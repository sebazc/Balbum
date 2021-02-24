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
    section = document.getElementById(`${element.target.id}-section`);

    if (section != null) { // Check whether the element clicked has a section element
        if (section.style.display === "none") { // Check if opening section: Yes -> execute
            section.style.display = "block";
            document.getElementById(`${element.target.id}`).style.fontWeight = "bold";

            section.innerHTML = `
                <label>URL:<\label><br>
                <a id="${element.target.id}urlLink"></a><br>
                <p>Date added: <span id="${element.target.id}dateAdded"></span></p><br>

                <label>Description:</label><br>
                <textarea id="${element.target.id}descriptionField" rows="5" cols="100"></textarea>

            `;


            chrome.bookmarks.get(element.target.id, (node) => { // Get bookmark for this item   
                let url = node[0].url;

                document.getElementById(`${element.target.id}urlLink`).innerText = url;
                document.getElementById(`${element.target.id}urlLink`).setAttribute("href", url);
                document.getElementById(`${element.target.id}urlLink`).setAttribute("target", "_blank");

                document.getElementById(`${element.target.id}dateAdded`).innerText = new Date(node[0].dateAdded);

                chrome.storage.sync.get(url, (data) => { // Gets the description
                    if (data[`${url}`] != undefined) {
                        
                        
                        
                        document.getElementById(`${element.target.id}descriptionField`).value = data[`${url}`];
                    }
                });
            });
        } else {
            section.style.display = "none";
            section.innerHTML = "";
            document.getElementById(`${element.target.id}`).style.fontWeight = "";
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
        itemElement.innerHTML = `${parents[i].title} / ${list[i].title}`;

        itemSection.setAttribute("id", `${list[i].id}-section`);
        itemSection.setAttribute("class", "section");
        //itemSection.innerHTML = `${list[i].url}`;
        itemSection.style.display = "none";


        chrome.storage.sync.get(list[i].url, (data) => { // Gets the description
            if (data[`${list[i].url}`] != undefined) {
                itemElement.innerHTML = `${parents[i].title} / ${list[i].title} <span style="color:#66ff33; background-color:darkgreen">(+ Information)</span>`;
            }
        }); //#66ff33

        listElement.append(itemElement);
        listElement.append(itemSection);
    }

    listContainer.append(listElement); // Div includes ul element
    document.getElementById("list").append(listContainer); // Div includes div element
}



