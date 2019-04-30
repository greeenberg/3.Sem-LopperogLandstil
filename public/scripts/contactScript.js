onload = async () =>{
    // Compile, Render and insert into page the navigation and footer templates 
    navigation();
    footer();
    

    const submit = document.getElementById('button_submit');
    submit.onclick = sendMessage;
};

// Sends a message to the backend. (theres no sanitizing, all values are allowed. Not optimal)
async function sendMessage() {
    const name = document.getElementById('contact_name');
    const mail = document.getElementById('contact_mail');
    const phone = document.getElementById('contact_phone');
    const message = document.getElementById('contact_message');
    const response = document.getElementById('contact_status');

    // Create the request body
    let postBody = {
        from: mail,
        html:`Navn: '${name.value}' <br> Email: '${mail.value} <br> Telefon: '${phone.value} <br> Besked: <br> '${message.value}`
    };

    // Send request
    let status = await fetch('/api/email/reservation', {method: 'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(postBody)
    });

    // Get the response
    let statusJSON = await status.json();
    // Act accordingly
    if(statusJSON.success){
        response.innerText = 'Besked Sendt!'
    }else {
        response.innerText = 'Der skete en fejl'
    }
}