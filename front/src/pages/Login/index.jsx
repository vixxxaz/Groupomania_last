import React, { useContext, useRef, useState } from 'react';
import axios from '../../api/axios';
import { UserContext } from '../../context/userContext'
import './index.css'

//endpoint api
const REGISTER_URL = '/auth/login';

export default function Login() {

    // const testauthHeader = authHeader();
    const { toggleModals, modalState } = useContext(UserContext)
    const [validation, setValidation] = useState('');
    const inputs = useRef([])

    const addInputs = el => {
        if (el && !inputs.current.includes(el)) {
            inputs.current.push(el)
        }
    }

    
    //fonction qui envois la requete pour se login 
    const handleForm = async (e) => {

        e.preventDefault(inputs.current)

        try {
             //recupere  les données des input et les passe dans une variable data
            const email = inputs.current[0].value;
            const password = inputs.current[1].value;
            const data = JSON.stringify({ email: email, password: password });

            //envois la requete post, avec les données data et set le localstorage
            await axios.post(REGISTER_URL
                , { data })

                .then(res => {                   
                    localStorage.setItem("user", JSON.stringify(res.data));
                    setValidation('Connexion reussi !')
                    window.location.reload()
                })
          
                      

        } catch (err) {
            if (!err?.response) {
                setValidation('pas de reponse serveur');
            } else if (err.response?.status === 409) {
                setValidation('Couple mot de passe/email incorrect');
            } else {
                setValidation('Echec de la connexion')
            }
        }
    }


    return (
        <>
            { modalState.signInModal && (
                    <div className='login'>
                        <div className='modalLogin-content'>
                            <h2>Connexion</h2>

                            <form onSubmit={handleForm}>
                                <label htmlFor="signInEmail"> Email :</label>
                                <br />
                                <input
                                    aria-label='ajouter un mail'
                                    ref={addInputs}
                                    type="email"
                                    name="email"
                                    required
                                    id="signInEmail"
                                />
                                <br />
                                <label htmlFor="signUpPwd"> Mot de passe :</label>
                                <br />
                                <input
                                    aria-label='ajouter un mot de passe'
                                    ref={addInputs}
                                    type="password"
                                    name="pwd"
                                    required
                                    id="signInPwd"
                                />
                                <br />
                                <p className='validation-login'>{validation}</p>
                                <button id='connecter' className='btn-login'>Connecter</button>
                            </form>
                            <button onClick={() => toggleModals('signUp')}>S'inscrire ?</button>
                        </div>
                    </div>
                )
            }
           
        </>
    );
}

