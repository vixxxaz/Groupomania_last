import { createContext, useState } from 'react';

export const UserContext = createContext()

export function UserContextProvider(props) {

    //creer les states de base pour les modals
    const [ modalState, setModelState ] = useState({
        signUpModal: false,
        signInModal: false,
        newPostModal: false,
        updatePostModal: false,
        deletePostModal: false,
    });

    // condition qui change le state quand on appel les parametres ".."
    const toggleModals = modal => {

        if (modal === "signIn") {
            setModelState({
                signUpModal: false,
                signInModal: true,
                newPostModal: false,
                updatePostModal: false,
                deletePostModal: false,

            })
        }
        if (modal === "signUp") {
            setModelState({
                signUpModal: true,
                signInModal: false,
                newPostModal: false,
                updatePostModal: false,
                deletePostModal: false,

            })
        }
        if (modal === "newPost") {
            setModelState({
                signUpModal: false,
                signInModal: false,
                newPostModal: true,
                updatePostModal: false,
                deletePostModal: false,

            })
        }
        if (modal === "updatePost") {
            setModelState({
                signUpModal: false,
                signInModal: false,
                newPostModal: false,
                updatePostModal: true,
                deletePostModal: false,

            })
        }
        if (modal === "delete") {
            setModelState({
                signUpModal: false,
                signInModal: false,
                newPostModal: false,
                updatePostModal: false,
                deletePostModal: true,

            })

        }

        if (modal === "close") {
            setModelState({
                signUpModal: false,
                signInModal: false,
                newPostModal: false,
                updatePostModal: false,
                deletePostModal: false,

            })

        }


    }

    return (
        <UserContext.Provider value={{ modalState, toggleModals }}>
            {props.children}
        </UserContext.Provider>
    )
}