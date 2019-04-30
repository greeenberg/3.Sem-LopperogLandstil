onload = () => {
    const name = document.querySelector('#username');
    const password = document.querySelector('#password');
    const button = document.querySelector('#button');
    const error = document.querySelector('#error');

    // Add functionality so that its possible to login by pressing enter
    password.addEventListener("keypress", function (e) {
        if(e.which == 13){
            button.click();
        }
    })

    name.addEventListener("keypress", function (e) {
        if(e.which == 13){
            button.click();
        }
    })

    // Request to login to the admin site
    button.onclick = async () => {
        const data = {name: name.value, password: password.value};
        const result = await fetch("/admin", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}

        });
        const answer = await result.json();
        if(answer.ok){
            window.location.href = '/admin/session';
        } else {
            error.innerHTML = 'Brugernavn eller kodeord er forkert';
        }
    }
};