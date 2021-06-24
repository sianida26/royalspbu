import React, { createContext, useContext, useState, FC } from "react";
import { ConfigContextState, IConfig } from "../types";

const contextDefaultValues: ConfigContextState = {
    configs: {},
    setConfig: () => {}
}

export const ConfigContext = createContext<ConfigContextState>(contextDefaultValues)
export const useConfig = () => useContext(ConfigContext)

const ConfigProvider: FC = ({children}) => {
    const [configs, _setConfig] = useState<IConfig>(contextDefaultValues.configs)
    
    const setConfig = (newConfig: IConfig) => _setConfig(config => {
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