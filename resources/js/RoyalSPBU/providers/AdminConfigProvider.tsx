import React, { createContext, useContext, useState, FC } from "react";

import User from "../models/User";

import { AdminConfigContextState, IAdminConfig } from "../types";
import { persediaanReportDefaultObject } from "../constants/adminConfigDefaultValues";

export const editUserDefaultObject = {
    id: -1,
    isActive: false,
    name: '',
    roleId: -1,
    roleName: '',
    username: '',
}

export const editProductDefaultObject = {
    id: -1,
    name: '',
    price: 0,
}

export const editTankDefaultObject = {
    id: -1,
    name: '',
    product: '',
    productId: -1,
    stock: 0,
}

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
        editProductObject: editProductDefaultObject,
        editTankObject: editTankDefaultObject,
        editPumpObject: editPumpDefaultObject,
        editPermissionObject: editPermissionDefaultObject,
        editRoleObejct: editRoleDefaultObject,
        pumpReportObejct: pumpReportDefaultObejct,
        editRequestPenerimaanObject: requestPenerimaanDefaultObejct,
        konfirmasiPenerimaanObject: konfirmasiPenerimaanDefaultObejct,
        detailPenerimaanObject: detailPenerimaanDefaultObject,
        editLaporanTotalisatorObject: editTotalisatorReportDefaultObject,
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
    
    const setConfig = (newConfig: IAdminConfig) => _setConfig(config => {
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