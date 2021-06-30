import React, {useEffect, useState} from 'react'

import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'
import { UserObject } from '../../../types'

import axios from '../../../utils/AdminAxios'

interface ServerResponse {
    id: number,
    username: string,
    name: string,
    is_active: boolean,
}

//TODO: Hapus console
export default function Users() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const {configs, setConfig} = useAdminConfig()

    //useState Hooks
    const [users, setUsers] = useState<UserObject[]>([])
    const [isLoading, setLoading] = useState(true)

    const requestListUser = () => {
        setLoading(true)
        axios({method:'get', url: '/user/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setUsers(data.map(_user => ({
                id: _user.id,
                username: _user.username,
                name: _user.name,
                isActive: _user.is_active,
            })))
            setLoading(false)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        });
    }

    useEffect(() => {
        requestListUser()
    }, [])

    const handleEditUser = (x: UserObject) => {
        setConfig({
            editUserObject: x
        })
        history.push('/user/edituser');
    }

    const handleDeleteUser = (x: UserObject) => {
        //TODO: Tambah konfirmasi dengan password
        axios({method:'post', url: '/user/delete', data: {id: x.id, /*password: */}})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data);
            enqueueSnackbar(`User ${x.username} berhasil dihapus`,{variant: 'warning'})
            requestListUser()
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                //Error caused from the server
                console.log(error.response);
                let errorCode = error.response.status
                switch(errorCode){
                    case 401: {
                        errorMessage = "Password Salah"
                    } break;
                }
            }
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        });
    }

    const handleResetPassword = (x: UserObject) => {
        //TODO: Tambah konfirmasi dengan password
        axios({method:'post', url: '/user/resetPassword', data: {id: x.id, /*password: */}})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data);
            enqueueSnackbar(`User ${x.username} berhasil direset password`,{variant: 'success'})
            requestListUser()
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                //Error caused from the server
                console.log(error.response);
                let errorCode = error.response.status
                switch(errorCode){
                    case 401: {
                        errorMessage = "Password Salah"
                    } break;
                }
            }
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        });
    }

    return (
        <div className="tw-w-full">
            <h1 className="tw-text-3xl">Daftar User</h1>
            <button className="tw-bg-gray-300 tw-p-3" onClick={() => history.push('/user/tambahuser')}>Tambah User</button>
            <div className="tw-w-full tw-flex tw-flex-col tw-gap-4 tw-mt-4">
                {
                    isLoading ? <span>Loading...</span>
                    : users ? users.map(x => (
                        <div key={x.id} className="tw-w-full tw-border tw-border-black tw-rounded-lg tw-p-4 tw-flex tw-flex-col">
                            <p>Username : {x.username}</p>
                            <p>Name: {x.name}</p>
                            <p>Is Active: {x.isActive}</p>
                            <div className="tw-flex tw-justify-around">
                                <span onClick={() => handleEditUser(x)}>Edit</span>
                                <span onClick={() => handleDeleteUser(x)}>Delete</span>
                                <span onClick={() => handleResetPassword(x)}>Reset Password</span>
                            </div>
                        </div>
                    ))
                    : <span>User belum ditemukan</span>
                }
            </div>
        </div>
    )
}
