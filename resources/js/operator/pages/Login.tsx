import React, {useState} from 'react'

import { useAuth } from '../providers/AuthProvider'

export default function Login() {

    const {auth, setAuthState} = useAuth()
    const [username, setUsername] = useState('')

    const handleLogin = () => {
        setAuthState({
            isLoggedIn: true,
            username: username,
            name: username
        })
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
