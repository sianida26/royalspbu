import React from 'react'

import { useSnackbar } from 'notistack'

import {
    Button,
    FormControl,
    IconButton,
    Input, 
    InputAdornment,
    InputLabel,
} from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

import {
    Cancel as CancelIcon,
    VerifiedUser as VeriviedUserIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons'

import { useAuth } from '../../../providers/AuthProvider'
import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import zIndexes from '../../../constants/zIndexes'

const GreenButton = withStyles({
    root: {
        backgroundColor: '#10B981', //emerald-500
        color: '#FFFFFF',
        '&:focus': {
            backgroundColor: '#10B981', //emerald-500
        },
    }
})(Button)

export default function Profile() {

    //todo improve responsive design
    const { auth, axios } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const [showModal, setShowModal] = React.useState(false)
    const [oldPassword, setOldPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev)
    }

    const handleChangePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        axios({method:'post', url: '/submitNewPassword'})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data) //todo remove log
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.request){
                //Request was made but no response was received
            } else if (error.response){
                //Error caused from the server
                console.log(error.response) //todo remove log
                let errorCode = error.response.status
                switch(errorCode){
                    case 400: /*bad request*/ break; 
                    case 401: /*Unauthorized*/ break;
                    case 403: /*Forbidden*/ break;
                    case 404: /*not found*/ break; 
                    case 405: /*method not allowed*/ break; 
                    case 408: /*Request timed out*/ break;
                    case 409: /*Conflict*/ break;
                    case 419: /*Page expired, CSRF token missing*/ break;
                    case 422: /*Validation failed*/ break;
                    case 429: /*Too Many Request */ break;
                    case (Math.floor(errorCode/100) === 5): //server error
                        errorMessage=`Ups. Terjadi error di dalam server. silakan coba lagi nanti (${errorCode})`;
                        break; 
                    default: /* Other errors */
                        errorMessage=`Ups. terjadi error (${errorCode})`;
                }
            } else {
                //Something happened in setting up the request that triggered an Error
            }
            //you can show error notification here
            if (errorMessage) enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => {
            //
        })
    }


    return (
        <div className="tw-w-screen">
            <AdminHeaderSidebar title="Profil" />
            <div className="tw-grid tw-grid-cols-5 tw-gap-4 tw-mt-10 tw-w-full tw-px-5 tw-items-center tw-justify-center">
                <div className="tw-col-span-2">Nama</div>
                <div className="tw-col-span-3 tw-text-gray-700 tw-border-b tw-border-gray-500 tw-py-2">{auth.name}</div>
                <div className="tw-col-span-2">Username</div>
                <div className="tw-col-span-3 tw-text-gray-700 tw-border-b tw-border-gray-500 tw-py-2">{auth.username}</div>
            </div>
            <div className="tw-grid tw-grid-row-2 tw-gap-10 tw-mt-24 tw-items-center tw-justify-center">
                <button onClick={() => setShowModal(true)} className="tw-font-semibold tw-text-center tw-text-white tw-py-2 tw-px-8 tw-bg-green-500 tw-rounded-3xl focus:tw-outline-none tw-box">Ganti Password</button>
                <button className="tw-font-semibold tw-text-center tw-text-white tw-py-2 tw-px-8 tw-bg-primary-500 tw-rounded-3xl focus:tw-outline-none tw-box">Logout</button>
            </div> 

            {/* modal */}
            <div className={`tw-fixed tw-w-screen tw-h-screen tw-bg-black tw-bg-opacity-75 ${showModal ? 'tw-grid' : 'tw-hidden'} tw-place-items-center tw-top-0 tw-px-8`} style={{zIndex: zIndexes.modalBackdrop}}>
                <form 
                    onSubmit={handleChangePasswordSubmit}
                    className="tw-p-4 tw-bg-white tw-rounded-lg tw-max-w-screen-sm tw-w-full tw-flex tw-flex-col tw-items-center"
                >
                    {/* modal header */}
                    <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-gray-800">
                        <i className="bi bi-shield-lock-fill tw-text-2xl" />
                        <h1 className="tw-font-medium tw-text-xl">Ganti Password</h1>
                    </div>

                    {/* modal content */}
                    <div className="tw-w-full tw-flex tw-my-4 tw-flex-col tw-gap-4">
                        {/* old password */}
                        <FormControl>
                            <InputLabel htmlFor="old-password">Password Lama</InputLabel>
                            <Input
                                id="old-password"
                                fullWidth
                                value={oldPassword}
                                autoComplete="current-password"
                                onChange={(e) => setOldPassword(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword}>
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        {/* new password */}
                        <FormControl>
                            <InputLabel htmlFor="new-password">Password Baru</InputLabel>
                            <Input
                                id="new-password"
                                fullWidth
                                value={newPassword}
                                autoComplete="new-password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword}>
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </div>

                    {/* modal footer */}
                    <div className="tw-w-full tw-flex tw-justify-around tw-mt-4">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setShowModal(false)}
                            startIcon={<CancelIcon />}
                        >
                            Batal
                        </Button>

                        <GreenButton
                            variant="contained"
                            type="submit"
                            startIcon={<VeriviedUserIcon />}
                        >
                            Simpan
                        </GreenButton>
                    </div>
                </form>
            </div>
        </div>
    )
}
