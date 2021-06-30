import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'


import axios from  '../../../utils/AdminAxios'
import {ProductObject} from '../../../types'


interface ServerResponse {
    id: number,
    name: string,
    price: number,
}

export default function Products() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()

    const {configs, setConfig} = useAdminConfig()

    const [products, setProducts] = useState<ServerResponse[]>([])
    const [isLoading, setLoading] = useState(true)

    const requestAllProducts = () => {
        setLoading(true)
        axios({method:'get', url: '/product/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setProducts(data.map(_product => ({
                id: _product.id,
                name: _product.name,
                price: _product.price,
            })))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        requestAllProducts()
    },[])

    const handleEditProduct = (x: ProductObject) => {
        setConfig({editProductObject: x})
        history.push('/products/edit')
    }

    const handleDeleteProduct = (x: ProductObject) => {
        //TODO: Tambah konfirmasi dengan password
        setLoading(true)
        axios({method:'post', url: '/product/delete', data: {id: x.id, /*password: */}})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data);
            enqueueSnackbar(`Produk ${x.name} berhasil dihapus`,{variant: 'warning'})
            requestAllProducts()
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
            <button className="tw-border tw-border-black tw-py-2" onClick={() => history.push('/products/tambah')}>Tambah Produk</button>
            {
                isLoading ? <span>Loading...</span>
                : products.length > 0 ? products.map(x => (
                    <div key={x.id} className="tw-w-full tw-border tw-border-black tw-rounded-lg tw-p-4 tw-flex tw-flex-col">
                        <p>Nama Produk : {x.name}</p>
                        <p>Harga per liter: {x.price}</p>
                        <div className="tw-flex tw-justify-around">
                            <span onClick={() => handleEditProduct(x)}>Edit</span>
                            <span onClick={() => handleDeleteProduct(x)}>Delete</span>
                        </div>
                    </div>
                ))
                : <span>Belum ada produk</span>
            }
        </div>
    )
}
