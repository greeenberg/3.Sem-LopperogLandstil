let currentRow = 0;
let currentlyEditing = false;
let currentPictureId = 0;

onload = async () =>{
    let [tabletemplate, producttemplate, productedittemplate, productsJSON, categoriesJSON] = await Promise.all([fetch('/templates/inventorytable.hbs'), fetch('/templates/inventoryproductspecs.hbs'), fetch('/templates/inventoryproductspecsedit.hbs'), fetch('/api/produkter'), fetch('/api/produktkategorier')]);
    let [tabletemplateText, producttemplateText, productEditTemplateText, product, categories] = await Promise.all([tabletemplate.text(), producttemplate.text(), productedittemplate.text(), productsJSON.json(), categoriesJSON.json()]);
    const compiledTableTemplate = Handlebars.compile(tabletemplateText);
    const compiledProductTemplate = Handlebars.compile(producttemplateText);
    const compiledProductEdit = Handlebars.compile(productEditTemplateText);
    document.getElementById('inventory_main').innerHTML = await compiledTableTemplate({product});

    document.getElementById('link_to_front').onclick = () => {
        window.location.href = '/admin/session';
    };

    function addFunctionToRows() {
        let table = document.getElementById('inventory_table');
        for (let i = 1, row; row = table.rows[i]; i++) {
            row.onmouseover = function () {
                if(!currentlyEditing) {
                    getTableRowIndex(i)
                }
            }
        }
        const bins = document.getElementsByClassName('icon_bin');
        for (let i = 0, bin; bin = bins[i]; i++){
            bin.onclick = function () {
                deleteProduct(bin.id);
            }
        }
        const edits = document.getElementsByClassName('icon_edit');
        for (let i = 0, edit; edit = edits[i]; i++){
            edit.onclick = function () {
                currentlyEditing = true;
                editProduct(edit.id);
            }
        }
    }
    addFunctionToRows();


    function getTableRowIndex(row){
        if(row !== currentRow) {
            currentRow = row;
            document.getElementById('inventory_specs').innerHTML = compiledProductTemplate({product: product[currentRow-1]})
        }
    }

    async function deleteProduct(id) {
        let areYouSure = confirm('Er du sikker på at du vil slette valgte produkt? \nDette er permanent og kan ikke fortrydes');
        if(areYouSure) {
            await fetch('/api/produkter/' + id, {method: 'DELETE'});
            updateTable();
            document.getElementById('inventory_specs').innerHTML = compiledProductTemplate({product: product[currentRow - 2]})
        }
    }

    async function editProduct(id) {
        let tempCategories = new Set();
        currentPictureId = product[currentRow-1].pictures[0];

        for(let c of product[currentRow-1].categories){
            if(/\S/.test(c)) //ensure the category is more than just whitespace
                tempCategories.add(c);
        }

        document.getElementById('inventory_specs').innerHTML = compiledProductEdit({product: product[currentRow-1]});

        document.getElementById('exit').onclick = function () {
            currentlyEditing = false;
            document.getElementById('inventory_specs').innerHTML = compiledProductTemplate({product: product[currentRow-1]})
        };

        let categorieshtml = ""; //This shows already made categories
        categories.forEach(category => {
            categorieshtml += '<option value="'+category+'">'+category+'</option>';
        });
        document.getElementById('categories_input').innerHTML = categorieshtml;

        let productName = document.getElementById('inventory_product_edit_name');
        let productDesc = document.getElementById('inventory_product_edit_description');
        let productAmount = document.getElementById('inventory_product_edit_amount');
        let productReservedAmount = document.getElementById('inventory_product_edit_reservedamount');
        let productUnique = document.getElementById('inventory_product_edit_unique');
        let productPrice = document.getElementById('inventory_product_edit_price');
        let productDiscount = document.getElementById('inventory_product_edit_discount');

        let productCategories = document.getElementById('inventory_product_edit_categories');
        let productCategoriesAdd = document.getElementById('categories_add');
        let productCategoriesRemove = document.getElementById('categories_remove');
        let productCategoriesInput = document.getElementById('categories_input');




        productCategoriesAdd.onclick = function () {
            let category = productCategoriesInput.value;
            tempCategories.add(category);

            let approved = "";
            tempCategories.forEach(elem => {
                approved += '<li id="individual_category_'+elem+'">'+elem+'</li>'
            });
            productCategories.innerHTML = approved;

        };

        productCategoriesRemove.onclick = function () {
            let category = productCategoriesInput.value.trim();
            if(/\S/.test(category) && tempCategories.has(category)){

                tempCategories.delete(category);

                let approved = "";
                tempCategories.forEach(elem => {
                    approved += '<li id="individual_category_'+elem+'">'+elem+'</li>'
                });
                productCategories.innerHTML = approved;
            }
        };





        document.getElementById('save').onclick = async function () {

            let pictureData = await getPicturesFormData();

            await fetch('/api/produkter/'+id+'/uploadbilleder', {method: 'POST', body: pictureData});


            let data = {};
            let p = product[currentRow-1];

            if(productName.value !== p.name){data.name = productName.value}
            if(productDesc.value !== p.description){data.desc = productDesc.value}
            if(productAmount.value !== p.amount){data.amount = productAmount.value}
            if(productReservedAmount.value !== p.reservedAmount){data.reservedAmount = productReservedAmount.value}
            if(productUnique.checked !== p.unique){data.unique = productUnique.checked}
            if(productPrice.value !== p.price){data.price = productPrice.value}
            if(productDiscount.value !== p.discount){data.discount = productDiscount.value}
            let newCategories = [];
            tempCategories.forEach(elem => {newCategories.push(elem)});
            if(newCategories !== p.categories) {data.categories = newCategories}


            let status = await fetch('/api/produkter/'+ id, {method: 'PUT',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(data)
            });

            let statusJSON = await status.json();

            if(statusJSON.success){
                document.getElementById('edit_status').innerText = 'Produkt opdateret';
                updateTable();
            }else{
                document.getElementById('edit_status').innerText = 'Upload fejlede';
            }
        };
    }

    async function updateTable() {
        productsJSON = await fetch('/api/produkter');
        product = await productsJSON.json();
        document.getElementById('inventory_main').innerHTML = await compiledTableTemplate({product});
        addFunctionToRows();
    }

};

function pictureFunction(smallImg) {
    let bigImg = document.getElementById("main-product-bigPicture");
    bigImg.src = smallImg.src;
}

async function getPicturesFormData(){
    let formData = new FormData();
    let pictureUpload = document.getElementById('Inventory_product_upload');
    if(pictureUpload.files.length) {
        for (let i = 0; i < pictureUpload.files.length; i++) {
            await formData.append('product', pictureUpload.files[i])
        }
    }
    return formData;
}