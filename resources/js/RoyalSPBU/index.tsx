import React from 'react'
import { render } from 'react-dom'
import App from './App'

import { SnackbarProvider } from 'notistack'

import ConfigProvider from './providers/ConfigProvider'
import AuthProvider from './providers/AuthProvider'

import "react-datepicker/dist/react-datepicker.css";
import 'react-perfect-scrollbar/dist/css/styles.css';

render(
    <SnackbarProvider maxSnack={3}>
        <ConfigProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ConfigProvider>
    </SnackbarProvider>,
    document.getElementById('root')
);