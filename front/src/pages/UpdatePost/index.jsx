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
    
    
    const { toggleModals, modalState } = useContext(UserContext);

    const [fileDataURL, setFileDataURL] = useState(null);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState();
    const [validation, setValidation] = useState('');

    const localePost = JSON.parse(localStorage.getItem('updatePost'));
    
    
    const inputs = useRef([])
    


    const updateInputs = el => {
        if (el && !inputs.current.includes(el)) {
            inputs.current.push(el)
        }
    }


    const handleUpdate = async (e) => {

        e.preventDefault()
        
        try {

            const title = inputs.current[0].value;
            const text = inputs.current[1].value;
            const image = file;

            const postThing = ({ title: title, message: text, image: image });

            await axios.put(`${REGISTER_URL}/${localePost._id}`, postThing, {
                headers: {
                    "Content-type": "multipart/form-data",
                    "authorization": `${testAuthHeader.authorization}`,
                }
            })

                .then(res => {
                    setValidation('Publication modifé !');
                    setSuccess(true)                   
                })


        } catch (err) {
            if (!err?.response) {
                setValidation('pas de reponse serveur');

            } else {
                setValidation('Echec de la connexion')

            }
        }


    }

    const changeHandler = (e) => {
        const imageMimeType = /image\/(png|jpg|jpeg)/i;
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
            alert("Image mime type is not valid");
            return;
        }
        setFile(file);
    }

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
               success  ? ( 
                    <div className='message-success'>
                        <div className='message-content'>
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

