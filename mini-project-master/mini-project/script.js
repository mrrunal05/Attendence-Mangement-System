const itemList = document.getElementById("itemList");
const addItemButton = document.getElementById("addItem");

addItemButton.addEventListener("click", addItem);

function addItem() {
    const newItem = createItem("John Doe", 30);
    itemList.appendChild(newItem);
}

function createItem(name, age) {
    const item = document.createElement("li");
    item.className = "item";

    const itemText = document.createTextNode(`Name: ${name}, Age: ${age}`);
    item.appendChild(itemText);

    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon";
    deleteIcon.innerHTML = "&#128465;";
    deleteIcon.addEventListener("click", () => {
        itemList.removeChild(item);
    });

    item.appendChild(deleteIcon);

    return item;
}
