import React, { createContext, useContext, useState, FC, useEffect } from "react";
import { AuthContextState, IAuth, Roles } from "../types";

import DB from "../utils/DB";

const authDefaultValues: AuthContextState = {
    auth: {
        name: '',
        username: '',
        role: undefined,
        token: '',
    },
    setAuthState: () => {}
}

export const AuthContext = createContext<AuthContextState>(authDefaultValues)
export const useAuth = () => useContext(AuthContext)

const AuthProvider: FC = ({children}) => {
    const [auth, _setState] = useState<IAuth>(authDefaultValues.auth)

    const db = new DB()
    // console.log(db.auth.get({key: 'auth_token'}))
    
    useEffect(() => {
        db.auth.bulkGet(['auth_token', 'name', 'username', 'role'])
            .then(([token, name, username, role]) => {
                setAuthState({
                    name: name?.value || '',
                    username: username?.value || '',
                    role: role?.value || undefined,
                    token: token?.value || ''
                })
            })
    },[])
    
    const setAuthState = (newState: IAuth) => _setState(state => {
        return {
            ...state,
            ...newState,
        }
    })

    return (
        <AuthContext.Provider 
        value={{
            auth,
            setAuthState
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider