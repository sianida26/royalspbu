import React from 'react'
import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'
import { Roles } from '../types'
import routes from '../routes/guest'
import NotFound from '../pages/NotFound'

export default function GuestRoutes() {

    const {auth} = useAuth()

    return auth.role !== undefined ? <Redirect to={{pathname: "/", state: {from: location}}} /> : (
        <Switch>
            {routes.map((route, i) => <Route key={i} path={route.path} exact={!route.isNotExact} component={route.component} />)}
            <Redirect path="/" to="/login" exact />
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}
