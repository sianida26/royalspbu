import React from 'react'

import { useSnackbar } from 'notistack'

import {
    IconButton,
    InputAdornment,
    TextField
} from '@material-ui/core'

import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons'

import Backdrop from '../Backdrop'
import { useAuth } from '../../providers/AuthProvider'

interface Props {
    show: boolean
    onFinished: () => void
    onClose: () => void
}

interface ValidationErrorResponse {
    old: string[],
    new: string[],
}

const defaultFormErrorValues: ValidationErrorResponse = {
    old: [],
    new: [],
}

export default function ModalChangePassword(props: Props) {

    const { axios } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const [errorMsg, setErrorMsg] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [oldPassword, setOldPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [formErrors, setFormErrors] = React.useState<ValidationErrorResponse>(defaultFormErrorValues)
    const [showPassword, setShowPassword] = React.useState(false)

    React.useEffect(() => {
        if (!props.show){
            props.onClose() //closes immediately
            return
        }
        
    }, [props.show])

    const handleChangePassword = () => {
        setLoading(true)
        axios({
            method:'post', 
            url: '/changepassword', 
            data: {
                old: oldPassword,
                new: newPassword,
            }
        })
        .then((data) => { //handle success response
            enqueueSnackbar(`Password berhasil diganti`,{variant: 'success'})
            cleanModal()
            props.onFinished()
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                //Error caused from the server
                let errorCode = error.response.status
                switch(errorCode){
                    case 403: {
                        errorMessage = error.response.data.message
                    } break;
                    case 422: {
                        setFormErrors({
                            ...defaultFormErrorValues,
                            ...error.response.data.errors,
                        })
                        errorMessage = ""
                    } break;
                    case 500: {
                        errorMessage = `Terjadi error dalam sistem. (${error.response.data.message})`
                    }
                }
            }
            setErrorMsg(errorMessage)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const cleanModal = () => {
        setShowPassword(false)
        setOldPassword('')
        setNewPassword('')
        setErrorMsg('')
        setFormErrors(defaultFormErrorValues)
    }

    const handleClose = () => {
        cleanModal()
        props.onClose()
    }

    const handleToggleVisibility = () => {
        setShowPassword(prev => !prev)
    }

    return (
        <Backdrop show={props.show}>
            <div className="tw-bg-white tw-rounded-lg tw-py-4 tw-px-8 tw-w-full tw-max-w-screen-sm tw-flex tw-flex-col tw-items-center">
                <i className="bi bi-shield-lock-fill tw-text-4xl tw-mt-4" />
                <h1 className="tw-text-center tw-font-bold tw-text-2xl">Ubah Password</h1>

                <p className="tw-text-sm tw-font-semibold tw-text-red-500 tw-text-left tw-mt-2">{errorMsg}</p>

                <span className="tw-font-semibold tw-self-start tw-mt-4">Password Lama</span>
                <TextField 
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={oldPassword}
                    placeholder="Password Lama"
                    disabled={loading}
                    error={!!formErrors.old[0]}
                    helperText={formErrors.old[0]}
                    autoComplete="current-password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleToggleVisibility}
                            >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                    }}
                />

                <span className="tw-font-semibold tw-self-start tw-mt-4">Password Baru</span>
                <TextField 
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    placeholder="Password Baru"
                    disabled={loading}
                    error={!!formErrors.new[0]}
                    helperText={formErrors.new[0]}
                    autoComplete="new-password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleToggleVisibility}
                            >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                    }}
                />

                {/* action buttons */}
                <div className="tw-flex tw-w-full tw-justify-between tw-mt-6">
                    <button
                        className={`tw-px-4 tw-py-2 tw-border tw-border-red-500 tw-text-red-500 tw-rounded-lg tw-shadow-md tw-font-medium ${loading && 'tw-opacity-70'}`}
                        disabled={loading}
                        onClick={handleClose}
                    >
                        <i className="bi bi-x-lg tw-mr-2" />
                        BATAL
                    </button>

                    <button
                        className={`tw-px-4 tw-py-2 tw-border tw-bg-green-600 tw-text-white tw-rounded-lg tw-shadow-md tw-font-medium tw-flex ${loading && 'tw-opacity-70'}`}
                        onClick={handleChangePassword}
                        disabled={loading}
                    >
                        {
                            loading ? <svg className="tw-animate-spin tw-h-5 tw-w-5 tw-mr-2 tw-text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg> 
                            : <i className="bi bi-shield-fill-check tw-mr-2" />
                        }
                        <span>
                        {
                            loading ? 'PROSES...' : "GANTI"
                        }
                        </span>
                    </button>
                </div>
            </div>
        </Backdrop>
    )
}
