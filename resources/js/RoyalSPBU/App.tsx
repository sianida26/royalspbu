import React, {lazy, Suspense} from 'react'

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

export default function App() {

    const {auth} = useAuth()

    const renderGuestRoutes = () => {

        return (
            <Switch>
                <Route path="/login" exact component={Login} />
                <Redirect from="/" to="/login" exact />
                <Route component={NotFoundRoute} />
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
