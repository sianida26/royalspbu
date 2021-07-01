import React, {useState, useEffect} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
import { useAdminConfig, editTankDefaultObject, editPumpDefaultObject, editPermissionDefaultObject } from '../../../providers/AdminConfigProvider'

import axios from '../../../utils/AdminAxios'
import { IPermission } from '../../../types'

export default function FormPermission() {

    let isEdit = location.pathname.split('/').pop()?.toLowerCase() === "edit"
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {configs, setConfig} = useAdminConfig()
    const [formData, setFormData] = useState<IPermission>(editPermissionDefaultObject)

    useEffect(() => {
        //validating data if in edit mode
        if (isEdit){
            //redirect to home if no data provided in context API
            if (configs.editPermissionObject!.id < 0){
                history.replace('/');
                return
            }

            setFormData(configs.editPermissionObject!)

            setConfig({editPermissionObject: editPermissionDefaultObject}) //hapus objek edit
        }
    }, [])

    const handleFormChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSave = () => {
        axios({method:'post', url: isEdit?  '/permission/edit' :'/permission/add', data: formData})
        .then(result => { //handle success response
            // setFormErrors({}) todo: set form errors
            let data = result.data;
            enqueueSnackbar(`Permission berhasil di${isEdit? 'edit' : 'tambahkan'}`,{variant: 'success'})
            history.push('/permissions');
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

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            <p>Nama Permission</p>
            <input className="tw-border tw-border-black tw-rounded-lg tw-p-2" value={formData.name} onChange={(e) => handleFormChange("name", e.target.value)} />
            <div className="tw-border tw-border-black tw-bg-green-300" onClick={handleSave}>Simpan</div>
        </div>
    )
}
