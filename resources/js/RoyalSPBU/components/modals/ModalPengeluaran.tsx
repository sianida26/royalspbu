/**
 * @author Chesa Nur Hidayat <chesanurhidayat@gmail.com>
 */

import React from 'react'

import Compressor from 'compressorjs'
import { useSnackbar } from 'notistack'
import PerfectScrollbar from 'react-perfect-scrollbar'
import * as uuid from 'uuid'

import { TextField, Button, InputAdornment, CircularProgress } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto'

import GreenButton from '../GreenButton'
import {useAuth} from '../../providers/AuthProvider'
import zIndexes from '../../constants/zIndexes'

//todo fix autofocus on modal show

interface OptionType {
    id: number,
    name: string
}

interface Pengeluaran {
    id: number | string,
    name: string,
    amount: number,
    url: string,
    reportFilename: string | null,
}

interface ComponentProps {
    data: Pengeluaran,
    isEdit: boolean,
    show: boolean,
    closeModal: () => void,
    onSubmit: (pengeluaran: string, amount: number, fileName: string, id: number|string, url: string) => void
}

export default function ModalPengeluaran(props: ComponentProps) {

    const {enqueueSnackbar} = useSnackbar()

    const {axios} = useAuth()

    const pengeluaranTypeRef = React.useRef<HTMLInputElement>(null)
    const [pengeluaranTypes, setPengeluaranTypes] = React.useState<OptionType[]>([])
    const [pengeluaran, setPengeluaran] = React.useState('')
    const [pengeluaranError, setPengeluaranError] = React.useState('')
    const [amount, setAmount] = React.useState(0)
    const [amountError, setAmountError] = React.useState('')
    const [isUploading, setUploading] = React.useState(false)
    const [isUploadSuccess, setUploadSuccess] = React.useState(false)
    const [fileName, setFileName] = React.useState('')
    const [fileUrl, setFileUrl] = React.useState('')
    const [uploadError, setUploadError] = React.useState('')
    const [id, setId] = React.useState<string|number>(-1)
    const [isOldItem, setIsOldItem] = React.useState(false)

    React.useEffect(() => {
        getAllPengeluaranTypes()
    },[])

    React.useEffect(() => {
        //setting all states into their default value
        if (props.show) {
            //on open
            let oldItem: boolean = typeof props.data.id === 'number' //if id is a number, thus a old pengeluaran item
            setPengeluaran(props.data.name)
            setPengeluaranError('')
            setAmount(props.data.amount)
            setAmountError('')
            setUploading(false)
            setUploadSuccess(false)
            setFileName(props.data.reportFilename || '')
            setFileUrl(props.data.url)
            setUploadError('')
            setId(props.data.id)
            setIsOldItem(oldItem)
            pengeluaranTypeRef.current?.focus() //todo fix
        } else {
            //on close
        }
    }, [props.show])

    const handleCloseModal = () => {
        props.closeModal()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        //validating form
        if (!pengeluaran) {
            setPengeluaranError('Harus diisi')
        } else {
            setPengeluaranError('')
        }

        if (amount < 0) {
            setAmountError('Pengeluaran tidak dapat kurang dari 0')
        } else {
            setAmountError('')
        }

        if (!(pengeluaranError && amountError)) props.onSubmit(pengeluaran, amount, fileName, isOldItem ? id : uuid.v1(), fileUrl)
    }

    const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]){

            let url = URL.createObjectURL(event.target.files![0])
            setFileUrl(url)

            new Compressor(event.target.files[0],{
                quality: 0.6,
                success(result){
                    //on success compressing image
                    sendImage(result)
                },
                error(error){
                    //on error comporessing image
                    setUploadError('Terjadi kesalahan ketika mengolah gambar. Silakan periksa gambar yang Anda pilih')
                }
            })
        }
    }

    //receive all recently submitted pengeluarans from server for autocomplete component
    const getAllPengeluaranTypes = () => {
        axios({method: 'get', url: '/admin/totalizatorReport/getAllPengeluaranTypes'})
        .then(result => { //handle success response
            let data: OptionType[] = result.data;
            setPengeluaranTypes(data)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        });
    }

    const sendImage = (result: Blob) => {
        const formData = new FormData()
        formData.append('image',result,'image.jpeg')
        setUploading(true)
        setUploadError('')
        axios({
            method: 'post',
            url: '/admin/totalizatorReport/uploadBuktiPengeluaran',
            data: formData,
            onUploadProgress: (progressEvent) => console.log(progressEvent) //todo fix
        })
        .then(result => { //handle success response
            setUploadError('')
            setUploadSuccess(true)
            let data = result.data;
            setFileName(data)
            // setFileUrl(`/storage/temp/${data}`)
        })
        .catch(error =>{ //handle error response
            setUploadSuccess(false)
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
                //Error caused from the server
                let errorCode = error.response.status
                switch(errorCode){
                    case 422: {
                        errorMessage = error.response.data.errors.image[0]
                        break;
                    }
                }
            }
            setUploadError(errorMessage)
        })
        .finally(() => {
            setUploading(false)
        })
    }

    return (
        <div style={{zIndex: zIndexes.modalBackdrop}} className={`tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-h-screen ${props.show ? 'tw-grid' : 'tw-hidden'} tw-place-items-center tw-bg-black tw-bg-opacity-75`}>
            <PerfectScrollbar className="tw-w-screen tw-h-screen tw-grid tw-place-items-center tw-px-4">
                <div className="tw-max-w-screen-sm tw-w-full tw-bg-white tw-rounded-xl tw-py-4 tw-px-8 tw-flex tw-flex-col">
                    <h1 className="tw-text-center tw-text-xl tw-font-bold">{props.isEdit ? 'Edit' : 'Tambah'} Pengeluaran</h1>
                    <form onSubmit={handleSubmit} className="tw-flex tw-flex-col tw-gap-4">
                        <Autocomplete
                            options={pengeluaranTypes}
                            inputValue={pengeluaran}
                            color="secondary"
                            freeSolo
                            onInputChange={(event, newValue) => {setPengeluaran(newValue); setPengeluaranError('');}}
                            getOptionLabel={(option) => option.name}
                            ref={pengeluaranTypeRef}
                            renderInput={(params) => <TextField {...params} label="Jenis Pengeluaran" margin="normal" error={!!pengeluaranError} helperText={pengeluaranError} />}
                        />
                        <TextField
                            label="Biaya Pengeluaran"
                            value={amount ? amount : ''}
                            type="number"
                            error={!!amountError}
                            helperText={amountError}
                            fullWidth
                            onChange={(e) => {setAmount(+e.target.value); setAmountError('')}}
                            InputProps={{
                                startAdornment: <InputAdornment position="start" className="tw-text-black" disableTypography>Rp</InputAdornment>
                            }}
                        />
                        <div className="tw-px-3 tw-pt-4 tw-pb-3 tw-border tw-border-gray-500 tw-rounded-lg tw-relative tw-mt-3">
                            <span className="tw-absolute tw-left-2 tw--top-3 tw-px-2 tw-bg-white tw-text-sm tw-text-gray-500">Bukti Struk</span>
                            {/* todo: ambil gambar dari server yang misal edit */}
                            {fileName && <img src={fileUrl} alt="Bukti Struk" className="tw-mb-4"></img>}
                            <input accept="image/*" className="tw-hidden" id="modal-button-upload-file" type="file" onChange={e => handleChooseImage(e)} disabled={isUploading} />
                            <label htmlFor="modal-button-upload-file">
                                {
                                    isUploading ? <div className="tw-flex items-center">
                                        <CircularProgress size={20} /> <span className="tw-ml-3">Mengupload...</span>
                                    </div>
                                    : <Button variant="contained" color="primary" component="span" startIcon={<InsertPhotoIcon />} >
                                        Ambil Gambar
                                    </Button>
                                }
                            </label>
                            <p className="tw-text-red-500 tw-mt-2">{uploadError}</p>
                            {isUploadSuccess && <p className="tw-text-green-600 tw-mt-2">Berhasil diupload</p>}
                        </div>
                        <div className="tw-flex tw-justify-between">
                            <Button variant="outlined" color="secondary" disabled={isUploading} startIcon={<CloseIcon />} onClick={handleCloseModal}>Batal</Button>
                            <GreenButton startIcon={props.isEdit ? <EditIcon /> : <AddIcon />} disabled={isUploading} onClick={handleSubmit} type="submit">{props.isEdit? 'Edit' : 'Tambah'}</GreenButton>
                        </div>
                    </form>
                </div>
            </PerfectScrollbar>
        </div>
    )
}
