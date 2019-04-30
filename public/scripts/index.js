onload = async () => {
    navigation();
    footer();
    facebook(document, 'script', 'facebook-jssdk');
    
}

const facebook = (d, s, id) => {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/da_DK/sdk.js#xfbml=1&version=v3.2';
    fjs.parentNode.insertBefore(js, fjs);
}