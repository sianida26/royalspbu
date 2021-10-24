import React, { createContext, useContext, useState, FC } from "react";

import User from "../models/User";
import Pump from "../models/Pump";

import { IAdminConfig } from "../types";
import { persediaanReportDefaultObject } from "../constants/adminConfigDefaultValues";
import DailyPumpReport from "../models/DailyPumpReport";
import TotalizatorReport from '../models/TotalizatorReport'

type AdminConfigContextState = {
    configs: IAdminConfig
    setConfig: (newConfig: Partial<IAdminConfig>) => void
}

//TODO: move iadminconfig from types to here

export const editPumpDefaultObject = {
    id: -1,
    nozzles: [],
}

export const editPermissionDefaultObject = {
    id: -1,
    name: '',
}

export const editRoleDefaultObject = {
    id: -1,
    name: '',
    permissions: [],
}

export const pumpReportDefaultObejct = {
    createdAt : '',
    editable: false,
    id: -1,
    income: 0,
    nozzles: [],
    pumpId: 0,
    pumpNumber: 0,
    reporter: '',
}

export const requestPenerimaanDefaultObejct = {
    id: -1,
    tankId: -1,
    volume: 0,
}

export const konfirmasiPenerimaanDefaultObejct = {
    tankId: -1,
    pnbpVolume: 0,
    id: -1,
    issueTimestamp: '',
    issuer: '',
    tankName: '',
}

export const detailPenerimaanDefaultObject = {
    actualVolume : 0,
    id: -1,
    initialVolume : 0,
    issueTimestamp: '',
    issuer: '',
    pnbp: '',
    pnbpVolume: 0,
    receiveTimestamp: '',
    receiver: '',
    tankId: -1,
    tankName: '',
    truckId: '',
}

export const editTotalisatorReportDefaultObject = {
    date: null,
    pengeluaran: [],
    tabungan: null,
}

const contextDefaultValues: AdminConfigContextState = {
    configs: {
        editUserObject: new User(),
        editPumpObject: new Pump(),
        editPermissionObject: editPermissionDefaultObject,
        editRoleObejct: editRoleDefaultObject,
        pumpReportObejct: new DailyPumpReport(),
        editRequestPenerimaanObject: requestPenerimaanDefaultObejct,
        konfirmasiPenerimaanObject: konfirmasiPenerimaanDefaultObejct,
        detailPenerimaanObject: detailPenerimaanDefaultObject,
        editLaporanTotalisatorObject: new TotalizatorReport(),
        createLaporanTotalisatorDate: new Date(),
        persediaanReportDate: new Date(),
        persediaanReport: persediaanReportDefaultObject,
    },
    setConfig: () => {}
}

export const AdminConfigContext = createContext<AdminConfigContextState>(contextDefaultValues)
export const useAdminConfig = () => useContext(AdminConfigContext)

const AdminConfigProvider: FC = ({children}) => {
    const [configs, _setConfig] = useState<IAdminConfig>(contextDefaultValues.configs)
    
    const setConfig = (newConfig: Partial<IAdminConfig>) => _setConfig(config => {
        return {
            ...config,
            ...newConfig,
        }
    })

    return (
        <AdminConfigContext.Provider 
        value={{
            configs,
            setConfig
        }}>
            {children}
        </AdminConfigContext.Provider>
    )
}

export default AdminConfigProvider