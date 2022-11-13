import React, { useContext, useRef, useState } from 'react';
import axios from '../../api/axios';
import { UserContext } from '../../context/userContext'
import './index.css'



//regex de validation de mot de pass et du mail
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

//terminaison url
const REGISTER_URL = '/auth/signup';

//fonction creation de compte
function Register() {

    //creer les state ,contexte ,validation
    const [success, setSuccess] = useState(false);
    const [validation, setValidation] = useState('');


    //ajouter les variable de context pour les modals
    const { modalState } = useContext(UserContext)
  
    //associer input a un tableau vide
    const inputs = useRef([])

    //addd Inputs ref des inputs dans le jsx
    const addInputs = el => {
        if (el && !inputs.current.includes(el)) {
            inputs.current.push(el)
        }
    }

    //submit du formulaire en asynchrone
    const handleForm = async (e) => {
        e.preventDefault()
        
        //regex pour controller les données rentré par l utilisateur
        const v1 = EMAIL_REGEX.test(inputs.current[0].value);
        const v2 = PWD_REGEX.test(inputs.current[3].value);

        //compare le nombre de lettre du password
        if ((inputs.current[3].value.length || inputs.current[2].value.length) < 8) {
            setValidation("8 caractères minimum")
            return;
        }
        //message d'erreur si les mot de passe ne correspondent pas
         if (inputs.current[3].value !== inputs.current[2].value) {
            setValidation("les mots de passes ne correspondent pas")
            return;
            
        //message si ne correspond pas au regex
        } else if (!v1 || !v2) {
            setValidation("le mot de passe doit contenir minimum: une minuscule, une majuscule, un chiffre et un caractère spécial");
            return;
            
        } try {

            //recuperer les données des input
            const email = inputs.current[0].value;
            const nom = inputs.current[1].value;
            const password = inputs.current[2].value;

            //creer les données de la requete
            const data = { email: email, password: password, nom: nom };

            //requete avec axios
            await axios.post( REGISTER_URL, { data })

                .then(res => {
                    //set les messages 
                    setValidation('Insription reussi !')
                    setSuccess(true);
                    console.log(res)
                })

            
        } catch (err) {//en cas d'erreur
            if (!err?.response) {
                setValidation('pas de reponse serveur');
                return;
            } else if (err.response?.status === 409) {
                setValidation('Email déja utilisé');
                return;
            } else {
                setValidation('Echec de l\'inscription');
                return;
            }
        }
    }
    return (
        <>  

         {
            success ? (                                  
                    <div className='message-success'>
                        <div className='message-content'>
                            <h1 className='title-message'>{validation}</h1>
                            <button id='connecter' onClick={() =>  window.location.reload()} className='btn-red'>Se connecter?</button>
                            {/* en cas de succes de la creation de compte cette div apparait proposant d aller sur connecter */}
                        </div>
                    </div >
            ) : (
                modalState.signUpModal && (
                    <div className='modalRegister'>
                        <div className='modalRegister-content'>
                            <h2>Inscription</h2>
                            <form onSubmit={handleForm}>
                                <label htmlFor="signUpEmail"> Email : </label>
                                <br />
                                <input
                                    aria-label='ajouter un mail'
                                    ref={addInputs}
                                    type="email"
                                    name="email"
                                    required
                                    id="signUpEmail"                                    
                                />
                                <br />
                                <label htmlFor="signUpEmail"> Nom : </label>
                                <br />
                                
                                <input
                                    aria-label='ajouté un nom'
                                    ref={addInputs}
                                    type="nom"
                                    name="nom"
                                    required
                                    id="signUpNom"
                                />
                                
                                <br />
                                <label htmlFor="signUpPwd"> Mot de passe : </label>
                                <br />
                                
                                <input
                                    aria-label='ajouté un password' 
                                    ref={addInputs}
                                    type="password"
                                    name="pwd"
                                    required
                                    id="signUpPwd"
                                />                               
                                                           
                                <br />
                                <label htmlFor="repeatPwd">répétez le Mot de passe</label>
                                <br />
                                <input
                                    aria-label='repeter le password'
                                    ref={addInputs}
                                    type="password"
                                    name="pwd"
                                    required
                                    id="repeatPwd"
                                />
                                <br />
                                <p>{validation}</p>
                                <button id='soumettre' className='btn-red btn-position'>Soumettre</button>
                            </form>
                        </div>
                    </div>
                )
            )
            }
        </>

    );

}

export default Register

