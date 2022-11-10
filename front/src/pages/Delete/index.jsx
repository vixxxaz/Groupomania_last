import React, { useContext,  useState } from 'react';
import axios from '../../api/axios';
import authHeader from '../../services/auth-header'
import { UserContext } from '../../context/userContext'
import './style.css'

//end point api
const REGISTER_URL = '/post';

function Delete() {
    

    const [validationDel, setValidationDel] = useState('');
    const testauthHeader = authHeader();
    const { toggleModals, modalState } = useContext(UserContext)
    
    function DeletePublication() {

        const dataDel = JSON.parse(localStorage.getItem('updatePost'));

        try {
            axios.delete(`${REGISTER_URL}/${dataDel.x._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `${testauthHeader.authorization}`,
                }
            })
                .then((res) => {
                    //met le message dans le state
                    setValidationDel('post effacé');
                    window.location.reload();
                })
                

        } catch (err) {
            if (!err?.response) {
                setValidationDel('erreur serveur');
            } else {
                setValidationDel('Echec de la connexion')
                localStorage.clear();
            }
        }
    }
    console.log(validationDel)
    return (
        <>
            {modalState.deletePostModal && (
                <div className='modalDelete'>
                    <div className='modalDelete-content'>
                        <p>Etes-vous sûre de vouloir supprimer votre publication?</p>
                        <div className='flex'>
                            <div ><button className="buttonDelete" onClick={() => DeletePublication()}>oui</button></div>
                            <div ><button className="buttonDelete" onClick={() => toggleModals("close")}>annuler</button></div>
                        </div>
                    </div>
                </div>) }
        </>
    )       
}
export default Delete