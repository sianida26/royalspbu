import React from 'react'
import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom'

import routes from '../routes/operator'
import { useAuth } from '../providers/AuthProvider'
import { Roles } from '../types'
import NotFound from '../pages/NotFound'

export default function OperatorRoutes() {

    const {auth} = useAuth()

    return auth.role !== Roles.OPERATOR ? <Redirect to={{pathname: "/login", state: {from: location}}} /> : (
        <Switch>
            {routes.map((route, i) => <Route key={i} path={route.path} exact={!route.isNotExact} component={route.component} />)}
            <Redirect path="/login" to="/" />
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}
