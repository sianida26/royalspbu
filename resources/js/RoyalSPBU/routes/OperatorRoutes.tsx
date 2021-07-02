import React from 'react'
import AdminConfigProvider from '../providers/AdminConfigProvider'
import { withRouter, Redirect, Route, Switch } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

import { Roles } from '../types'

import Home from '../pages/operatorPages/Home'
import Absen from '../pages/operatorPages/Absen'

const AdminRoutes = () => {

    const { auth } = useAuth()

    const routes = [
        {
            path: '/',
            exact: true,
            component: Home,
        },
        {
            path: '/absen',
            exact: true,
            component: Absen
        }
    ]

    // todo: desain page not found
    const NotFoundRoute = () => {
        return (
            <div>Page Not Found</div>
        )
    }

    return auth.role !== Roles.OPERATOR ? <Redirect to={{pathname: "/login", state: {from: location}}} /> : (
        <AdminConfigProvider>
            <Switch>
                {
                    routes.map(route => <Route path={route.path} exact={route.exact} component={route.component} />)
                }
                <Redirect path="/login" to="/" />
                <Route component={NotFoundRoute} />
            </Switch>
        </AdminConfigProvider>
    )
}

export default withRouter(AdminRoutes)