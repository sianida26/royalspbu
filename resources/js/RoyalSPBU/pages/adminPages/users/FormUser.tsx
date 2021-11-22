import React, {useEffect, useRef, useState} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'

import {
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
} from '@material-ui/core'

import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons'

import DB from '../../../utils/DB'
import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import User from '../../../models/User'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'
import { useAuth } from '../../../providers/AuthProvider'


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


//TODO: hapus console
//TODO: tambah roles ke DB
export default function FormUser(props: Props) {

    const isEdit = props.type === "edit"

    const history = useHistory()

    const { axios } = useAuth()
    const { enqueueSnackbar } = useSnackbar()
    const { configs, setConfig } = useAdminConfig()

    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [isLoading, setLoading] = useState(false)
    const [isShowPassword, setShowPaswsord] = useState(false)
    const [roles, setRoles] = useState<RoleObject[]>([])

    const [formData, setFormData] = useState<FormObject>({
        id: -1,
        username: '',
        name: '',
        roleId: -1,
        password: '',
        isActive: true,
    })

    useEffect(() => {

        //retrive roles data from DB
        getRolesFromDB()

        //validating user data if edit mode
        requestAllRoles()
        if (props.type === "edit"){
            //redirect to home if no user data provided in context API
            if (configs.editUserObject!.isNotDefined()){
                history.replace('/');
                return
            }

            setFormData({
                ...configs.editUserObject!.toObject(),
                password: '',
            })

            setConfig({editUserObject: new User()}) //hapus objek edit user
        }
    }, [])

    const getRolesFromDB = async() => {
        const db = new DB()
        let _roles = await db.roles.toArray()
        console.log('roles from db')
        setRoles(_roles)
    }

    const handleFormChange = (name: string, value: string|boolean|number) => {
        setFormData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleFormSubmit = () => {
        setLoading(true)
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
        axios({method:'get', url: '/admin/user/getAllRoles'})
        .then(result => { //handle success response
            let data : RoleObject[] = result.data;
            setRoles(data.map(role => ({
                id: role.id,
                name: role.name,
            })))
            console.log('roles from server')
            //updating DB data
            const db = new DB()
            db.roles.clear() //clears data then renew data from server
            data.map(role => {
                db.roles.put({id: role.id, name: role.name})
            })
            if (!isEdit){
                setFormData(prev => ({
                    ...prev,
                    roleId: data[0].id
                }))
            }
        })
        .catch(error =>{ //handle error response
            // let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            // enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    const handleToggleVisibility = () => {
        setShowPaswsord(prev => !prev)
    }

    return (
        <div className="tw-flex tw-flex-col tw-gap-4">
            <AdminHeaderSidebar title={isEdit ? "Edit User" : "Tambah User"} />
            <form 
                className="tw-flex tw-flex-col tw-gap-4 tw-px-4 tw-w-full tw-max-w-screen-lg tw-self-center"
                onSubmit={(e) => {e.preventDefault(); handleFormSubmit()}}
            >
                <div>
                    {/* <p>Username</p>
                    <input name="username" value={formData.username} className={`${formErrors.username ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("username",e.target.value)} />
                    <p className="tw-text-sm tw-text-red-500">{formErrors.username}</p> */}
                    <TextField
                        autoFocus
                        fullWidth
                        autoComplete="username"
                        label="Username"
                        name="username"
                        disabled={isLoading}
                        error={!!formErrors.username}
                        helperText={formErrors.username}
                        value={formData.username}
                        onChange={(e) => handleFormChange("username",e.target.value)}
                    />
                </div>
                <div>
                    {/* <p>Name</p>
                    <input name="name" value={formData.name} className={`${formErrors.name ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("name",e.target.value)} />
                    <p className="tw-text-sm tw-text-red-500">{formErrors.name}</p> */}
                    <TextField
                        fullWidth
                        autoComplete="name"
                        label="Nama"
                        name="Nama"
                        disabled={isLoading}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        value={formData.name}
                        onChange={(e) => handleFormChange("name",e.target.value)}
                    />
                </div>
                {
                    !isEdit && <div>
                        <TextField
                            fullWidth
                            autoComplete="new-password"
                            label="Password"
                            name="Password"
                            disabled={isLoading}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            type={isShowPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleFormChange("password",e.target.value)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleToggleVisibility}
                                    >
                                        {isShowPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </div>
                }
                <div>
                    <FormControl>
                        <InputLabel id="label-role">Role</InputLabel>
                        <Select
                            labelId="label-role"
                            disabled={isLoading}
                            value={formData.roleId}
                            onChange={(e) => handleFormChange('roleId', e.target.value as number)}
                        >
                            {
                                roles.map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </div>
                <div className="">
                    <p className="">Status</p>
                    <FormControlLabel 
                        control={
                            <Switch
                                color="primary"
                                checked={formData.isActive}
                                disabled={isLoading}
                                onChange={(e) => handleFormChange('isActive', e.target.checked)}
                            />
                        }
                        label={formData.isActive ? 'Aktif' : 'Tidak aktif'}
                    />
                </div>
                {/* <button className="tw-border tw-border-black" onClick={handleFormSubmit}>Tambah</button> */}
                <div className="tw-flex tw-w-full tw-justify-end">
                    <button
                        className={`tw-px-3 tw-py-2 tw-flex tw-bg-green-600 tw-text-white tw-rounded-lg tw-shadow-md tw-font-medium ${isLoading && 'tw-opacity-70'}`}
                        disabled={isLoading}
                        type='submit'
                    >
                        {
                            isLoading ? <svg className="tw-animate-spin tw-h-5 tw-w-5 tw-mr-2 tw-text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg> 
                            : <i className="bi bi-check2 tw-mr-2" />
                        }
                        <span>
                        {
                            isLoading ? 'MENYIMPAN...' : "SIMPAN"
                        }
                        </span>
                    </button>
                </div>
            </form>
        </div>
    )
}
