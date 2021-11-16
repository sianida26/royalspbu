import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { Roles } from '../../types'

import zIndexes from '../../constants/zIndexes'

import axios from 'axios'

import DB from '../../utils/DB'

import Spinner from '../../components/Spinner'

interface ServerResponse {
    username: string,
    name: string,
    role: string,
    token: string,
}

export default function Login() {

    const {auth, setAuthState} = useAuth()
    const [isLoading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    let history = useHistory()

    const handleLogin = () => {
        setLoading(true)
        axios({
            method: 'post', 
            data:{username, password}, 
            url: '/api/login',
        })
        .then(result => {
            let data: ServerResponse = result.data
            let role = data.role === 'admin' ? Roles.ADMIN
                : data.role === 'operator' ? Roles.OPERATOR
                : data.role === 'developer' ? Roles.DEVELOPER
                : data.role === 'supervisor' ? Roles.SUPERVISOR
                : undefined
            setAuthState({
                name: data.name,
                role: role,
                username: data.username,
                token: data.token
            })
            localStorage.setItem('token',data.token)
            let db = new DB()
            db.auth.put({key: 'auth_token', value: data.token})
            db.auth.put({key: 'name', value: data.name})
            db.auth.put({key: 'username', value: data.username})
            db.auth.put({key: 'role', value: data.role})
            history.push('/')
            setErrorMsg('')
        })
        .catch(error => {
            //Any status codes that falls outside the range of 2xx cause this function to trigger
            //Do something with response error
            let pesan = "error"
            if (error.code === "ECONNABORTED"){ //Handle timeout error
                pesan = "Ups. Jaringan Anda terganggu. Silakan coba lagi";
            } else if (error.code) { //Handle other request error
                pesan = `Ups. Terjadi error. code: ${error.code}`;
            } else { //handle response error
                let errorCode = error.response.status
                switch(errorCode){
                    case 400 : pesan = "Terjadi error saat mengirim (400)"; break;
                    case 403 : pesan = "Anda tidak memiliki akses untuk ini"; break;
                    case 404 : pesan = "URL / sesuatu yang dicari tidak ada"; break;
                    case 405 : pesan = "Metode request ini tidak diizinkan";  break;
                    case 408 : pesan = "Ups. Jaringan Anda terganggu. Silakan coba lagi"; break;
                    case 419 : pesan = "Token CSRF Anda hilang. silakan tutup browser kemudian coba kembali"; break;
                    case 422 : pesan = "Username atau Password anda salah"; break;
                    case 429 : pesan = "Anda terlalu banyak melakukan request ini"; break;
                    case 500: //server error
                        pesan =`Ups. Terjadi error di dalam server. silakan coba lagi nanti (${errorCode})`;
                        break; 
                    default: pesan = `Ups. terjadi error (${errorCode})`;
                }
            }
            setErrorMsg(pesan)
            setLoading(false)
        })
    }

    return (
        <div className="tw-flex tw-flex-col tw-w-screen tw-h-screen tw-justify-center tw-items-center tw-px-4 tw-relative">
            <img src="/storage/assets/spbu.jpeg" alt="" className="tw-w-full tw-h-full tw-object-cover tw-absolute" style={{zIndex: zIndexes.base}} />
            <div className="tw-w-full tw-h-full tw-bg-black tw-bg-opacity-75 tw-absolute" style={{zIndex: zIndexes.loginBackdrop}} />
            <div 
                className="tw-px-8 tw-py-8 tw-w-full tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-bg-opacity-80"
                style={{maxWidth: '560px', zIndex: zIndexes.loginCard}}
            >

                {/* logo */}
                <div className="tw-flex tw-gap-3 tw-justify-center">
                    <img src="/images/logos/logo.svg" alt="Logo Royal SPBU" />
                </div>

                <hr className="border-gray-100 tw-my-4" />

                {/* title */}
                <p className="tw-font-light tw-text-2xl tw-text-gray-800 tw-text-center">Masuk</p>

                {
                    errorMsg && <p className="tw-mt-4 tw-text-white tw-text-center tw-bg-red-500 tw-py-1 tw-px-2 tw-rounded-md">{errorMsg}</p>
                }

                <form 
                    className={`tw-w-full tw-px-4 tw-flex tw-flex-col tw-gap-6 tw-mt-4 ${isLoading && 'tw-opacity-75'}`}
                    onSubmit={(e) => {e.preventDefault(); handleLogin()}}
                >

                    {/* username */}
                    <input 
                        className="tw-text-md tw-w-full tw-max-w-screen-sm tw-border tw-rounded-md tw-border-gray-500 tw-py-3 tw-px-4 tw-placeholder-gray-500" 
                        placeholder="Username"
                        autoComplete="username"
                        disabled={isLoading}
                        value={username}
                        onChange={(e) => {setUsername(e.target.value)}}
                    />

                    {/* password */}
                    <input
                        autoFocus
                        className="tw-text-md tw-w-full tw-max-w-screen-sm tw-border tw-rounded-md tw-border-gray-500 tw-py-3 tw-px-4 tw-placeholder-gray-500" 
                        placeholder="Password"
                        type="password"
                        autoComplete="currentPassword"
                        value={password} 
                        disabled={isLoading}
                        onChange={e => setPassword(e.target.value)}
                    />

                    {/* login button */}
                    <div className="tw-flex tw-justify-end tw-mt-2">
                        <button 
                            className="tw-bg-primary-600 tw-text-white tw-justify-self-end tw-py-2 tw-px-3 tw-rounded-md"
                            type="submit"
                            disabled={isLoading}
                        >
                            {
                                isLoading ? <span className="tw-flex tw-gap-2 tw-items-center">
                                    <Spinner /> Loading ...
                                </span>
                                : 'Masuk'
                            }
                        </button>
                    </div>
                </form>
            </div>
            <span className="tw-mt-2 tw-text-xs">&copy; 2021 Royal SPBU</span>
        </div>
    )
}
