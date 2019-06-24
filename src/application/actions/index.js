import axios from 'axios';
import { resolve } from 'dns';
export const getData = (link) => {
    return axios.get(link)
    .then(response=>{
        return response;
    })
}