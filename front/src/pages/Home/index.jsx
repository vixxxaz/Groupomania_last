import React, { useContext, useState, useEffect } from 'react';
import axios from '../../api/axios';
import { UserContext } from '../../context/userContext'
import './index.css'
import authHeader from '../../services/auth-header'
import * as moment from 'moment';
import 'moment/locale/fr';
import { FaHeart, FaTrashAlt,  FaRegEdit } from 'react-icons/fa'

const REGISTER_URL = '/post';

function Home() {

    const [data, setData] = useState([]);
    const user = localStorage.getItem('user');
    const { toggleModals } = useContext(UserContext)
    const testauthHeader = authHeader();
    const [ validationDel, setValidationDel ] = useState('ok');
    const localeStorageUser = JSON.parse(localStorage.getItem("user"));

    //fonction qui recupere tous les posts
    const getAllPost = () => {
        try {

            if (!localeStorageUser) {

                toggleModals('signIn')
            }
            axios.get(REGISTER_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `${testauthHeader.authorization}`,
                }
            })
                .then(res => {
                    setData(res.data)
                })
        } catch (err) {

            if (!err?.response) {
                console.log('erreur serveur');
            } else {
                console.log('Echec de la connexion');
            }
        }
    }

    useEffect(() => {
        getAllPost();
        //je veut un rendu au chargement de la page 
        // eslint-disable-next-line
    }, []);

    // change like or dislike
    async function LikeDislike(likeDislike, idLikeDislike, userLiked, userDisliked) {

        const idUser = JSON.parse(user).userId;

        let number;

        if ((userLiked.indexOf(idUser) !== -1 && likeDislike === 'dislike') || (userDisliked.indexOf(idUser) !== -1 && likeDislike === 'like')) {

        } else {

            if (userLiked.indexOf(idUser) === -1 && userDisliked.indexOf(idUser) === -1) {

                if (likeDislike === 'like') {
                    number = 1;
                } 

            }  else if (userLiked.indexOf(idUser) !== -1 && likeDislike === 'like') {
                number = 0;
            }

            try {
                await axios.post(`${REGISTER_URL}/${idLikeDislike._id}/like`, { 'userId': idUser, 'like': number }, {
                    headers: {
                        'Content-Type': 'application/json',
                        "authorization": `${testauthHeader.authorization}`,
                    }
                })
                    .then(res => {
                        setValidationDel('Ca à marché !');
                        getAllPost();
                    })
            } catch (err) {
                if (!err?.response) {
                    setValidationDel('erreur serveur');
                } else {
                    setValidationDel('Echec de la connexion')
                }
            }
        }

    }

    //met a jour le localstorage
    function localStorageUpdate(idPost) {
        localStorage.setItem("updatePost", JSON.stringify(idPost));
        toggleModals('updatePost')
    }

    //met a jour le localstorage
    function DeletePublication(idPost) {
        localStorage.setItem("updatePost", JSON.stringify(idPost));
        toggleModals('delete')
    }

    return (
        <>
            
            <div className="modal">
                {data.map((x) => (
                    <article key={x._id} className='modal-content'>
                        <div className='container'>
                            <div className='container-content-text'>
                                {(x.userId === localeStorageUser.userId || localeStorageUser.admin) &&
                                    <>
                                        <button id='supprimer' className='btn-close-home' onClick={() => DeletePublication({ x })}><FaTrashAlt className='btn-close-trash' /></button>
                                        <button id='editer' className='btn-edit-home' onClick={() => { localStorageUpdate(x) }} ><FaRegEdit /></button>
                                    </>}
                                <div className='container-dis-like'>
                                    <button className={(x.usersLiked.indexOf(localeStorageUser.userId) !== -1) ? 'red' : 'grey'} onClick={() => LikeDislike('like', x, x.usersLiked, x.usersDisliked)}>
                                        <div aria-label='liker le post' className='align-btn-heart'><FaHeart />{x.likes}</div>                                                                          
                                    </button>                                                                  
                                </div>
                                <div className='truncate-overflow'>
                                    <p>{moment(x.createdDate).format("ddd Do MMM HH:mm ") }</p>
                                    <h2>{x.title}</h2>
                                    <p className='truncate-overflow' >{x.message}</p>
                                </div>
                            </div >
                            {typeof x.imageUrl !== 'undefined' &&
                                <div className='container-content-image'aria-label='image du post' >
                                    <img alt={x.title} src={x.imageUrl} className='image-post'  />
                                </div>
                            }
                        </div >
                    </article>
                ))
                }
            </div>
            
        </>)
}
export default Home;