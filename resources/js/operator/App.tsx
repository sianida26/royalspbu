import React, {lazy, Suspense} from 'react'

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom'

export default function App() {

    const Login = lazy(() => import('./pages/Login'))

    return (
        <Router>
            <Switch>
                <Suspense fallback={<div>Loading...</div>}>
                    <Route path="/login">
                        <Login />
                    </Route>
                </Suspense>
            </Switch>
        </Router>
    )
}
