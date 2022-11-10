import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import './index.css'
import axios from '../../api/axios';
import authHeader from '../../services/auth-header'
import Logo from '../Logo/logo'
import {ImExit} from 'react-icons/im'


//end point api
const REGISTER_URL = '/auth/user';

//export du component navbar 
function Navbar() {

    //recuperer le token
    const testAuthHeader = authHeader();

    //creer un tableau vide dans ce state
    const [dataNavbar, setDataNavbar] = useState([]);

    //recupere le state du context pour les modal 
    const { toggleModals } = useContext(UserContext)

    //creer une variable user autentifier
    let authenticateUser;

    //Creer une fonction logout

    const logout = () => {

        //nettoie le localstorage
        localStorage.clear();
        //recharge la page
        window.location.reload();

    };
    //si on recupere un objet vide user dans le ls athenticate false sinon true 
    if ((typeof localStorage.getItem('user')) == 'object') {       
        authenticateUser = false
    } else {
        authenticateUser = true
    }

    //function qui recupere le nom de l' user pour l 'afficher dans la barre de navigation, on pourra ajouter la photo du profil dans le futur 
    const getName = () => {

        //utilisation axios pour faire une requete get a l api passage des instruction et du token dans le header 
        try {

            axios.get(REGISTER_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `${testAuthHeader.authorization}`,
                }
                })

                .then(res => {
                    //met les données de la reponse dans le state
                    setDataNavbar(res.data)                    
                })

        } catch (err) {

            if (!err?.response) {
                console.log('erreur serveur');
            } else {
                console.log('Echec de la connexion');
            }

        }
    }

    //appel de la fonction getName dans use effect, va effectuer cette fonction au chargement de la page 
    useEffect(() => {
        getName();
    //je veut un rendu au chargement de la page 
    // eslint-disable-next-line
    }, []);
    
    return (

        <div className='navBar'>

            <Link className='logo' to="/">
                <Logo />
            </Link>
            
            {authenticateUser ?//si authenticate et true 
                <>
                    <div className='container-imgNavBar'>
                        <p>Bienvenue {dataNavbar.name} </p>
                        <img className='img-profil' src={dataNavbar.picture} alt="" />
                    </div>
                    <nav>
                        <ul >
                            <li><button className="btnNav" onClick={() => toggleModals('newPost')}>Nouveau post</button></li>
                            <li><button className="icoNav" onClick={logout}><ImExit /></button></li>
                        </ul>
                    </nav>
                </>
                ://sinon
                <nav>
                    <ul>
                        <li> <button className="btnNav" onClick={() => toggleModals('signUp')}>Inscription</button></li>
                        <li> <button className="btnNav" onClick={() => toggleModals('signIn')}>Connexion</button></li>
                    </ul>
                </nav>
            }
        </div >
    );
}

export default Navbar