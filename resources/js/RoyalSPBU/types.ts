import React, { ReactElement } from "react"
import { AxiosInstance } from "axios"

import User from "./models/User"
import Pump from "./models/Pump"
import DailyPumpReport from "./models/DailyPumpReport"
import TotalizatorReport from "./models/TotalizatorReport"

import { IPersediaanReport } from "./interfaces/reports/PersediaanReport"

export enum Roles {
    OPERATOR = 'operator',
    SUPERVISOR = 'supervisor',
    DEVELOPER = 'developer',
    ADMIN = 'admin',
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

export interface PumpReportObject{
    createdAt : string,
    editable: boolean,
    id: number,
    income: number,
    nozzles: {
        price: number,
        productName: string,
        reportFilename: string,
        totalizatorFinal: number,
        totalizatorInitial: number,
    }[],
    pumpId: number,
    pumpNumber: number,
    reporter: string,
}

export interface RequestPenerimaanObejct{
    tankId: number,
    volume: number
    id: number,
}

export interface KonfirmasiPenerimaanObject{
    tankId: number,
    pnbpVolume: number
    id: number,
    issueTimestamp: string,
    issuer: string,
    tankName: string,
}

export interface DetailPenerimaanObject{
    actualVolume : number,
    id: number,
    initialVolume : number,
    issueTimestamp: string,
    issuer: string,
    pnbp: string,
    pnbpVolume: number,
    receiveTimestamp: string,
    receiver: string,
    tankId: number,
    tankName: string,
    truckId: string
}

export interface EditLaporanTotalisatorObject{
    date: Date | null,
    pengeluaran: {
        id: number,
        reportFilename: string|null,
        name: string,
        amount: number,
    }[],
    tabungan: null|{
        amount: number,
        report_filename: string,
    },
}

export interface IConfig {
}

export interface IAdminConfig {
    editUserObject : User
    editPumpObject : Pump
    editPermissionObject : IPermission
    editRoleObejct : RoleObject
    pumpReportObejct : DailyPumpReport
    editRequestPenerimaanObject : RequestPenerimaanObejct
    konfirmasiPenerimaanObject : KonfirmasiPenerimaanObject
    detailPenerimaanObject : DetailPenerimaanObject
    editLaporanTotalisatorObject : TotalizatorReport
    createLaporanTotalisatorDate : Date
    persediaanReportDate : Date
    persediaanReport : IPersediaanReport
}

export interface IAuth {
    name?       : string
    username?   : string
    role?       : Roles | undefined
    token?      : string
}

export interface IRoute {
    path : string,
    isNotExact?: boolean,
    component: React.FC
}

export type ConfigContextState = {
    configs: IConfig
    setConfig: (newConfig: IConfig) => void
}

export type AuthContextState = {
    auth: IAuth
    axios: AxiosInstance
    setAuthState: (newState: IAuth) => void
}