import React from 'react'
import { Suspense } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
} from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import { Roles } from '../types'
import GuestRoutes from './GuestRoutes'
import Splash from '../pages/Splash'

export default function RouteSwitch() {

    // const adminRoutes = React.lazy(() => import('../routes/AdminRoutes'))
    const AdminRoutes = React.lazy(() => import('./AdminRoutes'))
    const DeveloperRoutes = React.lazy(() => import('./DeveloperRoutes'))
    const OperatorRoutes = React.lazy(() => import('./OperatorRoutes'))

    const {auth} = useAuth()

    return (
        <Router>
            <React.Suspense fallback={<Splash />}>
                {
                    // auth.role === Roles.OPERATOR ? <OperatorRoutes />
                    // : auth.role === Roles.ADMIN || auth.role === Roles.DEVELOPER ? <AdminRoutes />
                    // : renderGuestRoutes()
                    // routes.map(route => <Route path={route.path} exact={route.exact} component={route.component} />)
                    auth.role === Roles.DEVELOPER ? <DeveloperRoutes />
                    : auth.role === Roles.ADMIN ? <AdminRoutes /> 
                    : auth.role === Roles.OPERATOR ? <OperatorRoutes /> : <GuestRoutes />
                }
            </React.Suspense>
        </Router>
    )
}
