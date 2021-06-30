import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import { useAuth } from '../providers/AuthProvider'

import { Roles } from '../types'

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
                    auth.role  ? <Redirect to={{pathname: "/", state: {from: location}}} /> : children
            }
        />
    )
}
