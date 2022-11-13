import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from '../../api/axios';
import { UserContext } from '../../context/userContext'
import './index.css'
import authHeader from '../../services/auth-header'
import {toast} from 'react-toastify'


//endpoint api
const REGISTER_URL = '/post';



//fonction inscription
export default function Publication() {

    const [fileDataURL, setFileDataURL] = useState(null);
    const [success, setSuccess] = useState(false);
    const { toggleModals, modalState } = useContext(UserContext)
    const [validation, setValidation] = useState('');
    const [file, setFile] = useState(null);
    const inputs = useRef([])

    const testauthHeader = authHeader();


    // add input in array
    const addInputs = el => {
        if (el && !inputs.current.includes(el)) {
            inputs.current.push(el)
        }
    }

    //envoyer le form
    const handleForm = async (e) => {

        e.preventDefault()

        try {

            const title = inputs.current[0].value;
            const text = inputs.current[1].value;
            const image = file;
            const postThing = ({ title: title, message: text, image: image });

            await axios.post(REGISTER_URL, postThing, {
                headers: {
                    "Content-type": "multipart/form-data",
                    "authorization": `${testauthHeader.authorization}`,
                }
                })

                .then(res => {
                    if (res.status === 200)
                    toast.success("Success!")
                    setValidation('post reussi')
                    setSuccess(true);     
                })


        } catch (err) {
            if (!err?.response) {
                setValidation('pas de reponse serveur');
            } else {
                setValidation('Echec de la connexion');
            }
        }
    }

    //ecoute le champ image
    const changeHandler = (e) => {
        const imageMimeType = /image\/(png|jpg|jpeg)/i;
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
            alert("Image mime type is not valid");
            return;
        }
        setFile(file);
    }

    //Preview de l image
    useEffect(() => {
        let fileReader, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }

    }, [file]);

    

    return (
        <>
            {
                success ? (
                    
                    <div className='modalPost'>
                        <div className='modalPost-content'>
                            <h1 className='title-message' >{validation}</h1 >
                            <br />
                            <button id='validation' className='btn-red' onClick={() => window.location.reload() } >ok</button>
                        </div>
                    </div>
                    
                )  : (
                    modalState.newPostModal && (
                        <div className='modalPost'>
                            <div className='modalPost-content'>
                                <h2>Publication</h2>
                                <button aria-label='fermer le post' className='btn-close-post' onClick={() => toggleModals("close")}>X</button>
                                <form onSubmit={handleForm}>
                                    <label htmlFor="NewPostTitle"> titre :</label>
                                    <br />
                                    <input
                                        aria-label='Entré un titre'
                                        ref={addInputs}
                                        type="text"
                                        name="title"
                                        required
                                        id="postTitle"
                                    />
                                    <br />
                                    <label htmlFor="NewPostdescription"> Exprimez vous :</label>
                                    <br />
                                    <textarea
                                        aria-label='Entré votre post'
                                        ref={addInputs}
                                        type="text"
                                        name="message"
                                        required
                                        id="postdescription"
                                    ></textarea>
                                    <br />
                                    <label htmlFor="NewPostImage" > Image:</label>
                                    <br />
                                    <input
                                        aria-label='ajouté un image'
                                        ref={addInputs}
                                        type="file"
                                        name="image"
                                        id="postImage"
                                        accept='.jpg,.jpge,.png'
                                        onChange={changeHandler}
                                    />

                                    {fileDataURL &&
                                        <p className="img-preview-wrapper">
                                            {
                                                <img src={fileDataURL} alt="preview" className='imgPostPreview' />
                                            }
                                        </p>}
                                    <p >{validation}</p>
                                    <button id='publier' className='btnPostRed'>Publier</button>
                                </form>

                            </div>

                        </div>

                    )
                )
            }
        </>
    );
}

