import React, { createContext, useContext, useState, FC } from "react";
import { AuthContextState, IAuth, Roles } from "../types";

const authDefaultValues: AuthContextState = {
    auth: {
        name: '',
        username: '',
        role: Roles.ADMIN,
    },
    setAuthState: () => {}
}

export const AuthContext = createContext<AuthContextState>(authDefaultValues)
export const useAuth = () => useContext(AuthContext)

const AuthProvider: FC = ({children}) => {
    const [auth, _setState] = useState<IAuth>(authDefaultValues.auth)
    
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