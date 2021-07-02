import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'


import { useAuth } from '../../../providers/AuthProvider'
import {IPermission, ProductObject} from '../../../types'


interface ServerResponse {
    id: number,
    name: string,
}

//TODO: desain halaman ini

export default function Permissions() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()

    const {configs, setConfig} = useAdminConfig()

    const [permissions, setPermissions] = useState<ServerResponse[]>([])
    const [isLoading, setLoading] = useState(true)
    const {axios} = useAuth()

    const requestAllPermissions = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/permission/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setPermissions(data.map(permission => ({
                id: permission.id,
                name: permission.name,
            })))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        requestAllPermissions()
    },[])

    const handleEditPermission = (permission: IPermission) => {
        setConfig({editPermissionObject: permission})
        history.push('/permissions/edit')
    }

    const handleDeletePermission = (permission: IPermission) => {
        //TODO: Tambah konfirmasi dengan password
        setLoading(true)
        axios({method:'post', url: '/admin/permission/delete', data: {id: permission.id, /*password: */}})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data); //todo: delete console
            enqueueSnackbar(`Permission ${permission.name} berhasil dihapus`,{variant: 'warning'})
            requestAllPermissions()
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
                    case 403: {
                        errorMessage = error.response.data.message
                    } break;
                }
            }
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    return (
        <div className="tw-flex tw-flex-col">
            <button className="tw-border tw-border-black tw-py-2" onClick={() => history.push('/permissions/tambah')}>Tambah Permission</button>
            {
                isLoading ? <span>Loading...</span>
                : permissions.length > 0 ? permissions.map(permission => (
                    <div key={permission.id} className="tw-w-full tw-border tw-border-black tw-rounded-lg tw-p-4 tw-flex tw-flex-col">
                        <p>Nama Permission : {permission.name}</p>
                        <div className="tw-flex tw-justify-around">
                            <span onClick={() => handleEditPermission(permission)}>Edit</span>
                            <span onClick={() => handleDeletePermission(permission)}>Delete</span>
                        </div>
                    </div>
                ))
                : <span>Belum ada permission</span>
            }
        </div>
    )
}
