import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../../providers/AuthProvider'
import { Roles } from '../../types'

export default function Login() {

    const {auth, setAuthState} = useAuth()
    const [username, setUsername] = useState('')

    let history = useHistory()

    const handleLogin = () => {
        setAuthState({
            role : Roles.ADMIN,
            username: username,
            name: username
        })
        history.replace('/')
    }

    return (
        <div className="tw-flex tw-flex-col">
            <span className="tw-border tw-border-black">Username</span>
            <input onChange={(e) => {setUsername(e.target.value)}} value={username} />
            <span>Password</span>
            <input type="password" className="tw-border tw-border-black" />
            <button className="" onClick={handleLogin}>Masuk</button>
        </div>
    )
}
