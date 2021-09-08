import React, {useEffect, useState} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'

import User from '../../../models/User'
import { useAdminConfig, editUserDefaultObject } from '../../../providers/AdminConfigProvider'

import {useAuth} from '../../../providers/AuthProvider'

interface FormObject {
    id: number,
    username: string,
    name: string,
    password: string,
    roleId: number,
    isActive: boolean,
}

interface FormErrors {
    username?: string,
    name?: string,
    password?: string,
    isActive?: string,
}

interface Props {
    type: 'add' | 'edit'
}

interface RoleObject {
    id: number,
    name: string,
}


//TODO: ubah jadi password default. bukan input
//TODO: hapus console
export default function FormUser(props: Props) {

    const isEdit = props.type === "edit"

    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {configs, setConfig} = useAdminConfig()

    const [isLoading, setLoading] = useState(false)
    const [roles, setRoles] = useState<RoleObject[]>([])
    const [formData, setFormData] = useState<FormObject>({
        id: -1,
        username: '',
        name: '',
        roleId: -1,
        password: '',
        isActive: true,
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const {axios} = useAuth()

    useEffect(() => {
        //validating user data if edit mode
        requestAllRoles()
        if (props.type === "edit"){
            //redirect to home if no user data provided in context API
            if (configs.editUserObject!.id < 0){
                history.replace('/');
                return
            }

            setFormData({
                ...configs.editUserObject!,
                password: '',
            })

            setConfig({editUserObject: new User()}) //hapus objek edit user
        }
    }, [])

    const handleFormChange = (name: string, value: string|boolean) => {
        setFormData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleFormSubmit = () => {
        axios({method:'post', url: isEdit?  '/admin/user/edit' :'/admin/user/add', data: formData})
        .then(result => { //handle success response
            setFormErrors({})
            let data = result.data;
            console.log(data);
            enqueueSnackbar(`User ${configs?.editUserObject?.username || data.username} berhasil di${isEdit? 'edit' : 'tambahkan'}`,{variant: 'success'})
            history.push('/user');
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                //Error caused from the server
                console.log(error.response);
                let errorCode = error.response.status
                switch(errorCode){
                    case 422: {
                        setFormErrors(error.response.data.errors)
                    } break;
                }
            }
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        });
    }

    const requestAllRoles = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/user/getAllRoles'})
        .then(result => { //handle success response
            let data : RoleObject[] = result.data;
            setRoles(data.map(role => ({
                id: role.id,
                name: role.name,
            })))
            if (!isEdit){
                setFormData(prev => ({
                    ...prev,
                    roleId: data[0].id
                }))
            }
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    return (
        <div className="tw-flex tw-flex-col tw-gap-4">
            <h1>Tambah User</h1>
            <div>
                <p>Username</p>
                <input name="username" value={formData.username} className={`${formErrors.username ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("username",e.target.value)} />
                <p className="tw-text-sm tw-text-red-500">{formErrors.username}</p>
            </div>
            <div>
                <p>Name</p>
                <input name="name" value={formData.name} className={`${formErrors.name ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("name",e.target.value)} />
                <p className="tw-text-sm tw-text-red-500">{formErrors.name}</p>
            </div>
            <div>
                <p>Role</p>
                <select value={formData.roleId} onChange={(e) => handleFormChange('roleId',e.target.value)}>
                    {
                        roles.map(role => <option value={role.id}>{role.name}</option>)
                    }
                </select>
            </div>
            <div>
                <p>Password</p>
                <input name="password" value={formData.password} className={`${formErrors.password ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("password",e.target.value)} />
                <p className="tw-text-sm tw-text-red-500">{formErrors.password}</p>
            </div>
            <div className="">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => handleFormChange("isActive", e.target.checked)} className="tw-border tw-border-black" id="input-isactive" name="input-isactive" />
                <label htmlFor="input-isactive">Aktif?</label>
            </div>
            <button className="tw-border tw-border-black" onClick={handleFormSubmit}>Tambah</button>
        </div>
    )
}
