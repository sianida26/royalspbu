import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import Backdrop from '../../../components/Backdrop'
import ModalDeleteTank from '../../../components/modals/ModalDeleteTank'
import Product from '../../../models/Product'
import Spinner from '../../../components/Spinner'
import Tank from '../../../models/Tank'
import { useAuth } from '../../../providers/AuthProvider'

interface ServerResponse {
    products: {
        id: number,
        name: string,
    }[],
    tanks: {
        id: number,
        name: string,
        productId: number,
        product: string,
        stock: number,   
    }[]
}

export default function Tanks() {

    const { axios } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const [deletedTank, setDeletedTank] = useState<Tank>(new Tank())
    const [errorMsg, setErrorMsg] = useState('')
    const [expandId, setExpandId] = useState(-1)
    const [formId, setFormId] = useState(-1)
    const [formName, setFormName] = useState('')
    const [formProduct, setFormProduct] = useState(-1)
    const [formStock, setFormStock] = useState(0)
    const [isEditing, setEditing] = useState(false)
    const [isError, setError] =  useState(false)
    const [isFormLoading, setFormLoading] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalForm, setShowModalForm] = useState(false)
    const [tanks, setTanks] = useState<Tank[]>([])
    const [formErrors, setFormErrors] = useState({
        name: '',
        product: '',
        stock: '',
    })

    useEffect(() => {
        requestAllTanks()
    },[])

    const handleEditTank = (tank: Tank) => {
        setEditing(true)
        setFormName(tank.name)
        setFormId(tank.id)
        setFormProduct(tank.product?.id || -1)
        setFormStock(tank.stock)
        setShowModalForm(true)
    }

    const requestAllTanks = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/tank/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse = result.data;
            setTanks(data.tanks.map((tank, i) => new Tank({
                id: tank.id,
                name: tank.name,
                product: new Product({
                    name: tank.product,
                    id: tank.productId,
                }),
                stock: tank.stock,
                tankNumber: i+1
            })))
            setProducts(data.products.map(product => new Product({
                id: product.id,
                name: product.name,
            })))
            setFormProduct(data.products[0].id)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : error.message;
            setErrorMsg(errorMessage)
            setError(true)
        })
        .finally(() => setLoading(false))
    }

    const handleDeleteTank = (tank: Tank) => {
        setDeletedTank(tank)
        setShowModalDelete(true)
    }

    const handleFinishDelete = () => {
        handleCloseModal()
        requestAllTanks()
    }

    const renderItem = (tank: Tank) => {

        return <Accordion 
            key={tank.id} 
            expanded={expandId === tank.id} 
            onChange={() => setExpandId(expandId === tank.id? -1 : tank.id)}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <div className="tw-flex-shrink-0 tw-w-1/3 tw-font-semibold">Tangki {tank.tankNumber}</div>
                <div className="tw-text-gray-700">{tank.name}</div>
            </AccordionSummary>
            <AccordionDetails className="tw-flex tw-flex-col tw-gap-2">
                {/* tank number */}
                <div className="tw-flex">
                    <div className="tw-flex-shrink-0 tw-w-1/2 tw-font-medium">Nomor tangki</div>
                    <div className="tw-text-gray-600">{tank.tankNumber}</div>
                </div>

                {/* tank name */}
                <div className="tw-flex">
                    <div className="tw-flex-shrink-0 tw-w-1/2 tw-font-medium">Nama tangki</div>
                    <div className="tw-text-gray-600">{tank.name}</div>
                </div>

                {/* produk */}
                <div className="tw-flex">
                    <div className="tw-flex-shrink-0 tw-w-1/2 tw-font-medium">Produk</div>
                    <div className="tw-text-gray-600">{tank.product?.name}</div>
                </div>

                {/* stock */}
                <div className="tw-flex">
                    <div className="tw-flex-shrink-0 tw-w-1/2 tw-font-medium">Stok</div>
                    <div className="tw-text-gray-600">{tank.stock} L</div>
                </div>

                {/* action buttons */}
                <div className="tw-flex tw-justify-around tw-mt-2">
                    {/* delete */}
                    <button 
                        className="tw-px-3 tw-py-1 tw-rounded-lg tw-border tw-border-red-500 tw-flex tw-items-center tw-gap-2 tw-text-red-500"
                        onClick={() => handleDeleteTank(tank)}
                    >
                        <i className="bi bi-trash" />
                        HAPUS
                    </button>

                    {/* edit */}
                    <button 
                        className="tw-px-3 tw-py-1 tw-rounded-lg tw-border tw-border-green-500 tw-flex tw-items-center tw-gap-2 tw-text-green-500"
                        onClick={() => handleEditTank(tank)}
                    >
                        <i className="bi bi-pencil" />
                        EDIT
                    </button>
                </div>
            </AccordionDetails>
        </Accordion>
    }

    const renderSkeleton = (i: number /*iteration number*/) => {

        return <Accordion 
                    key={i} 
                    className="tw-animate-pulse"
                    expanded={false} //prevent expanding when loading
            >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <div className="tw-flex-shrink-0 tw-w-1/3 tw-font-semibold tw-flex">
                    <span className="tw-h-4 tw-w-16 tw-bg-gray-400 tw-rounded" />
                </div>
                <span className="tw-h-4 tw-w-20 tw-bg-gray-400 tw-rounded" />
            </AccordionSummary>
        </Accordion>
    }

    const renderDisplayError = () => {

        return <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-8 tw-py-8">
            <img src="/storage/assets/illustrations/undraw_bug_fixing_oc7a.svg" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
            <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops! Terjadi kesalahan.</h1>
            <span className="tw-text-center tw-text-gray-800 tw-mt-3">Terdapat error sehingga data tidak dapat ditampilkan. Silakan coba beberapa saat lagi</span>
            <span className="tw-text-center tw-mt-2 tw-text-sm tw-text-gray-700">{errorMsg}</span>
            <button 
                className="tw-px-3 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg tw-shadow-md tw-flex tw-gap-2 tw-mt-2 tw-items-center"
                onClick={() => requestAllTanks()}
            >
                <i className="bi bi-arrow-repeat tw-text-lg" />
                Coba lagi
            </button>
        </div>
    }

    const renderDisplayNoData = () => {
        
        return <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-8 tw-py-8">
            <img src="/storage/assets/illustrations/undraw_Tree_swing_646s.svg" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
            <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops!</h1>
            <span className="tw-text-center tw-text-gray-800 tw-mt-3">Sepertinya Anda belum membuat tangki sama sekali. Cobalah untuk membuat 1 tangki</span>
        </div>
    }

    const handleCloseModal = () => {
        if (isFormLoading) return

        setShowModalForm(false)
        setShowModalDelete(false)
        setFormErrors({
            name: '',
            product: '',
            stock: '',
        })
        setFormId(-1)
        setFormName('')
        setFormProduct(products.length > 0 ? products[0].id : -1)
        setFormStock(0)
    }

    const handleSubmitForm = () => {
        setFormLoading(true)
        axios({
            method:'post', 
            url: isEditing?  '/admin/tank/edit' :'/admin/tank/add', 
            data: {
                id: formId,
                name: formName,
                product: formProduct,
                stock: formStock,
            }
        })
        .then(result => { //handle success response
            setFormErrors({
                name: '',
                product: '',
                stock: '',
            })
            enqueueSnackbar(`Tangki berhasil di${isEditing? 'edit' : 'tambahkan'}`,{variant: 'success'})
            handleCloseModal()
            requestAllTanks()
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
        .finally(() => setFormLoading(false))
    }

    const renderFormModal = () => {

        return <Backdrop 
            onClick={handleCloseModal}
            show={showModalForm}
        >
            <form
                onSubmit={(e) => {e.preventDefault(); handleSubmitForm()}}
                className="tw-w-full tw-max-w-screen-sm tw-bg-white tw-rounded-xl tw-py-4 tw-px-8 tw-flex-col"
            >

                {/* header */}
                <div className="tw-flex tw-flex-col tw-items-center">
                    <i className="bi bi-water tw-text-xl" />
                    <span className="tw-font-semibold tw-text-xl">{isEditing ? 'Edit' : 'Tambah'} Tangki</span>
                </div>

                {/* form */}
                <div className="tw-flex tw-flex-col tw-mt-2 tw-gap-4">

                    {/* Name */}
                    <TextField 
                        fullWidth
                        autoComplete="off"
                        label="Nama Tangki"
                        placeholder="Contoh: Pertalite 1"
                        disabled={isFormLoading}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                    />

                    <FormControl error={!!formErrors.product}>
                        <InputLabel id="select-product-label">Produk</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formProduct}
                            disabled={isFormLoading}                            
                            onChange={(e) => setFormProduct(e.target.value as number)}
                        >
                            {
                                products.length > 0 ? products.map(product => <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>)
                                : <MenuItem value={-1}>Tidak ada produk</MenuItem>
                            }
                        </Select>
                        <FormHelperText>{formErrors.product}</FormHelperText>
                    </FormControl>

                    <TextField 
                        fullWidth
                        autoComplete="off"
                        label="Stok"
                        placeholder="Contoh: 12000"
                        type="number"
                        disabled={isFormLoading}
                        error={!!formErrors.stock}
                        helperText={formErrors.stock}
                        value={formStock || ''}
                        onChange={(e) => setFormStock(+e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">L</InputAdornment>
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
    }

    return (
        <div className="tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Daftar Tangki" />
            {/* <button className="tw-border tw-border-black tw-py-2" onClick={() => history.push('/tanks/tambah')}>Tambah Tangki</button> */}
            <div className="tw-grid tw-place-items-center tw-mt-4 tw-max-w-screen-sm tw-w-full tw-self-center">

                {/* add tank button */}
                <button
                    className={`tw-rounded-full tw-py-2 tw-px-4 tw-bg-primary-500 tw-text-white tw-font-medium ${isLoading && 'tw-opacity-75'}`}
                    disabled={isLoading}
                    onClick={() => setShowModalForm(true)}
                >
                    <i className="bi bi-water tw-mr-2" />
                    Tambah Tangki
                </button>
            </div>

            {/* tank item list */}
            <div className="tw-px-4 tw-py-2 tw-max-w-screen-sm tw-w-full tw-self-center">
                {
                    isLoading ? [1,2,3,4,5].map((i) => renderSkeleton(i))
                    : tanks.length > 0 ? tanks.map((tank, i) => renderItem(tank))
                    : isError ? renderDisplayError()
                    : renderDisplayNoData()
                }
            </div>

            {renderFormModal()}
            {/* modal delete */}
            <ModalDeleteTank
                show={showModalDelete}
                onClose={handleCloseModal}
                onFinished={handleFinishDelete}
                tank={deletedTank}
            />
        </div>
    )
}
