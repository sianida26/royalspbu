import React, { createContext, useContext, useState, FC } from "react";
import { AdminConfigContextState, IAdminConfig } from "../types";

export const editUserDefaultObject = {
    id: -1,
    isActive: false,
    name: '',
    roleId: -1,
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

const contextDefaultValues: AdminConfigContextState = {
    configs: {
        editUserObject: editUserDefaultObject,
        editProductObject: editProductDefaultObject,
        editTankObject: editTankDefaultObject,
        editPumpObject: editPumpDefaultObject,
        editPermissionObject: editPermissionDefaultObject,
        editRoleObejct: editRoleDefaultObject,
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