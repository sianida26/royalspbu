import React from 'react'
import { render } from 'react-dom'
import App from './App'

import ConfigProvider from './providers/ConfigProvider'
import AuthProvider from './providers/AuthProvider'

render(
    <ConfigProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ConfigProvider>,
    document.getElementById('root')
);