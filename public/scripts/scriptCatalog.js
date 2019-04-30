onload = async () => {
    navigation();
    footer();

    // ------------ Catalogue-Menu --------------
    const katalogMenu = await fetch('/api/produktkategorier');
    let katalogMenuJSON = await katalogMenu.json();

    katalogMenuJSON.sort();

    const katalogMenuTemplate = await fetch('/templates/catalogmenu.hbs');
    const katalogMenuTemplateText = await katalogMenuTemplate.text();

    const compiledKatalogMenuTemplate = Handlebars.compile(katalogMenuTemplateText);
    document.getElementById("menu-content").innerHTML = compiledKatalogMenuTemplate({kategori: katalogMenuJSON});
    document.getElementById("mobile-menu-list").innerHTML = compiledKatalogMenuTemplate({kategori: katalogMenuJSON});


    // -------- Fill Catalouge with products ------------
    // Get the category from the URL. http://www.baseling.dk/catalouge/CATEGORY
    const productURL = window.location.href;
    const splitURL = productURL.split('?');
    const ID = splitURL[1];

    // Teach handlebars to do simple math
    Handlebars.registerHelper("minus", function (a, b) {
        return a - b;
    });

    if(ID == null || ID == undefined) {
        // No category
        const katalogProducts = await fetch('/api/produkter');
        const katalogProductsJSON = await katalogProducts.json();

        const katalogTemplate = await fetch('/templates/productDisplay.hbs');
        const katalogTemplateText = await katalogTemplate.text();

        const compiledKatalogTemplate = Handlebars.compile(katalogTemplateText);
        document.getElementById("products").innerHTML = compiledKatalogTemplate({product: katalogProductsJSON});
    } else if(ID == "Tilbud"){
        // Sales category
        const katalogProducts = await fetch('/api/produkter');
        const katalogProductsJSON = await katalogProducts.json();

        const productsOnSale = katalogProductsJSON.filter((product) => {
            return product.discount > 0;
        });

        const katalogTemplate = await fetch('/templates/productDisplay.hbs');
        const katalogTemplateText = await katalogTemplate.text();

        const compiledKatalogTemplate = Handlebars.compile(katalogTemplateText);
        document.getElementById("products").innerHTML = compiledKatalogTemplate({product: productsOnSale});
    }else if(ID == "Special"){
        // Unique products category
        const katalogProducts = await fetch('/api/produkter');
        const katalogProductsJSON = await katalogProducts.json();

        const uniqueProducts = katalogProductsJSON.filter((product) => {
            return product.unique;
        });

        const katalogTemplate = await fetch('/templates/productDisplay.hbs');
        const katalogTemplateText = await katalogTemplate.text();

        const compiledKatalogTemplate = Handlebars.compile(katalogTemplateText);
        document.getElementById("products").innerHTML = compiledKatalogTemplate({product: uniqueProducts});
    }
    else{
        // The categories that the owner created
        const katalogProducts = await fetch('/api/produktkategorier/' + ID);
        let katalogProductsJSON = await katalogProducts.json();

        // Sort the products before presenting them in the catalouge
        katalogProductsJSON.sort(function(a, b){
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        const katalogTemplate = await fetch('/templates/productDisplay.hbs');
        const katalogTemplateText = await katalogTemplate.text();

        const compiledKatalogTemplate = Handlebars.compile(katalogTemplateText);
        document.getElementById("products").innerHTML = compiledKatalogTemplate({product: katalogProductsJSON});
    }


    // -------------- Reservation popup ----------------
    const reserverButtons = document.getElementsByClassName("reservation");
    const reservationWindow = document.getElementById("reservationWindow");
    document.getElementById("closeBtn").onclick = () => {reservationWindow.style.display = "none";}

    for (btn of reserverButtons) {
        const btnProduct = btn.dataset.product;
        btn.onclick = () => {
            reservationWindow.style.display = "block";
            document.getElementById("reserverProduct").innerHTML = `Produkt: ${btnProduct}`;

        }
    }


    const submitReservation = document.getElementById("submitReservation");

    submitReservation.onclick = sendReservationMail;
};


// Send an request to server asking to send a notification to shop owner about a reservation
async function sendReservationMail() {
    const antal = document.getElementById("reserverAmount").value;
    const email = document.getElementById("reserverEmail").value;
    const telefonnr = document.getElementById("reserverPhone").value;
    const kommentare = document.getElementById("reserverComments").value;
    const produkt = document.getElementById("reserverProduct").innerHTML;

    const postBody = {
        from: email,
        html: ` ${produkt} <br> Antal : '${antal}' <br> Email : '${email}' <br> Telefonnr : '${telefonnr}' <br> Kommentare: '${kommentare}'`
    };

    let status = await fetch('/api/email/reservation', {method: 'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(postBody)
    });

    let statusJSON = await status.json();

    if(statusJSON.success){
        document.getElementById('error').innerText = 'Reservation forespørgsel sendt';
        setTimeout(function () {
            location.reload();
        }, 2000);
    }else{
        document.getElementById('error').innerText = 'Fejl: Reservation forespørgsel ikke sendt. Prøv igen';
    }
}
