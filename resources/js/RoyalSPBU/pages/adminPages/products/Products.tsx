import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'
import { useAuth } from '../../../providers/AuthProvider'
import { ProductObject } from '../../../types'


interface ServerResponse {
    id: number,
    name: string,
    price: number,
}

export default function Products() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()

    const {configs, setConfig} = useAdminConfig()
    const {axios} = useAuth()

    const [products, setProducts] = useState<ServerResponse[]>([])
    const [isLoading, setLoading] = useState(true)

    const requestAllProducts = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/product/getAll'})
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
        axios({method:'post', url: '/admin/product/delete', data: {id: x.id, /*password: */}})
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
            <AdminHeaderSidebar title="Daftar Produk" />
            <div className="tw-grid tw-place-items-center tw-mt-4">
                <button className="tw-rounded-full tw-py-2 tw-px-4 tw-bg-primary-500 tw-text-white tw-font-medium" onClick={() => history.push('/products/tambah')}>
                    <i className="bi bi-droplet-fill tw-mr-2" />
                    Tambah Produk
                </button>
            </div>
            <div className="tw-mt-4 tw-px-4">
                {
                    isLoading ? <span>Loading...</span>
                    : products.length > 0 ? products.map(product => (
                        <div key={product.id} className="tw-w-full tw-border tw-border-black tw-rounded-lg tw-p-4 tw-flex tw-flex-col">
                            <p>Nama Produk : {product.name}</p>
                            <p>Harga per liter: {product.price}</p>
                            <div className="tw-flex tw-justify-around">
                                <span onClick={() => handleEditProduct(product)}>Edit</span>
                                <span onClick={() => handleDeleteProduct(product)}>Delete</span>
                            </div>
                        </div>
                    ))
                    : <span>Belum ada produk</span>
                }
            </div>
        </div>
    )
}
