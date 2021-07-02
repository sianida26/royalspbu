import React from 'react'
import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom'

import AdminConfigProvider from '../providers/AdminConfigProvider'
import { useAuth } from '../providers/AuthProvider'
import { Roles } from '../types'
import routes from '../routes/developer'
import NotFound from '../pages/NotFound'

export default function DeveloperRoutes() {

    const {auth} = useAuth()

    return auth.role !== Roles.DEVELOPER ? <Redirect to={{pathname: "/login", state: {from: location}}} /> : (
        <AdminConfigProvider>
            <Switch>
                {routes.map((route, i) => <Route key={i} path={route.path} exact={!route.isNotExact} component={route.component} />)}
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </AdminConfigProvider>
    )
}
