import React, {lazy, Suspense} from 'react'

import {
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import GuestRoute from './components/GuestRoute'

export default function App() {

    const Login = lazy(() => import('./pages/Login'))
    const Home = lazy(() => import('./pages/Home'))
    const Absen = lazy(() => import('./pages/Absen'))
    const Laporan = lazy(() => import('./pages/Laporan'))

    return (
        <Router>
            <Switch>
                <Suspense fallback={<div>Loading...</div>}>
                    <GuestRoute path="/login"><Login /></GuestRoute>

                    <PrivateRoute path="/" exact><Home /></PrivateRoute>
                    <PrivateRoute path="/absen"><Absen /></PrivateRoute>
                    <PrivateRoute path="/laporan"><Laporan /></PrivateRoute>
                </Suspense>
            </Switch>
        </Router>
    )
}
