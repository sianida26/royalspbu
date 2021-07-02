import React, {useEffect, useState} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
import { useAdminConfig, editTankDefaultObject } from '../../../providers/AdminConfigProvider'
import { TankObject } from '../../../types'

import {useAuth} from '../../../providers/AuthProvider'

interface FormErrors {
    name?: string,
    product?: number,
    stock?: number,
}

interface ProductObject{
    id: number,
    name: string,
}
interface ServerResponse {
    id: number,
    name: string,
    price: number,
}

export default function FormTank() {

    let isEdit = location.pathname.split('/').pop()?.toLowerCase() === "edit"

    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {configs, setConfig} = useAdminConfig()

    const [formData, setFormData] = useState<TankObject>(editTankDefaultObject)
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [products, setProducts] = useState<ProductObject[]>([])
    const [loading, setLoading] = useState(false)
    const {axios} = useAuth()

    useEffect(() => {
        //validating data if in edit mode
        requestProducts()
        if (isEdit){
            //redirect to home if no data provided in context API
            if (configs.editTankObject!.id < 0){
                history.replace('/');
                return
            }

            setFormData(configs.editTankObject!)

            setConfig({editTankObject: editTankDefaultObject}) //hapus objek edit
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
        setLoading(true)
        axios({method:'post', url: isEdit?  '/admin/tank/edit' :'/admin/tank/add', data: formData})
        .then(result => { //handle success response
            setFormErrors({})
            let data = result.data;
            enqueueSnackbar(`Tangki berhasil di${isEdit? 'edit' : 'tambahkan'}`,{variant: 'success'})
            history.push('/tanks');
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
        })
        .finally(() => setLoading(false))
    }

    const requestProducts = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/product/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setProducts(data.map(_product => ({
                id: _product.id,
                name: _product.name,
            })))
            setFormData(prev => ({
                ...prev,
                productId: data[0].id,
            }))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    return (
        <div className="tw-flex tw-flex-col tw-gap-4">
            <h1>Tambah Tangki</h1>
            <div>
                <p>Nama Tangki</p>
                <input name="name" value={formData.name} className={`${formErrors.name ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("name",e.target.value)} />
                <p className="tw-text-sm tw-text-red-500">{formErrors.name}</p>
            </div>
            <div>
                <label htmlFor="produk">Produk</label>
                <select id="produk" value={formData.productId} onChange={(e) => handleFormChange('productId',e.target.value)}>
                    {
                        products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)
                    }
                </select>
                <p className="tw-text-sm tw-text-red-500">{formErrors.product}</p>
            </div>
            <div>
                <p>Stok</p>
                <input name="stock" type="number" value={formData.stock} className={`${formErrors.stock ? 'tw-border-b-2 tw-border-red-500' : 'tw-border-b'} tw-border-black`} onChange={(e) => handleFormChange("stock",e.target.value)} />
            </div>
            <button className="tw-border tw-border-black" onClick={handleFormSubmit}>Tambah</button>
        </div>
    )
}
