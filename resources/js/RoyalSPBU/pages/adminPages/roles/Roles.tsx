import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'


import { useAuth } from '../../../providers/AuthProvider'
import {IPermission, RoleObject} from '../../../types'


interface ServerResponse {
    id: number,
    name: string,
    permissions: IPermission[]
}

//TODO: desain halaman ini

export default function Roles() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()

    const {configs, setConfig} = useAdminConfig()

    const [roles, setRoles] = useState<ServerResponse[]>([])
    const [isLoading, setLoading] = useState(true)
    const {axios} = useAuth()

    const requestAllRoles = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/role/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setRoles(data.map(role => ({
                id: role.id,
                name: role.name,
                permissions: role.permissions
            })))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        requestAllRoles()
    },[])

    const handleEditRole = (role: RoleObject) => {
        setConfig({editRoleObejct: role})
        history.push('/roles/edit')
    }

    const handleDeleteRole = (role: RoleObject) => {
        //TODO: Tambah konfirmasi dengan password
        setLoading(true)
        axios({method:'post', url: '/admin/role/delete', data: {id: role.id, /*password: */}})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data); //todo: delete console
            enqueueSnackbar(`Role ${role.name} berhasil dihapus`,{variant: 'warning'})
            requestAllRoles()
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
            <button className="tw-border tw-border-black tw-py-2" onClick={() => history.push('/roles/tambah')}>Tambah Role</button>
            {
                isLoading ? <span>Loading...</span>
                : roles.length > 0 ? roles.map(role => (
                    <div key={role.id} className="tw-w-full tw-border tw-border-black tw-rounded-lg tw-p-4 tw-flex tw-flex-col">
                        <p>Nama Role : {role.name}</p>
                        <p>Jumlah permissions: {role.permissions.length}</p>
                        <div className="tw-flex tw-justify-around">
                            <span onClick={() => handleEditRole(role)}>Edit</span>
                            <span onClick={() => handleDeleteRole(role)}>Hapus</span>
                        </div>
                    </div>
                )): <span>Belum ada role</span>
            }
        </div>
    )
}
