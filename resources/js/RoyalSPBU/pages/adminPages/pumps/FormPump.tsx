import React, {useState, useEffect} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'

import { useAdminConfig } from '../../../providers/AdminConfigProvider'
import { useAuth } from '../../../providers/AuthProvider'

import Tank from '../../../models/Tank'
import Pump from '../../../models/Pump'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import Spinner from '../../../components/Spinner'
import ModalDeletePump from '../../../components/modals/ModalDeletePump'

interface TankServerResponse {
    tanks: {
        id: number,
        name: string,
        productId: number,
        product: string,
        stock: number,   
    }[]
}

interface FormData {
    id: number,
    nozzles: {
        id: number,
        tankId: number | null,
        totalizator: number,
    }[]
}

const defaultForm: FormData = {
    id: -1,
    nozzles: [],
}

//TODO: buat tampilan tidak ada nozzle

export default function FormPump() {

    let isEdit = location.pathname.split('/').pop()?.toLowerCase() === "edit"
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {configs, setConfig} = useAdminConfig()
    const {axios} = useAuth()

    const [isRequesting, setRequesting] = useState(true)
    const [isSending, setSending] = useState(false)
    const [formData, setFormData] = useState<FormData>(defaultForm)
    const [tanks, setTanks] = useState<Tank[]>([])
    const [currentPump, setCurrentPump] = useState(new Pump())
    const [showModalDelete, setShowModalDelete] = useState(false)

    useEffect(() => {
        requestAllTanks()
        //validating data if in edit mode
        if (isEdit){
            //redirect to home if no data provided in context API
            if (configs.editPumpObject.isNotDefined()){
                history.replace('/');
                return
            }

            setFormData({
                id: configs.editPumpObject.id,
                nozzles: configs.editPumpObject.getNozzlesProps()
            })
            setCurrentPump(configs.editPumpObject)

            setConfig({editPumpObject: new Pump()}) //hapus objek edit
        }
    }, [])

    const handleAddNozzle = () => {
        setFormData(prev => ({
            ...prev,
            nozzles: [
                ...prev.nozzles,
                {
                    id: -1,
                    tankId: tanks[0].id,
                    totalizator: 0,
                }
            ]
        }))
    }

    const handleFormChange = (n: number, name: string, value: string|number) => {
        setFormData(prev => ({
            ...prev,
            nozzles: prev.nozzles.map((nozzle, i) => {
                if (i !== n) return nozzle
                return {
                    ...nozzle,
                    [name]: value,
                }
            })
        }))
    }

    const handleDeleteNozzle = (n: number) => {
        setFormData(prev => ({
            ...prev,
            nozzles : prev.nozzles.filter((nozzle,i) => i !== n)
        }))
    }

    const handleDeletePump = () => {
        setShowModalDelete(true)
    }

    const handleCloseModal = () => {
        setShowModalDelete(false)
    }

    const handleFinishDelete = () => {
        history.replace('/pompa')
        handleCloseModal()
    }

    const handleSave = () => {
        setSending(true)
        axios({method:'post', url: isEdit?  '/admin/pump/edit' :'/admin/pump/add', data: formData})
        .then(() => { //handle success response
            // setFormErrors({}) todo: set form errors
            enqueueSnackbar(`Pompa berhasil di${isEdit? 'edit' : 'tambahkan'}`,{variant: 'success'})
            history.push('/pompa');
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
        .finally(() => setSending(false))
    }

    const requestAllTanks = () => {
        setRequesting(true)
        axios({method:'get', url: '/admin/tank/getAll'})
        .then(result => { //handle success response
            let data : TankServerResponse = result.data;
            setTanks(data.tanks.map(tank => new Tank({
                id: tank.id,
                name: tank.name,
            })))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setRequesting(false))
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            <AdminHeaderSidebar title="Pulau Pompa" />
            <div 
                className="tw-w-full tw-p-4 tw-flex tw-items-center tw-justify-center tw-flex-col"
            >

                {/* form card */}
                <div 
                    className="tw-w-full tw-max-w-screen-sm tw-rounded-md tw-flex tw-flex-col tw-pb-4"
                    style={{boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"}}
                >
                    {/* card header */}
                    <div className="tw-py-3 tw-grid tw-place-items-center tw-bg-primary-700 tw-rounded-t-md tw-mb-2">
                        <span className="tw-font-medium tw-text-white">Pulau Pompa {isEdit ? currentPump.pumpNumber : 'Baru'}</span>
                    </div>
                    
                    {/* nozzle list */}
                    <div className={`tw-px-4 tw-flex tw-flex-col tw-gap-4 tw-py-2 ${isSending && 'tw-opacity-70'}`}>
                        {
                            formData.nozzles.map((nozzle,i) => {

                                return (
                                    <div className="tw-flex tw-gap-2 tw-items-center" key={i}>
                                        <div className="tw-grid tw-grid-cols-2 tw-gap-2 tw-w-full">

                                            {/* product */}
                                            <div className="tw-flex tw-flex-col tw-w-full">
                                                <p>Nozzle {i+1}</p>
                                                {
                                                    isRequesting ? <div className="tw-w-full tw-rounded-lg tw-animate-pulse tw-bg-gray-400 tw-h-8" />
                                                    : <select 
                                                        className="tw-w-full tw-p-1 tw-border tw-border-gray-700 tw-rounded-lg" 
                                                        value={nozzle.tankId!} 
                                                        disabled={isSending || isRequesting}
                                                        onChange={(e) => handleFormChange(i,"tankId",+e.target.value)} 
                                                    >
                                                        {
                                                            tanks.map(tank => <option key={tank.id} value={tank.id}>{tank.name}</option>)
                                                        }
                                                    </select>
                                                }
                                            </div>

                                            {/* totalizator */}
                                            <div className="tw-flex tw-flex-col tw-w-full">
                                                <p>Totalizator</p>
                                                {
                                                    isRequesting ? <div className="tw-w-full tw-rounded-lg tw-animate-pulse tw-bg-gray-400 tw-h-8" />
                                                    : <input 
                                                        className="tw-border tw-border-gray-700 tw-rounded-lg tw-px-1 tw-w-full" 
                                                        type="number" 
                                                        disabled={isSending || isRequesting}
                                                        value={nozzle.totalizator} 
                                                        onChange={(e) => handleFormChange(i,"totalizator",e.target.value)} 
                                                        style={{paddingTop:'3px', paddingBottom:'2px'}}
                                                    />
                                                }
                                            </div>
                                        </div>

                                        <i className={`bi bi-trash2-fill ${isRequesting ? 'tw-animate-pulse tw-text-gray-400' : 'tw-text-red-500'} tw-relative tw-top-3`} onClick={isSending || isRequesting ? undefined : () => handleDeleteNozzle(i)} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="tw-grid tw-place-content-center tw-mt-4">
                        <button 
                            className={`${isRequesting? 'tw-animate-pulse tw-bg-gray-400' : 'tw-bg-orange-500'} ${isSending && 'tw-opacity-70'} tw-rounded-md tw-text-white tw-py-2 tw-px-3 tw-flex tw-gap-2 tw-items-center`} 
                            disabled={isRequesting || isSending}
                            onClick={handleAddNozzle}
                        >
                            <i className={`bi bi-plus-circle-fill ${isRequesting && 'tw-invisible'}`} />
                            <span className={`tw-font-semibold ${isRequesting && 'tw-invisible'}`}>Tambah Nozzle</span>
                        </button>
                    </div>
                </div>

                {/* actions */}
                <div className="tw-flex tw-justify-around tw-mt-8 tw-w-full tw-max-w-screen-sm">
                    <button 
                        className={`${isRequesting? 'tw-animate-pulse tw-bg-gray-400' : 'tw-border tw-border-red-500 tw-text-red-500'} ${!isEdit && 'tw-hidden'} ${isSending && 'tw-opacity-70'} tw-flex tw-gap-2 tw-items-center tw-px-3 tw-py-2 tw-rounded-lg`} 
                        disabled={isRequesting || isSending}
                        onClick={handleDeletePump}
                    >
                        <i className={`bi bi-x-lg ${isRequesting && 'tw-invisible'}`} />
                        <span className={`${isRequesting && 'tw-invisible'}`}>Hapus Pompa</span>
                    </button>
                    <button 
                        className={`${isRequesting? 'tw-animate-pulse tw-bg-gray-400' : 'tw-border tw-bg-green-500'} ${isSending && 'tw-opacity-70'} tw-text-white tw-flex tw-gap-2 tw-items-center tw-px-3 tw-py-2 tw-rounded-lg`}
                        disabled={isRequesting || isSending}
                        onClick={handleSave}
                    >
                        {
                            isSending ? <>
                                <Spinner />
                                <span>Menyimpan...</span>
                            </>
                            : <>
                                <i className={`bi bi-check2-circle ${isRequesting && 'tw-invisible'}`} />
                                <span className={`${isRequesting && 'tw-invisible'}`}>Simpan</span>
                            </>
                        }
                    </button>
                </div>
            </div>

            <ModalDeletePump show={showModalDelete} pump={currentPump} onFinished={handleFinishDelete} onClose={handleCloseModal} />
        </div>
    )
}
