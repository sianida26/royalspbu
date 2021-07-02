import React, {useState, useEffect} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
import { useAdminConfig, editPermissionDefaultObject, editRoleDefaultObject } from '../../../providers/AdminConfigProvider'

import { useAuth } from '../../../providers/AuthProvider'
import { IPermission, RoleObject } from '../../../types'
import { uniqueArray } from '../../../utils/helper'

interface FormObject{
    id: number,
    name: string,
    permissions: number[]
}

interface ServerResponse {
    id: number,
    name: string,
}

export default function FormRole() {

    let isEdit = location.pathname.split('/').pop()?.toLowerCase() === "edit"
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {configs, setConfig} = useAdminConfig()
    const [isLoading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormObject>(editRoleDefaultObject)
    const [permissions, setPermissions] = useState<IPermission[]>([])
    const {axios} = useAuth()

    useEffect(() => {
        requestAllPermissions()
        //validating data if in edit mode
        if (isEdit){
            //redirect to home if no data provided in context API
            if (configs.editRoleObejct!.id < 0){
                history.replace('/');
                return
            }

            setFormData({
                id: configs.editRoleObejct!.id,
                name: configs.editRoleObejct!.name,
                permissions: configs.editRoleObejct!.permissions.map(x => x.id)
            })

            setConfig({editRoleObejct: editRoleDefaultObject}) //hapus objek edit
        }
    }, [])

    const handleFormChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePermissionChange = (id: number, isChecked: boolean) => {
        if (isChecked) {
            setFormData(prev => ({
                ...prev,
                permissions: uniqueArray([...prev.permissions, id])
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                permissions: uniqueArray(prev.permissions.filter(x => x != id))
            }))
        }
    }

    const handleSave = () => {
        axios({method:'post', url: isEdit?  '/admin/role/edit' :'/admin/role/add', data: formData})
        .then(result => { //handle success response
            // setFormErrors({}) todo: set form errors
            let data = result.data;
            enqueueSnackbar(`Role berhasil di${isEdit? 'edit' : 'tambahkan'}`,{variant: 'success'})
            history.push('/roles');
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                //Error caused from the server
                console.log(error.response);
                let errorCode = error.response.status
                switch(errorCode){
                    case 422: {
                        //todo: add form errors
                        // setFormErrors(error.response.data.errors)
                    } break;
                }
            }
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
    }

    const requestAllPermissions = () => {
        setLoading(true)
        axios({method:'get', url: '/permission/getAll'})
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

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            <p>Nama Role</p>
            <input className="tw-border tw-border-black tw-rounded-lg tw-p-2" value={formData.name} onChange={(e) => handleFormChange("name", e.target.value)} />
            <p className="tw-font-semibold">Permissions</p>
            {
                isLoading ? <div>Loading Permission...</div>
                : permissions.length > 0 ? <div className="tw-flex tw-flex-col tw-gap-1">
                    {
                        permissions.map(permission => <div>
                            <input type="checkbox" value={permission.id} id={`permission-${permission.id}`} checked={formData.permissions.includes(permission.id)} onChange={(e) => handlePermissionChange(permission.id, e.target.checked)} />
                            <label htmlFor={`permission-${permission.id}`}>{permission.name}</label>
                        </div>)
                    }
                </div>
                : <div>Tidak ada permission</div>
            }
            <div className="tw-border tw-border-black tw-bg-green-300" onClick={handleSave}>Simpan</div>
        </div>
    )
}
