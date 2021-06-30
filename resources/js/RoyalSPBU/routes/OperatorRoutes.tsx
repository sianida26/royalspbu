import React from 'react'

import PrivateRoute from '../components/PrivateRoute'

import Home from '../pages/operatorPages/Home'
import Absen from '../pages/operatorPages/Absen'
import Laporan from '../pages/operatorPages/Laporan'

export default function Operator() {
    return (
        <>
            <PrivateRoute path="/" exact><Home /></PrivateRoute>
            <PrivateRoute path="/absen"><Absen /></PrivateRoute>
            <PrivateRoute path="/laporan"><Laporan /></PrivateRoute>
        </>
    )
}
