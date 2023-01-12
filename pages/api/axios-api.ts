import axios from 'axios';
import * as https from "https";
import {getResponseData} from '../../utilis/helper'
type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";
const httpsAgent =  new https.Agent({
    rejectUnauthorized: false,
  })
export default class AxiosApi {
    
    static ApiURL = "https://arubaito.online/api/";
    
    static call = async (requestBody:any, path:string, method:Methods, header?:string) => {
        let url = path ? `${this.ApiURL}${path}` : this.ApiURL;
        // let accessToken = localStorage.getItem('api_token');
        let headers = {
            "Content-Type": "application/json",
            "remember-token":header?header:localStorage.getItem("token") ? localStorage.getItem("token") : ""

        };


        // if (accessToken) {
        //     headers['api-token'] = `${accessToken}`
        // }
        try {
            const response = await axios[method](url
                , method === 'get' ? {
                        headers: headers,
                        timeout: 1200000
                    }
                    : method === 'delete' ? {
                            headers: headers,
                            data: requestBody
                        }
                        : requestBody, {
                    headers: headers,
                    timeout: 1200000, 
                     httpsAgent: httpsAgent,
                }
                // , {crossDomain: true}
                );
            return getResponseData(response);
        } catch (e:any) {
            if (e.response) {
                return  getResponseData(e.response);
            } else
                return e;
        }
    }
}