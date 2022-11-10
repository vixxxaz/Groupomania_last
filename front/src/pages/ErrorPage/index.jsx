import { Link } from "react-router-dom";
import styled from 'styled-components';

const Title = styled.h1`
    color: White;
    font-size: 1.4em;
    text-align:center;
    text-shadow:0 0 3px black;
`

const Info = styled.p`
    color: White;
    text-align:center;
    font-size:1.5em;
    text-shadow:0 0 3px black;
`

const Wrapper = styled.article`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    margin-top: 200px;

`
const Button = styled.button`
    background-color: #FD2D01;
    border-radius:5px;
    padding: 7px;    
    border-width: 0 2px 4px;
    touch-action: manipulation;
    color: #FFFFFF;
`



const ErrorPage = () => {
    return (
        
        <Wrapper>
            <Title>L'adresse de la page est incorrect !</Title>
            <Info>404 Page not found !</Info>             
            <Button><Link to="/">Page d'accueil</Link></Button>                                        
        </Wrapper>

        )    
    
}

export default ErrorPage