import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { Roles } from '../../types'

import axios from 'axios'

import DB from '../../utils/DB'

interface ServerResponse {
    username: string,
    name: string,
    role: string,
    token: string,
}

export default function Login() {

    const {auth, setAuthState} = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    let history = useHistory()

    const handleLogin = () => {
        axios({
            method: 'post', 
            data:{username, password}, 
            url: '/api/login',
        })
        .then(result => {
            console.log(result) //todo remove console
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
        })
        .catch(error => {
            console.error('error!')
            console.log(error.response)
        })
        history.replace('/')
    }

    return (
        <div className="tw-flex tw-flex-col">
            <span className="tw-border tw-border-black">Username</span>
            <input onChange={(e) => {setUsername(e.target.value)}} value={username} />
            <span>Password</span>
            <input type="password" className="tw-border tw-border-black" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="" onClick={handleLogin}>Masuk</button>
        </div>
    )
}
