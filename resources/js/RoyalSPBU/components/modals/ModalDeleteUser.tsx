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

import zIndexes from '../../constants/zIndexes'
import User from '../../models/User'
import { Spinner } from '../Spinner'
import { useAuth } from '../../providers/AuthProvider'

interface Props {
    show: boolean
    user: User
    onFinished: () => void
    onClose: () => void
}

export default function ModalDeleteUser(props: Props) {

    const { axios } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const [showPassword, setShowPassword] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [errorMsg, setErrorMsg] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (!props.show || props.user.isNotDefined()){
            props.onClose() //closes immediately
            return
        }
        
    }, [props.show])

    const handleDeleteUser = () => {
        setLoading(true)
        axios({
            method:'post', 
            url: '/admin/user/delete', 
            data: {
                id: props.user.id,
                password: password,
            }
        })
        .then(() => { //handle success response
            enqueueSnackbar(`User ${props.user.username} berhasil dihapus`,{variant: 'warning'})
            cleanModal()
            props.onFinished()
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                console.log(error.response)
                //Error caused from the server
                let errorCode = error.response.status
                switch(errorCode){
                    case 403: {
                        errorMessage = error.response.data.message
                    } break;
                    case 422: {
                        errorMessage = error.response.data.message
                    } break;
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
        setPassword('')
        setErrorMsg('')
    }

    const handleClose = () => {
        cleanModal()
        props.onClose()
    }

    const handleToggleVisibility = () => {
        setShowPassword(prev => !prev)
    }

    return (
        <div style={{zIndex: zIndexes.modalBackdrop}} className={`tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-h-screen tw-p-4 ${props.show ? 'tw-grid' : 'tw-hidden'} tw-place-items-center tw-bg-black tw-bg-opacity-75`}>
            <div className="tw-bg-white tw-rounded-lg tw-py-4 tw-px-8 tw-w-full tw-max-w-screen-sm tw-flex tw-flex-col tw-items-center">
                <i className="bi bi-person-x-fill tw-text-4xl tw-mt-4" />
                <h1 className="tw-text-center tw-font-bold tw-text-2xl">Yakin ingin menghapus {props.user.name} ?</h1>
                <p className="tw-my-4 tw-text-gray-700">
                    User yang telah dihapus <b>tidak dapat dikembalikan lagi</b>. Jika ingin menghapus untuk sementara, Anda dapat mengubah user ini menjadi tidak aktif
                </p>
                <span className="tw-font-semibold tw-self-start">Masukkan password Anda</span>
                <TextField 
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    disabled={loading}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
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

                <p className="tw-text-sm tw-font-semibold tw-text-red-500 tw-text-left tw-mt-2">{errorMsg}</p>

                {/* action buttons */}
                <div className="tw-flex tw-w-full tw-justify-between tw-mt-6">
                    <button
                        className={`tw-px-3 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg tw-shadow-md tw-font-medium ${loading && 'tw-opacity-70'}`}
                        disabled={loading}
                        onClick={handleClose}
                    >
                        <i className="bi bi-x-lg tw-mr-2" />
                        BATAL
                    </button>

                    <button
                        className={`tw-px-3 tw-py-2 tw-border tw-border-red-500 tw-text-red-500 tw-rounded-lg tw-shadow-md tw-font-medium tw-flex ${loading && 'tw-opacity-70'}`}
                        onClick={handleDeleteUser}
                        disabled={loading}
                    >
                        {
                            loading ? <svg className="tw-animate-spin tw-h-5 tw-w-5 tw-mr-2 tw-text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg> 
                            : <i className="bi bi-person-x-fill tw-mr-2" />
                        }
                        <span>
                        {
                            loading ? 'MENGHAPUS...' : "YA, SAYA YAKIN"
                        }
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
