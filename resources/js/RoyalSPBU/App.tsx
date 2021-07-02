import React, {lazy, Suspense, useState, useEffect} from 'react'

import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
} from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import GuestRoute from './components/GuestRoute'

import { Roles } from './types'
import { useAuth } from './providers/AuthProvider'

import Login from './pages/guestPages/Login'
import Splash from './pages/guestPages/Splash'

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

    const renderGuestRoutes = () => {

        return isBooting ? <Splash /> :  (
            <Switch>
                <Route path="/login" exact component={Login} />
                <Redirect to="/login" />
                {/* <Route component={NotFoundRoute} /> */}
            </Switch>
        )
    }

    const OperatorRoutes = lazy(() => import ('./routes/OperatorRoutes'))
    const AdminRoutes = lazy(() => import ('./routes/AdminRoutes'))

    // todo: desain page not found
    const NotFoundRoute = () => {
        return (
            <div>Page Not Found</div>
        )
    }

    return (
        <Router>
            {/* <Switch> */}
                <Suspense fallback={<div>Loading...</div>}>
                    {
                        auth.role === Roles.OPERATOR ? <OperatorRoutes />
                        : auth.role === Roles.ADMIN ? <AdminRoutes />
                        : renderGuestRoutes()
                    }
                </Suspense>
            {/* </Switch> */}
        </Router>
    )
}
