import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from '../../api/axios';
import { UserContext } from '../../context/userContext'
import './index.css'
import authHeader from '../../services/auth-header'

//end point api
const REGISTER_URL = '/post';

//creation de l update d'un poste 
function UpdatePost() {

    //recupere le token dans le context 
    const testAuthHeader = authHeader();
    
    //recupere le state du context pour les modals
    const { toggleModals, modalState } = useContext(UserContext);

    //met en place les states pour update de l image et data  et messages.
    const [fileDataURL, setFileDataURL] = useState(null);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState();
    const [validation, setValidation] = useState('');

    //donnée du post parse dans une variable
    const localePost = JSON.parse(localStorage.getItem('updatePost'));
     
    //met la valeur de useRef a zero dans input permet d'acceder au input vide avec current
    const inputs = useRef([])
    
    //updateInputs ref des inputs dans le jsx
    const updateInputs = el => {
        //si l inputs inclu un element 
        if (el && !inputs.current.includes(el)) {
            //ajoute les données au tableau
            inputs.current.push(el)
        }

    }

    //function asyncrone pour validation avec requete
    const handleUpdate = async (e) => {

        e.preventDefault()
        
        try {

            //construire variable à partir des données du tableau useref
            const title = inputs.current[0].value;
            const text = inputs.current[1].value;
            const image = file;

            //creer un objet avec les nomination du backend et le contenu des variable
            const postThing = ({ title: title, message: text, image: image });

            //envois requete put pour update, avec en template, url/ l'id du post ,et les data 
            await axios.put(`${REGISTER_URL}/${localePost._id}`, postThing, {
                //ajoute les headers avec authorization token 
                headers: {
                    "Content-type": "multipart/form-data",
                    "authorization": `${testAuthHeader.authorization}`,
                }
            })
                //reponse set de state et message 
                .then(res => {
                    setValidation('Publication modifé !');
                    setSuccess(true)                   
                })
        
        //change state pour message en cas d'erreur        
        } catch (err) {
            if (!err?.response) {
                setValidation('pas de reponse serveur');

            } else {
                setValidation('Echec de la connexion')

            }
        }


    }

    //ecoute le changement pour l input image 
    const changeHandler = (e) => {

         //ajout d'une regex pour format de l image 
        const imageMimeType = /image\/(png|jpg|jpeg)/i;

        //recuper le nom du fichier
        const file = e.target.files[0];

        //si le type de fichier est different de la regex
        if (!file.type.match(imageMimeType)) {

            //message d'alert
            alert("Image mime type is not valid");
            return;
        }
        //sinon ajout du fichier dans state
        setFile(file);
    }


    //pour permettre rerender de la preview
    useEffect(() => {
        //creation variable false
        let fileReader, isCancel = false;
        //si on a une image on la charge en preview
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {               
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result)
                }
            }
            //lit l'adresse de l image
            fileReader.readAsDataURL(file);
        }

        return () => {

            isCancel = true;

            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();//permet de fermer la preiew
            }
        }
    }, [file]);

    return (
        <>
            {
               success  ? ( 
                    <div className='modalPost'>
                        <div className='modalPost-content'>
                            <h1 className='title-message' >{validation}</h1 >
                            <br />
                            <button className='btn-red' onClick={() => window.location.reload()  } >ok</button>
                        </div>
                    </div>
                ) : (
                    modalState.updatePostModal && (
                        <div className='modalUpdate'>
                            <div className='modalUpdate-content'>
                                <button onClick={() => toggleModals("close")} className='btn-close-update'>X</button>
                                <h2>Modifier la publication</h2>
                                <form onSubmit={handleUpdate}>
                                    <label htmlFor="">Titre</label>
                                    <br />
                                    <input
                                        ref={updateInputs}
                                        type="text"
                                        name="titleUpdate"
                                        id="updateTitle"
                                        defaultValue={localePost.title} />
                                    <br />
                                    <label >Publication</label>
                                    <br />
                                    <textarea
                                        ref={updateInputs}
                                        type="text"
                                        name="descriptionUpdate"
                                        id="updateDescription"
                                        defaultValue={localePost.message}
                                    ></textarea>
                                    <br />
                                    {fileDataURL ? (
                                        <p className="img-preview-wrapper">
                                            {
                                                <img src={fileDataURL} alt="preview" className='imgUpdate' />
                                            }
                                        </p>) : (typeof localePost.imageUrl !== 'undefined' && (
                                            <><img alt={localePost.title} className="imgUpdate" src={localePost.imageUrl} /> </>))}
                                    <br />
                                    <label htmlFor="">Image</label>
                                    <br />
                                    <input
                                        ref={updateInputs}
                                        type="file"
                                        name="imageUpdate"
                                        id="updateImage"
                                        onChange={changeHandler} />
                                    <p>{validation}</p>
                                    <button className='btn-update'>Publier</button>
                                </form>

                            </div>
                        </div>

                    ))
            }

        </>

    );
}

export default UpdatePost;

