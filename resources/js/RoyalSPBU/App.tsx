import React, {lazy, Suspense, useState, useEffect} from 'react'
import RouteSwitch from './components/RouteSwitch'

import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
} from 'react-router-dom'

// import PrivateRoute from './components/PrivateRoute'
// import GuestRoute from './components/GuestRoute'

import { Roles } from './types'
import { useAuth } from './providers/AuthProvider'

import Login from './pages/guestPages/Login'
import Splash from './pages/Splash'

import DB from './utils/DB'

export default function App() {

    const {auth, setAuthState} = useAuth()

    const db = new DB()

    const [isBooting, setBooting] = useState(true)

    useEffect(() => {
        boot()
    }, [])

    const boot = async () => {
        db.auth.bulkGet(['auth_token', 'name', 'username', 'role'])
            .then(([token, name, username, role]) => {
                setAuthState({
                    name: name?.value || '',
                    username: username?.value || '',
                    role: role?.value || undefined,
                    token: token?.value || ''
                })
                setBooting(false)
            })
    }

    return isBooting? <Splash /> : (
        <>
            <RouteSwitch />
        </>
    )
}
