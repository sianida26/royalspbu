import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'

export interface Props{
    children: React.ReactNode
    [rest: string]: any;
}

export default function GuestRoute({children, ...rest}: Props) {

    const {auth} = useAuth()

    return (
        <Route
            {...rest}
            render={
                ({location}) =>
                    auth.isLoggedIn ? <Redirect to={{pathname: "/", state: {from: location}}} /> : children
            }
        />
    )
}
