import React, {useEffect, useState} from 'react'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router'
import { useStateWithCallbackLazy } from 'use-state-with-callback';

import {
    InputAdornment,
    TextField,
} from '@material-ui/core'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import Backdrop from '../../../components/Backdrop'
import ModalDeleteProduct from '../../../components/modals/ModalDeleteProduct'
import Product from '../../../models/Product'
import Spinner from '../../../components/Spinner'
import { useAuth } from '../../../providers/AuthProvider'


interface ServerResponse {
    id: number,
    name: string,
    price: number,
    penerimaanPrice: number,
}

export default function Products() {
    const {enqueueSnackbar} = useSnackbar()
    const {axios} = useAuth()

    const [deletedProduct, setDeletedProduct] = useState<Product>(new Product())
    const [errorMsg, setErrorMsg] = useState('')
    const [formId, setFormId]  = useState(-1)
    const [formName, setFormName] = useState('')
    const [formPrice, setFormPrice] = useState(0)
    const [formPenerimaanPrice, setFormPenerimaanPrice] = useState(0)
    const [isEditing, setEditing] = useState(false)
    const [isError, setError] = useState(false)
    const [isFormLoading, setFormLoading] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [products, setProducts] = useStateWithCallbackLazy<Product[]>([])
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalForm, setShowModalForm] = useState(false)
    const [formErrors, setFormErrors] = useState({
        name: '',
        price: '',
        penerimaanPrice: '',
    })

    const requestAllProducts = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/product/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setProducts(data.map(_product => new Product({
                id: _product.id,
                name: _product.name,
                price: _product.price,
                penerimaanPrice: _product.penerimaanPrice,
            })), () => setLoading(false))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
                //Error caused from the server
                let errorCode = error.response.status
                switch(errorCode){
                    case 400: /*bad request*/ break; 
                    case 401: /*Unauthorized*/ break;
                    case 403: /*Forbidden*/ break;
                    case 404: /*not found*/ break; 
                    case 405: /*method not allowed*/ break; 
                    case 408: /*Request timed out*/ break;
                    case 409: /*Conflict*/ break;
                    case 419: /*Page expired, CSRF token missing*/ break;
                    case 422: /*Validation failed*/ break;
                    case 429: /*Too Many Request */ break;
                    case 500: //server error
                        errorMessage=`Server error (${errorCode}) msg:${error.message}`;
                        break; 
                    default: /* Other errors */
                        errorMessage=`Terjadi error (${errorCode}).`;
                }
            } else if (error.request){
                //Request was made but no response was received
            } else {
                //Something happened in setting up the request that triggered an Error
            }
            setError(true)
            setProducts([], () => setLoading(false))
            setErrorMsg(errorMessage)
        })
    }

    useEffect(() => {
        requestAllProducts()
    },[])

    const handleEditProduct = (product: Product) => {
        setFormName(product.name)
        setFormPrice(product.price)
        setFormPenerimaanPrice(product.penerimaanPrice)
        setEditing(true)
        setFormId(product.id)
        setShowModalForm(true)
    }

    const handleClickDeleteProduct = (product: Product) => {
        setDeletedProduct(product)
        setShowModalDelete(true)
    }

    const handleSubmitForm = () => {
        if (isFormLoading) return
        setFormLoading(true)
        axios({
            method:'post', 
            url: isEditing ?  '/admin/product/edit' : '/admin/product/add', 
            data: {
                name: formName,
                price: formPrice,
                penerimaanPrice: formPenerimaanPrice,
                id: formId,
            }
        })
        .then(() => { //handle success response
            setFormErrors({
                name: '',
                price: '',
                penerimaanPrice: '',
            })
            enqueueSnackbar(`Produk berhasil di${isEditing? 'edit' : 'tambahkan'}`,{variant: 'success'})
            requestAllProducts()
            handleCloseModal()
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                //Error caused from the server
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
        .finally(() => {
            setFormLoading(false)
        })
    }

    const handleCloseModal = () => {
        if (isFormLoading) return
        
        setShowModalForm(false)
        setShowModalDelete(false)
        setFormId(-1)
        setFormName('')
        setFormPrice(0)
        setFormLoading(false)
        setDeletedProduct(new Product())
        setEditing(false)
    }

    const renderProduct = (product: Product, i: number) => {

        return  <div 
            className="tw-w-full tw-border-2 tw-border-orange-500 tw-rounded-lg tw-px-4 tw-py-3 tw-flex tw-justify-between tw-items-center"
            key={product.id} 
            style={{boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)"}}
        >
            {/* product detail */}
            <div className="tw-flex-grow tw-flex tw-flex-col">
                <span>Produk {i+1}</span>
                <div className="tw-flex tw-gap-2 tw-items-center">
                    <span className="tw-text-2xl tw-font-semibold">{product.name}</span>
                    <span className="">(Rp{product.price} /L)</span>
                </div>
            </div>
            
            {/* action buttons */}
            <div className="tw-flex tw-justify-around tw-gap-3">
                {/* delete */}
                <span 
                    className="tw-rounded-full tw-border-2 tw-border-red-500 tw-text-red-500 tw-grid tw-place-items-center tw-w-8 tw-h-8"
                    onClick={() => handleClickDeleteProduct(product)}
                >
                    <i className="bi bi-trash tw-relative tw-top-0.5" />
                </span>
                {/* edit */}
                <span 
                    className="tw-rounded-full tw-border-2 tw-border-green-500 tw-text-green-500 tw-grid tw-place-items-center tw-w-8 tw-h-8"
                    onClick={() => handleEditProduct(product)}
                >
                    <i className="bi bi-pencil" />
                </span>
            </div>
        </div>
    }

    const renderSkeleton = (i: number) => {

        return  <div
                    className="tw-animate-pulse tw-w-full tw-border-2 tw-border-gray-400 tw-rounded-lg tw-px-4 tw-pt-3 tw-pb-4 tw-flex tw-justify-between tw-items-center"
                    key={i}
                    style={{boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)"}}
        >
            {/* product detail */}
            <div className="tw-flex-grow tw-flex tw-flex-col tw-gap-3">
                <span className="tw-rounded tw-h-4 tw-w-16 tw-bg-gray-400" />
                <div className="tw-flex tw-gap-2 tw-items-center">
                    <span className="tw-h-6 tw-w-24 tw-bg-gray-400 tw-rounded" />
                    <span className="tw-h-5 tw-w-20 tw-bg-gray-400 tw-rounded" />
                </div>
            </div>
            
            {/* action buttons */}
            <div className="tw-flex tw-justify-around tw-gap-3">
                {/* delete */}
                <span 
                    className="tw-rounded-full tw-border-2 tw-border-gray-400 tw-bg-gray-400 tw-w-8 tw-h-8"
                >
                </span>
                {/* edit */}
                <span 
                    className="tw-rounded-full tw-border-2 tw-border-gray-400 tw-bg-gray-400 tw-w-8 tw-h-8"
                >
                </span>
            </div>
        </div>
    }

    const handleFinishDelete = () => {
        handleCloseModal()
        requestAllProducts()
    }

    return (
        <div className="tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Daftar Produk" />
            <div className="tw-grid tw-place-items-center tw-mt-4">

                {/* add product button */}
                <button
                    className="tw-rounded-full tw-py-2 tw-px-4 tw-bg-primary-500 tw-text-white tw-font-medium" 
                    onClick={() => setShowModalForm(true)}
                >
                    <i className="bi bi-droplet-fill tw-mr-2" />
                    Tambah Produk
                </button>
            </div>
            <div className="tw-mt-4 tw-px-4 tw-flex tw-flex-col tw-gap-4">
                {
                    isLoading ? [1,2,3,4,5].map((i) => renderSkeleton(i))
                    : products.length > 0 ? products.map(renderProduct)
                    : isError ? <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-8 tw-py-8">
                        <img src="/storage/assets/illustrations/undraw_bug_fixing_oc7a.svg" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
                        <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops! Terjadi kesalahan.</h1>
                        <span className="tw-text-center tw-text-gray-800 tw-mt-3">Terdapat error sehingga data tidak dapat ditampilkan. Silakan coba beberapa saat lagi</span>
                        <span className="tw-text-center tw-mt-2 tw-text-sm tw-text-gray-700">{errorMsg}</span>
                        <button 
                            className="tw-px-3 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg tw-shadow-md tw-flex tw-gap-2 tw-mt-2 tw-items-center"
                            onClick={() => requestAllProducts()}
                        >
                            <i className="bi bi-arrow-repeat tw-text-lg" />
                            Coba lagi
                        </button>
                    </div>
                    : <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-8 tw-py-8">
                        <img src="/storage/assets/illustrations/undraw_Tree_swing_646s.svg" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
                        <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops!</h1>
                        <span className="tw-text-center tw-text-gray-800 tw-mt-3">Sepertinya Anda belum membuat produk sama sekali. Cobalah untuk membuat 1 produk</span>
                    </div>
                }
            </div>

            {/* modal delete */}
            <ModalDeleteProduct 
                show={showModalDelete}
                onClose={handleCloseModal}
                onFinished={handleFinishDelete}
                product={deletedProduct}
            />

            {/* modal form */}
            <Backdrop 
                onClick={handleCloseModal}
                show={showModalForm}
            >
                <form
                    onSubmit={(e) => {e.preventDefault(); handleSubmitForm()}}
                    className="tw-w-full tw-max-w-screen-sm tw-bg-white tw-rounded-xl tw-py-4 tw-px-8 tw-flex-col"
                >

                    {/* header */}
                    <div className="tw-flex tw-flex-col tw-items-center">
                        <i className="bi bi-droplet-fill tw-text-xl" />
                        <span className="tw-font-semibold tw-text-xl">{isEditing ? 'Edit' : 'Tambah'} Produk</span>
                    </div>

                    {/* form */}
                    <div className="tw-flex tw-flex-col tw-mt-2 tw-gap-4">
                        {/* Name */}
                        <TextField 
                            fullWidth
                            autoComplete="off"
                            label="Nama Produk"
                            placeholder="Contoh: Pertalite"
                            disabled={isFormLoading}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                        />

                        {/* Harga */}
                        <TextField 
                            fullWidth
                            autoComplete="off"
                            label="Harga Produk per Liter"
                            placeholder="Contoh: 7850"
                            type="number"
                            disabled={isFormLoading}
                            error={!!formErrors.price}
                            helperText={formErrors.price}
                            value={formPrice ? formPrice : ''}
                            onChange={(e) => setFormPrice(+e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Rp</InputAdornment>
                            }}
                        />

                        {/* Harga Penerimaan */}
                        <TextField 
                            fullWidth
                            autoComplete="off"
                            label="Harga Penerimaan per Liter"
                            placeholder="Contoh: 7536,70"
                            type="number"
                            disabled={isFormLoading}
                            error={!!formErrors.penerimaanPrice}
                            helperText={formErrors.penerimaanPrice}
                            value={formPenerimaanPrice ? formPenerimaanPrice : ''}
                            onChange={(e) => setFormPenerimaanPrice(+e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                            }}
                            inputProps={{
                                step: 0.01,
                                min: 0,
                            }}
                        />
                    </div>

                    {/* footer */}
                    <div className="tw-flex tw-justify-between tw-mt-8">

                        {/* batal */}
                        <button
                            className={`tw-bg-white tw-border tw-border-red-500 tw-rounded-md tw-flex tw-items-center tw-text-red-500 tw-py-2 tw-px-4 tw-gap-2 ${isFormLoading && 'tw-opacity-75'}`}
                            onClick={handleCloseModal}
                            type="button"
                        >
                            <i className="bi bi-x-lg" />
                            <span className="tw-font-semibold">BATAL</span>
                        </button>

                        {/* simpan */}
                        <button
                            className={`tw-bg-green-600 tw-rounded-md tw-flex tw-items-center tw-text-white tw-py-2 tw-px-4 tw-gap-2 ${isFormLoading && 'tw-opacity-75'}`}
                            type="submit"
                        >
                            <span className="tw-font-semibold">
                                {
                                    isFormLoading ? <span className="tw-flex tw-items-center tw-gap-2">
                                        <Spinner /> MENYIMPAN...
                                    </span>
                                    : <span>
                                        <i className="bi bi-check-lg" /> SIMPAN
                                    </span>
                                }
                            </span>
                        </button>
                    </div>
                </form>
            </Backdrop>
        </div>
    )
}
