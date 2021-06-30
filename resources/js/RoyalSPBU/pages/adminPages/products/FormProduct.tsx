import React, {useEffect, useState} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
import { useAdminConfig, editProductDefaultObject } from '../../../providers/AdminConfigProvider'
import { ProductObject } from '../../../types'


import axios from '../../../utils/AdminAxios'

interface FormErrors {
    name?: string,
    price?: number,
}

interface Props {
    type: 'add' | 'edit'
}

export default function FormProduct(props: Props) {

    const isEdit = props.type === "edit"

    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {configs, setConfig} = useAdminConfig()

    const [formData, setFormData] = useState<ProductObject>(editProductDefaultObject)
    const [formErrors, setFormErrors] = useState<FormErrors>({})

    useEffect(() => {
        //validating data if in edit mode
        if (props.type === "edit"){
            //redirect to home if no data provided in context API
            if (configs.editProductObject!.id < 0){
                history.replace('/');
                return
            }

            setFormData(configs.editProductObject!)

            setConfig({editProductObject: editProductDefaultObject}) //hapus objek edit
        }
    }, [])

    const handleFormChange = (name: string, value: string|number) => {
        setFormData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleFormSubmit = () => {
        axios({method:'post', url: isEdit?  '/product/edit' :'/product/add', data: formData})
        .then(result => { //handle success response
            setFormErrors({})
            let data = result.data;
            console.log(data);
            enqueueSnackbar(`Produk berhasil di${isEdit? 'edit' : 'tambahkan'}`,{variant: 'success'})
            history.push('/products');
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

    return (
        <div className="tw-flex tw-flex-col tw-gap-4">
            <h1>Tambah Produk</h1>
            <div>
                <p>Nama Produk</p>
                <input name="name" value={formData.name} className={`${formErrors.name ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("name",e.target.value)} />
                <p className="tw-text-sm tw-text-red-500">{formErrors.name}</p>
            </div>
            <div>
                <p>Harga per liter</p>
                <input name="name" type="number" value={formData.price} className={`${formErrors.price ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("price",e.target.value)} />
                <p className="tw-text-sm tw-text-red-500">{formErrors.price}</p>
            </div>
            <button className="tw-border tw-border-black" onClick={handleFormSubmit}>Tambah</button>
        </div>
    )
}
