import React, { createContext, useContext, useState, FC, useEffect } from "react";
import { AuthContextState, IAuth, Roles } from "../types";
import axios, { AxiosInstance } from "axios";

const authDefaultValues: AuthContextState = {
    auth: {
        name: '',
        username: '',
        role: undefined,
        token: '',
    },
    axios: axios.create(),
    setAuthState: () => {}
}

export const AuthContext = createContext<AuthContextState>(authDefaultValues)
export const useAuth = () => useContext(AuthContext)

const AuthProvider: FC = ({children}) => {
    const [auth, _setState] = useState<IAuth>(authDefaultValues.auth)
    
    let axiosInstance: AxiosInstance = axios.create({
        baseURL: '/api/',
        timeout: 20000,
    })
    
    const TIMEOUT_MESSAGE = "Ups. Permintaan ke server terputus. Coba lagi"

    let token = auth.token
    
    axiosInstance.interceptors.request.use(function(config) {
        //Do something before request is sent
        config.headers = {
            accept: 'application/json',
            Authorization: 'Bearer '+token
        }
        return config;
    }, function (error){
        //Do something with request error
        if (error.code === "ECONNABORTED"){
            error.pesan = TIMEOUT_MESSAGE;
        } else {
            error.pesan = `Ups. Terjadi error. code: ${error.code}`;
        }
        return Promise.reject(error);
    })
    
    axiosInstance.interceptors.response.use(function(response){
        //Any status code that lie within the range of 2xx cause this function to trigger
        //Do something with response data
        return response;
    }, function(error){
        //Any status codes that falls outside the range of 2xx cause this function to trigger
        //Do something with response error
        let pesan = "error"
            if (error.code === "ECONNABORTED"){ //Handle timeout error
                pesan = TIMEOUT_MESSAGE;
            } else if (error.code) { //Handle other request error
                pesan = `Ups. Terjadi error. code: ${error.code}`;
            } else { //handle response error
                let errorCode = error.response.status
                switch(errorCode){
                    case 400 : pesan = "Terjadi error saat mengirim (400)"; break;
                    case 401 : {
                        console.log('haaai')
                        pesan = "Sesi login anda habis."
                        _setState(authDefaultValues.auth)
                        break;
                    }
                    case 403 : pesan = "Anda tidak memiliki akses untuk ini"; break;
                    case 404 : pesan = "URL / sesuatu yang dicari tidak ada"; break;
                    case 405 : pesan = "Metode request ini tidak diizinkan";  break;
                    case 408 : pesan = TIMEOUT_MESSAGE; break;
                    case 409 : pesan = "Terjadi konflik. Mungkin data yang anda kirim sudah ada."; break;
                    case 419 : pesan = "Token CSRF Anda hilang. silakan logout kemudian login kembali"; break;
                    case 422 : pesan = "Ada data yang tidak sesuai. Silakan periksa kembali"; break;
                    case 429 : pesan = "Anda terlalu banyak melakukan request ini"; break;
                    case (Math.floor(errorCode/100) === 5): //server error
                        pesan =`Ups. Terjadi error di dalam server. silakan coba lagi nanti (${errorCode})`;
                        break; 
                    default: pesan = `Ups. terjadi error (${errorCode})`;
                }
            }
            error.pesan = pesan;
            return Promise.reject(error);
    })

    const setAuthState = (newState: IAuth) => _setState(state => {
        return {
            ...state,
            ...newState,
        }
    })

    return (
        <AuthContext.Provider 
        value={{
            auth,
            axios: axiosInstance,
            setAuthState
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider