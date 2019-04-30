onload = () => {
    // Get all the elements the script needs to access
    name = document.body.querySelector("#name");
    desciption = document.body.querySelector("#description");
    category = document.body.querySelector("#categories_input");
    price = document.body.querySelector("#price");
    amount = document.body.querySelector("#amount");
    submit = document.body.querySelector("#submit");
    unique = document.body.querySelector("#unique");
    chosenPic = document.body.querySelector("#chosenPicture");
    addInputFile = document.body.querySelector("#addInputFile");
    category_add = document.body.querySelector("#category_add");
    selected_category_list = document.body.querySelector("#category_list");
    submitNewCategory =document.body.querySelector("#submitCategory");
    categoryNameField =document.body.querySelector("#categoryNameField");
    deleteCategorySelector = document.body.querySelector("#category_delete");
    deleteCategory = document.body.querySelector("#category_delete_button");
    
    // Add functionality to buttons
    addInputFile.onclick = addInputToForm;
    submit.onclick = submitForm; 
    category_add.onclick = addCategory;
    submitNewCategory.onclick = createCategory;
    deleteCategory.onclick = deleteCat; 

    populateCategoryDropDown();
};

// ---------------- Initialization ---------------
let name = '', desciption = '', category = '', price = '', amount = '', submit = '', unique = '', chosenPic = '', addInputFile = '', category_add = '', selected_category_list = '', submitNewCategory = '', categoryNameField = '', deleteCategorySelector = '', deleteCategory = '';

let categories = new Set();
let productID;
let url = '/api/produkter';

// ------------------- Product -------------------
// Create a new file input and add it to the form that submits the files(pictures) to the server
function addInputToForm() {
    const form = document.body.querySelector("#picHolder")
    let addInput2 = document.createElement("input");
    addInput2.type = "file";
    addInput2.setAttribute('class','chosenPicture');
    addInput2.setAttribute('accept', 'image/*');
    addInput2.setAttribute('name', 'product');
    form.appendChild(addInput2);
};

// Upload the files(pictures) that is inside the form AND request the server to create the new product with refrences to the pictures.
async function submitForm() {
    let categoriesArray = []

    categories.forEach(elem => {
        categoriesArray.push(elem)
    })

    const product = {
        name: name.value,
        desciption: desciption.value,
        amount: amount.value,
        categories: categoriesArray,
        price: price.value,
        unique: unique.value
    }
    const JSONproduct = JSON.stringify(product)
    let res = await fetch(url, {
        method: "POST",
        body: JSONproduct,
        headers: {'Content-Type': 'application/json'}
    })

    let json = await res.json();
    productID = json.id;
    let upload = "/api/produkter/" + productID + "/uploadbilleder"

    const choices = document.body.querySelectorAll(".chosenPicture");

    let uploadForm = document.body.innerHTML += `<form id = "theForm" action ="${upload}" enctype="multipart/form-data"  method="POST"></form>`;
    const form = document.body.querySelector("#theForm");

    for(let i = 0; i < choices.length; i++){
        form.appendChild(choices[i]);
    }
    form.submit(function (evt) {
        evt.preventDefault();
    });
    form.remove();
};

// Fill the category drop down menu with the available categories
async function populateCategoryDropDown() {
    category.innerHTML = ``;
    deleteCategorySelector.innerHTML = ``;
    const url = "/api/produktkategorier";
    fetch(url)
        .then(res => res.json())
        .then(res =>{
            for(let cat of res) {
                category.innerHTML += `<option value="${cat}">${cat}</option>`;
                deleteCategorySelector.innerHTML += `<option value="${cat}">${cat}</option>`;
            }
        });
}

// Adds a category to the product that is currently being created
function addCategory(){
    let selected_category = category.value;

    selected_category_list.innerHTML += `<li class="categorylistelem" id="${selected_category}">${selected_category}</li>`;
    categories.add(selected_category);
};

//--------------------- Categories -----------------------

// Sends a request to the server to create a new category
async function createCategory() {
    const url = "/api/produktkategorier"
    const category ={name: categoryNameField.value}
    const JSONCat = JSON.stringify(category)

    fetch(url,{
        method: "POST",
        body: JSONCat,
        headers:{'Content-Type':'application/json'}
    })
    populateCategoryDropDown();
    categoryNameField.value = "";
};

// Send a request to the server to delete a category
async function deleteCat(){
    let url = "/api/produktkategorier/" + deleteCategorySelector.value;
    fetch(url, {method: "DELETE"});
    populateCategoryDropDown();
};