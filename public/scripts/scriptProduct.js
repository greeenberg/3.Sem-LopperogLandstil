onload = async () => {
    // Get the URL of the current site and extract the product id 
    // page url will look like this http://baseurl/product.html?PRODUCTID
    const productURL = window.location.href;
    const splitURL = productURL.split('?');
    const ID = splitURL[1];

    // Get the information about the specific product from the server
    const productID = await fetch('/api/produkter/' + ID);
    const productIdJSON = await productID.json();

    // Get the product template, compile it and render it with the product information
    const productTemplate = await fetch('/templates/productDescription.hbs');
    const productTemplateText = await productTemplate.text();
    const compiledProductTemplate = Handlebars.compile(productTemplateText);
    document.getElementById("product-container").innerHTML = await compiledProductTemplate(productIdJSON);

    // Imports script for footer
    navigation();
    footer();

    // -------------- Reservation popup ----------------
    const reserverButton = document.getElementById("reservation");
    const reservationWindow = document.getElementById("reservationWindow");
    document.getElementById("closeBtn").onclick = () => {reservationWindow.style.display = "none";}

    const btnProduct = reserverButton.dataset.product;
    reserverButton.onclick = () => {
        reservationWindow.style.display = "block";
        document.getElementById("reserverProduct").innerHTML = `Produkt: ${btnProduct}`;
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