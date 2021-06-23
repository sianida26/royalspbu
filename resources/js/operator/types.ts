export interface IConfig {
}

export interface IAuth {
    isLoggedIn? : boolean
    name?       : string
    username?   : string
}

export type ConfigContextState = {
    configs: IConfig
    setConfig: (newConfig: IConfig) => void
}

export type AuthContextState = {
    auth: IAuth
    setAuthState: (newState: IAuth) => void
}