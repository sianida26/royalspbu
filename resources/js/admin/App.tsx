import React, {lazy, Suspense} from 'react'

import {
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import GuestRoute from './components/GuestRoute'

export default function App() {

    return (
        <Router>
            <Switch>
                
            </Switch>
        </Router>
    )
}
