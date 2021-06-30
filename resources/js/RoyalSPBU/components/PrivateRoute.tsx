import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'

export interface Props{
    children: React.ReactNode
    [rest: string]: any;
}

export default function PrivateRoute({children, ...rest}: Props) {

    const { auth } = useAuth()

    return (
        <Route
            {...rest}
            render={
                ({location}) =>
                    auth.role ? children : <Redirect to={{pathname: "/login", state: {from: location}}} />
            }
        />
    )
}
