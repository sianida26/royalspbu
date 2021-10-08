import React, { createContext, useContext, useState, FC } from "react";
// import { ConfigContextState, IConfig } from "../types";

export enum ReportStatus {
    NO_DATA,
    BELUM_LAPORAN,
    SUDAH_LAPORAN,
}

interface ConfigContextState {
    configs: IConfig,
    setConfig: (newConfig: Partial<IConfig>) => void
}

interface IConfig {
    laporanStatus: ReportStatus,
    presenceStatus: ReportStatus,
}

const contextDefaultValues: ConfigContextState = {
    configs: {
        laporanStatus: ReportStatus.NO_DATA,
        presenceStatus: ReportStatus.NO_DATA,
    },
    setConfig: () => {}
}

export const ConfigContext = createContext<ConfigContextState>(contextDefaultValues)
export const useConfig = () => useContext(ConfigContext)

const ConfigProvider: FC = ({children}) => {
    const [configs, _setConfig] = useState<IConfig>(contextDefaultValues.configs)
    
    const setConfig = (newConfig: Partial<IConfig>) => _setConfig(config => {
        return {
            ...config,
            ...newConfig,
        }
    })

    return (
        <ConfigContext.Provider 
        value={{
            configs,
            setConfig
        }}>
            {children}
        </ConfigContext.Provider>
    )
}

export default ConfigProvider