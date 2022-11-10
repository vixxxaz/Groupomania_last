import axios from 'axios';


//creer la base de l url
export default axios.create({
    baseURL: 'http://localhost:3000/api'
});