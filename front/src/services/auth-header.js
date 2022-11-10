//creer un service pour gerer le token 

function authHeader() {
    //creer une variable user 
    let user = '';

    //recupere les données user dans le local storage
    user = JSON.parse(localStorage.getItem('user'));

    //si on a un user et user token retourne user token dans authorization
    if (user && user.token) {

        return { authorization: user.token };

    } else {

        return {};

    }
}

export default authHeader;