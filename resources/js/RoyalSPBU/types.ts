import { AxiosInstance } from "axios"

export enum Roles {
    OPERATOR = 'operator',
    SUPERVISOR = 'supervisor',
    DEVELOPER = 'developer',
    ADMIN = 'admin',
}

export interface UserObject{
    id: number,
    username: string,
    name: string,
    isActive: boolean,
    roleId: number,
}

export interface ProductObject {
    id: number,
    name: string,
    price: number,
}

export interface TankObject {
    id: number,
    name: string,
    productId: number,
    product: string,
    stock: number,
}

export interface PumpObject {
    id: number,
    nozzles: NozzleObject[]
}

export interface NozzleObject{
    id: number,
    tankId: number,
    totalizator: number,
}

export interface IPermission{
    id: number,
    name: string,
}

export interface RoleObject{
    id: number,
    name: string,
    permissions: IPermission[]
}

export interface IConfig {
}

export interface IAdminConfig {
    editUserObject? : UserObject
    editProductObject? : ProductObject
    editTankObject? : TankObject
    editPumpObject? : PumpObject
    editPermissionObject? : IPermission
    editRoleObejct? : RoleObject
}

export interface IAuth {
    name?       : string
    username?   : string
    role?       : Roles | undefined
    token?      : string
}

export type ConfigContextState = {
    configs: IConfig
    setConfig: (newConfig: IConfig) => void
}

export type AdminConfigContextState = {
    configs: IAdminConfig
    setConfig: (newConfig: IAdminConfig) => void
}

export type AuthContextState = {
    auth: IAuth
    axios: AxiosInstance
    setAuthState: (newState: IAuth) => void
}