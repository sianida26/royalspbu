import React, {useEffect, useState} from 'react'

import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import ModalDeleteUser from '../../../components/modals/ModalDeleteUser'
import ModalResetPassword from '../../../components/modals/ModalResetPassword'
import User from '../../../models/User'
import useWindowSize from '../../../hooks/useWindowSize'

import { useAdminConfig } from '../../../providers/AdminConfigProvider'
import { useAuth } from '../../../providers/AuthProvider'

import {
    InputAdornment,
    TextField,
    Tooltip,
} from '@material-ui/core'

import {
    Search as SearchIcon
} from '@material-ui/icons'

import {
    Pagination
} from '@material-ui/lab'


interface ServerResponse {
    defaultPassword: string,
    users: {
        id: number,
        username: string,
        name: string,
        roleId: number,
        roleName: string,
        isActive: boolean,
    }[],
}

//TODO: Lanjutkan buat tampilan modal
//TODO: rapikan file ini
export default function Users() {

    const history = useHistory()

    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()
    const {configs, setConfig} = useAdminConfig()
    const windowSize = useWindowSize()

    const [defaultPassword, setDefaultPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [isError, setError] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [isScreenLarge, setScreenLarge] = useState(window.innerWidth >= 1200)
    const [isModalDeleteShow, setModalDeleteShow] = useState(false)
    const [isModalResetShow, setModalResetShow] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState(new User())
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        requestListUser()
    }, [])

    useEffect(() => {
        setScreenLarge(windowSize.width >= 1200) //if screen width > 1200 the show table instead of list
    }, [windowSize.width])

    useEffect(() => {
        filterUser()
    }, [search, users])
    const filterUser = () => {
        setFilteredUsers(search.length === 0 ? users : users.filter(user => {
            return user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 
                || user.roleName.toLowerCase().indexOf(search.toLowerCase()) !== -1
                || user.username.toLowerCase().indexOf(search.toLowerCase()) !== -1
                || (user.isActive ? "aktif" : "tidak aktif").indexOf(search.toLowerCase()) !== -1 //filtering include active or not active
        }))
    }

    const handleSearchChange = (str: string) => {
        setSearch(str)
    }

    const requestListUser = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/user/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse = result.data;
            setUsers(data.users.map(_user => new User({
                id: _user.id,
                isActive: _user.isActive,
                name: _user.name,
                roleId: _user.roleId,
                roleName: _user.roleName,
                username: _user.username,
            })))
            setDefaultPassword(data.defaultPassword)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
                //Error caused from the server
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
                        errorMessage=`Terjadi error di dalam server. silakan coba lagi nanti (${errorCode}) msg:${error.message}`;
                        break; 
                    default: /* Other errors */
                        errorMessage=`Terjadi error (${errorCode}).`;
                }
            } else if (error.request){
                //Request was made but no response was received
            } else {
                //Something happened in setting up the request that triggered an Error
            }
            setError(true)
            setUsers([])
            setErrorMsg(errorMessage)
        })
        .finally(() => {
            setLoading(false)
        });
    }

    const renderUserSkeleton = () => <div className="tw-w-full tw-bg-white tw-shadow-md tw-border tw-border-gray-300 tw-rounded-lg tw-p-4 tw-flex tw-flex-col tw-animate-pulse">
        <div className="tw-flex tw-items-center tw-gap-4">
            <span className="tw-h-7 tw-w-7 tw-rounded-full tw-bg-gray-400" />
            <span className="tw-h-5 tw-rounded tw-w-24 tw-bg-gray-400" />
        </div>
        <div className="tw-pr-4 tw-pl-12">
            <table className="tw-mt-2 tw-text-left">
                <tr>
                    <th className="tw-w-24">
                        <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block">&nbsp;</span>
                    </th>
                    <td>
                        <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block">&nbsp;</span>
                    </td>
                </tr>
                <tr>
                    <th className="tw-w-24">
                        <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block" />
                    </th>
                    <td className="tw-flex tw-gap-2 tw-items-center">
                        <span className={`tw-w-3 tw-h-3 tw-bg-gray-400 tw-rounded-full`} />
                        <span className="tw-h-4 tw-w-10 tw-bg-gray-400 tw-rounded" />
                    </td>
                </tr>
                <tr>
                    <th className="tw-w-24">
                        <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block" />
                    </th>
                    <td>
                        <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block" />
                    </td>
                </tr>
            </table>
            <div className="tw-flex tw-gap-2 tw-mt-4">
                {/* edit */}
                <span className="tw-rounded-full tw-h-8 tw-w-8 tw-bg-gray-400" />

                {/* reset password */}
                <span className="tw-flex-grow tw-h-8 tw-rounded-full tw-bg-gray-400" />

                {/* delete */}
                <span className="tw-rounded-full tw-h-8 tw-w-8 tw-bg-gray-400" />
            </div>
        </div>
    </div>

    //TODO: move this function to modal
    const handleEditUser = (x: User) => {
        setConfig({
            editUserObject: x
        })
        history.push('/user/edituser');
    }

    const handleClickDeleteUser = (user: User) => {
        if (user.isNotDefined()) return
        setSelectedUser(user)
        setModalDeleteShow(true)
    }

    const handleCloseModal = () => {
        setModalDeleteShow(false)
        setModalResetShow(false)
    }

    const handleFinishDelete = () => {
        setModalDeleteShow(false)
        requestListUser()
    }

    const handleFinishResetPassword = () => {
        setModalResetShow(false)
        requestListUser()
    }

    const handleClickResetPassword = (user: User) => {
        if (user.isNotDefined()) return
        setSelectedUser(user)
        setModalResetShow(true)
    }

    const renderDataOnLargeScreen = () => (
        <div className="tw-w-full tw-max-h-full tw-pb-2 tw-rounded-lg tw-shadow-lg tw-bg-white tw-border tw-border-gray-300">

            {/* search */}
            <div className="tw-w-full tw-mt-4 tw-px-2 tw-flex tw-justify-between">
                <div className="tw-w-full tw-max-w-sm">

                    <TextField 
                        fullWidth
                        placeholder="Cari"
                        type="search"
                        onChange={(e) => handleSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }}
                    />
                </div>

                <div>
                    {/* <Pagination count={10} color="primary" /> */}
                </div>
            </div>

            <table className="tw-w-full tw-mt-2">
                <thead>
                    <tr>
                        <th className={`tw-text-center tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-w-12`}>#</th>
                        <th className={`tw-text-left tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-px-2`}>Nama</th>
                        <th className={`tw-text-left tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-px-2 tw-w-72`}>Username</th>
                        <th className={`tw-text-left tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-px-2 tw-w-56`}>Status</th>
                        <th className={`tw-text-left tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-w-40 tw-px-2`}>Role</th>
                        <th className={`tw-text-center tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-w-32`}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredUsers.map((user, i) => <tr key={i} className="tw-border-b tw-border-gray-400">
                            <td className="tw-text-center tw-align-top tw-py-2">{i+1}</td>
                            <td className="tw-px-2 tw-align-top tw-py-2">{user.name}</td>
                            <td className="tw-px-2 tw-align-top tw-py-2">{user.username}</td>
                            <td className="tw-px-2 tw-align-top tw-py-2">
                                <span className="tw-flex tw-justify-left tw-gap-2 tw-items-center">
                                    <span className={`tw-w-3 tw-h-3 ${user.isActive ? 'tw-bg-green-500' : 'tw-bg-red-500'} tw-rounded-full`} />
                                    <span>{user.isActive ? 'Aktif' : 'Tidak Aktif'}</span>
                                </span>
                            </td>
                            <td className="tw-px-2 tw-align-top tw-py-2">{user.roleName}</td>
                            <td className="tw-flex tw-items-center tw-gap-2 tw-px-2 tw-py-1 tw-align-top">

                                {/* reset password */}
                                <Tooltip title="Reset password">
                                    <span 
                                        className="tw-rounded-full tw-h-8 tw-w-8 tw-grid tw-place-items-center tw-border tw-border-green-500 tw-bg-white"
                                        onClick={() => handleClickResetPassword(user)}
                                    >
                                        <i className="tw-text-green-500 bi-recycle" />
                                    </span>
                                </Tooltip>

                                {/* edit */}
                                <Tooltip title="Edit User">
                                    <span 
                                        className="tw-rounded-full tw-h-8 tw-w-8 tw-grid tw-place-items-center tw-border tw-border-orange-500 tw-bg-white"
                                        // onClick={() => handleEditUser(user)}
                                    >
                                        <i className="tw-text-orange-500 bi-pencil" />
                                    </span>
                                </Tooltip>

                                {/* delete */}
                                <Tooltip title="Delete User">
                                    <span 
                                        className="tw-rounded-full tw-h-8 tw-w-8 tw-grid tw-place-items-center tw-border tw-border-red-500 tw-bg-white"
                                        onClick={() => handleClickDeleteUser(user)}
                                    >
                                        <i className="tw-text-red-500 bi-trash" />
                                    </span>
                                </Tooltip>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    const renderDataOnSmallScreen = () => (
        filteredUsers.map(user => (
            <div key={user.id} className="tw-w-full tw-bg-white tw-shadow-md tw-border tw-border-gray-300 tw-rounded-lg tw-p-4 tw-flex tw-flex-col">
                <div className="tw-flex tw-items-center tw-gap-4">
                    <i className={`bi-person-circle tw-text-3xl ${user.isActive ? 'tw-text-green-500' : 'tw-text-red-500'}`} />
                    <span className="tw-font-semibold tw-text-xl">{user.name}</span>
                </div>
                <div className="tw-pr-4 tw-pl-12">
                    <table className="tw-mt-2 tw-text-left">
                        <tr>
                            <th className="tw-w-24">Username</th>
                            <td>{user.username}</td>
                        </tr>
                        <tr>
                            <th className="tw-w-24">Status</th>
                            <td className="tw-flex tw-gap-2 tw-items-center">
                                <span className={`tw-w-3 tw-h-3 ${user.isActive ? 'tw-bg-green-500' : 'tw-bg-red-500'} tw-rounded-full`} />
                                <span>{user.isActive ? 'Aktif' : 'Tidak Aktif'}</span>
                            </td>
                        </tr>
                        <tr>
                            <th className="tw-w-24">Role</th>
                            <td>{user.roleName}</td>
                        </tr>
                    </table>

                    {/* action button */}
                    <div className="tw-flex tw-gap-2 tw-mt-4">
                            {/* edit */}
                            <span 
                                className="tw-rounded-full tw-h-8 tw-w-8 tw-grid tw-place-items-center tw-border tw-border-orange-500 tw-bg-white"
                                onClick={() => handleEditUser(user)}
                            >
                                <i className="tw-text-orange-500 bi-pencil" />
                            </span>

                            {/* reset password */}
                            <span 
                                className="tw-flex-grow tw-h-8 tw-rounded-full tw-border tw-bg-green-500 tw-grid tw-place-items-center tw-text-white tw-font-light tw-text-sm"
                                onClick={() => handleClickResetPassword(user)}
                            >
                                Reset password
                            </span>

                            {/* delete */}
                            <span 
                                className="tw-rounded-full tw-h-8 tw-w-8 tw-grid tw-place-items-center tw-border tw-border-red-500 tw-bg-white"
                                onClick={() => handleClickDeleteUser(user)}
                            >
                                <i className="tw-text-red-500 bi-trash" />
                            </span>
                    </div>
                </div>
            </div>
        ))
    )

    const renderLoadingOnLargeScreen = () => {
        return <div className="tw-w-full tw-pb-2 tw-max-h-full tw-rounded-lg tw-shadow-lg tw-bg-white tw-border tw-border-gray-300">
            <table className="tw-w-full tw-mt-2">
                <thead>
                    <tr>
                        <th className={`tw-text-center tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-w-12`}>#</th>
                        <th className={`tw-text-left tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-px-2`}>Nama</th>
                        <th className={`tw-text-left tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-px-2 tw-w-72`}>Username</th>
                        <th className={`tw-text-left tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-px-2 tw-w-56`}>Status</th>
                        <th className={`tw-text-left tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-w-40 tw-px-2`}>Role</th>
                        <th className={`tw-text-center tw-bg-gray-200 tw-text-gray-700 tw-py-2 tw-w-32`}>Aksi</th>
                    </tr>
                </thead>
                <tbody className="tw-animate-pulse">
                    {
                        [1,2,3,4,5].map((i) => <tr key={i} className="tw-border-b tw-border-gray-400">
                            <td className="tw-text-center tw-align-top tw-py-2"> {/* sequnece */}
                                <span className="tw-h-4 tw-w-6 tw-bg-gray-400 tw-rounded tw-inline-block">&nbsp;</span>
                            </td>
                            <td className="tw-px-2 tw-align-top tw-py-2"> {/* name */}
                                <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block">&nbsp;</span>
                            </td>
                            <td className="tw-px-2 tw-align-top tw-py-2"> {/* username */}
                                <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block">&nbsp;</span>
                            </td>
                            <td className="tw-px-2 tw-align-top tw-py-2"> {/* status */}
                                <span className="tw-flex tw-justify-left tw-gap-2 tw-items-center">
                                    <span className={`tw-w-3 tw-h-3 tw-bg-gray-400 tw-rounded-full`} />
                                    <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block">&nbsp;</span>
                                </span>
                            </td>
                            <td className="tw-px-2 tw-align-top tw-py-2"> {/* role */}
                                <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded tw-inline-block">&nbsp;</span>
                            </td>
                            <td className="tw-flex tw-items-center tw-gap-2 tw-px-2 tw-py-1"> {/* action */}

                                {/* reset password */}
                                <span className="tw-rounded-full tw-h-8 tw-w-8 tw-bg-gray-400" />

                                {/* edit */}
                                <span className="tw-rounded-full tw-h-8 tw-w-8 tw-bg-gray-400" />

                                {/* delete */}
                                <span className="tw-rounded-full tw-h-8 tw-w-8 tw-bg-gray-400" />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    }

    return (
        <div className="tw-w-full tw-h-screen tw-relative">
            <div className="tw-absolute tw-top-0">
                <AdminHeaderSidebar title="Daftar User" />
            </div>
            {/* <button className="tw-bg-gray-300 tw-p-3" onClick={() => history.push('/user/tambahuser')}>Tambah User</button> */}
            <div className="tw-px-4 tw-flex tw-flex-col tw-h-screen tw-pt-12">

                {/* add user */}
                <div className="tw-flex tw-w-full tw-justify-end tw-mt-4">
                    <button
                        className="tw-px-3 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg tw-shadow-md tw-font-medium"
                        onClick={() => history.push('/user/tambahuser')}
                    >
                        <i className="bi bi-person-plus tw-mr-2" />
                        Tambah User
                    </button>
                </div>

                {/* search */}
                <div className="tw-mt-4 lg:tw-hidden">
                    <div className="tw-w-full tw-max-w-sm">

                        <TextField 
                            fullWidth
                            placeholder="Cari"
                            type="search"
                            autoComplete="off"
                            onChange={(e) => handleSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            }}
                        />
                    </div>
                </div>

                {/* user list container */}
                <div className="tw-w-full tw-flex tw-flex-col tw-gap-4 tw-mt-4 tw-flex-auto tw-overflow-y-auto tw-min-h-0 tw-pb-2">
                    
                    {
                        //show skeleton when loading
                        isLoading ? 
                            isScreenLarge ? renderLoadingOnLargeScreen() : [1,2,3,4,5].map(() => renderUserSkeleton())

                        //show data when loading done and success
                        : users.length > 0 ? 
                            isScreenLarge ? renderDataOnLargeScreen() : renderDataOnSmallScreen()
                        // if error occured
                        : isError ? <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-8 tw-py-8">
                            <img src="/storage/assets/illustrations/undraw_bug_fixing_oc7a.svg" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
                            <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops! Terjadi kesalahan.</h1>
                            <span className="tw-text-center tw-text-gray-800 tw-mt-3">Terdapat error sehingga data tidak dapat ditampilkan. Silakan coba beberapa saat lagi</span>
                            <span className="tw-text-center tw-mt-2 tw-text-sm tw-text-gray-700">{errorMsg}</span>
                            <button 
                                className="tw-px-3 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg tw-shadow-md tw-flex tw-gap-2 tw-mt-2 tw-items-center"
                                onClick={() => requestListUser()}
                            >
                                <i className="bi bi-arrow-repeat tw-text-lg" />
                                Coba lagi
                            </button>
                        </div>

                        // if no user available. but this should never happened
                        : <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-8 tw-py-8">
                            <img src="/storage/assets/illustrations/undraw_Tree_swing_646s.svg" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
                            <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops!</h1>
                            <span className="tw-text-center tw-text-gray-800 tw-mt-3">Sepertinya Anda belum membuat User sama sekali. Cobalah untuk membuat 1 user</span>
                        </div>
                    }
                </div>
            </div>

            <ModalDeleteUser 
                onClose={handleCloseModal} 
                onFinished={handleFinishDelete} 
                show={isModalDeleteShow} 
                user={selectedUser} 
            />

            <ModalResetPassword 
                defaultPassword={defaultPassword}
                onClose={handleCloseModal} 
                onFinished={handleFinishResetPassword}
                show={isModalResetShow} 
                user={selectedUser} 
            />
        </div>
    )
}
