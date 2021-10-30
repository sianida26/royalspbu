import React from 'react'

import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router'

import { useAuth } from '../../../providers/AuthProvider'
import { useAdminConfig, requestPenerimaanDefaultObejct, konfirmasiPenerimaanDefaultObejct } from '../../../providers/AdminConfigProvider'
import Penerimaan from '../../../models/Penerimaan'
import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import Spinner from '../../../components/Spinner'
import {numberWithCommas} from '../../../utils/helper'

interface FormError{
    id?: string[],
    truckId?: string[],
    pnbp?: string[],
    initialVolume?: string[],
    actualVolume?: string[],
}

export default function KonfirmasiPenerimaan() {

    let isEdit = location.pathname.split('/').pop()?.toLowerCase() === "edit"
    const history = useHistory()
    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()
    const {configs, setConfig} = useAdminConfig()

    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState<FormError>({})
    const [truckId, setTruckId] = React.useState('')
    const [pnbp, setPnbp] = React.useState('')
    const [initialVolume, setInitialVolume] = React.useState(0)
    const [actualVolume, setActualVolume] = React.useState(0)
    const [penerimaan, setPenerimaan] = React.useState(new Penerimaan())

    React.useEffect(() => {

        if (isEdit){
            if (configs.editFinishedPenerimaanObject.isNotDefined()){
                history.replace('/');
                return
            }
            setPenerimaan(configs.editFinishedPenerimaanObject)
            setTruckId(configs.editFinishedPenerimaanObject.truckId)
            setPnbp(configs.editFinishedPenerimaanObject.pnbp)
            setInitialVolume(configs.editFinishedPenerimaanObject.initialVolume)
            setActualVolume(configs.editFinishedPenerimaanObject.actualVolume)
            setConfig({editFinishedPenerimaanObject: new Penerimaan()})
        }

        else {
            //redirect to home if no data provided in context API
            if (configs.konfirmasiPenerimaanObject.isNotDefined()){
                history.replace('/');
                return
            }
            setPenerimaan(configs.konfirmasiPenerimaanObject)

            setConfig({konfirmasiPenerimaanObject: new Penerimaan()}) //hapus objek
        }
    },[])

    const handleSubmit = () => {
        setLoading(true)
        axios({
            method: 'post',
            url: '/admin/penerimaan/confirm',
            data: {
                id: penerimaan.id,
                truckId, pnbp, initialVolume, actualVolume
            }
        })
        .then((response) => {
            enqueueSnackbar(`Laporan berhasil di${isEdit? 'edit':'tambahkan'}`, {variant: 'success'})
            history.replace('/penerimaan')
        })
        .catch((error) => {
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
                    case 422: { 
                        setErrors(error.response.data.errors)
                        break;
                    }
                    case 429: /*Too Many Request */ break;
                    case (Math.floor(errorCode/100) === 5): //server error
                        errorMessage=`Ups. Terjadi error di dalam server. silakan coba lagi nanti (${errorCode})`;
                        break; 
                    default: /* Other errors */
                        errorMessage=`Ups. terjadi error (${errorCode})`;
                }
            } else if (error.request){
                //Request was made but no response was received
            } else {
                //Something happened in setting up the request that triggered an Error
            }
            //you can show error notification here
            if (errorMessage) enqueueSnackbar(errorMessage,{variant:"error"});
            // setErrors(err)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-bg-gray-50">
            <AdminHeaderSidebar title="Penerimaan BBM" />
            <div className="tw-w-full tw-flex tw-flex-col tw-px-4">
                <p>Pemohon: <b>{penerimaan.issuer}</b></p>
                <p>Hari/tanggal: <b>{penerimaan.getFormattedIssueTimestamp()}</b></p>
                <p>Nama Tangki: <b>{penerimaan.tankName}</b></p>
                <p>Volume PNBP: <b>{numberWithCommas(penerimaan.pnbpVolume)} L</b></p>
                
                {/* card */}
                <div className="tw-w-full tw-rounded-lg tw-bg-white tw-px-4 tw-py-2 tw-mt-4 tw-flex tw-flex-col tw-gap-4" style={{boxShadow: '2px 3px 4px rgba(0, 0, 0, 0.25)'}}>
                    <h1 className="tw-text-lg tw-font-bold">Penerimaan</h1>

                    {/* plat mobil */}
                    <div className="tw-flex tw-gap-4 tw-w-full tw-items-center">
                        <p className="tw-w-36 tw-flex-shrink-0">No Mobil Tangki</p>
                        <div className="tw-w-ful tw-flex tw-flex-col">
                            <input 
                                value={truckId} 
                                onChange={(e) => setTruckId(e.target.value)} 
                                className={`${loading && 'tw-opacity-75'} ${errors.truckId? 'tw-border-2 tw-border-red-500' : 'tw-border tw-border-black'}  tw-py-1 tw-px-2 tw-w-full tw-min-w-0 tw-rounded-md focus:tw-outline-none`}
                                />
                            <span className="tw-text-red-500 tw-font-semibold">{errors.truckId && errors.truckId[0]}</span>
                        </div>
                    </div>

                    {/* no. pnbp */}
                    <div className="tw-flex tw-gap-4 tw-w-full tw-items-center">
                        <p className="tw-w-36 tw-flex-shrink-0">No PNBP</p>
                        <div className="tw-w-ful tw-flex tw-flex-col">
                            <input 
                                value={pnbp}
                                onChange={(e) => setPnbp(e.target.value)} 
                                className={`${loading && 'tw-opacity-75'} ${errors.pnbp? 'tw-border-2 tw-border-red-500' : 'tw-border tw-border-black'}  tw-py-1 tw-px-2 tw-w-full tw-min-w-0 tw-rounded-md focus:tw-outline-none`}
                                />
                            <span className="tw-text-red-500 tw-font-semibold">{errors.pnbp && errors.pnbp[0]}</span>
                        </div>
                        
                    </div>

                    {/* volume sebelum penerimaan */}
                    <div className="tw-flex tw-gap-4 tw-w-full tw-items-center">
                        <p className="tw-w-36 tw-flex-shrink-0">Volume sebelum penerimaan</p>
                        <div className="tw-w-ful tw-flex tw-flex-col">
                            <div className={`${loading && 'tw-opacity-75'} tw-w-full tw-relative`}>
                                <input 
                                    value={initialVolume}
                                    onChange={(e) => setInitialVolume(+e.target.value)} 
                                    type="number"
                                    className={`${errors.initialVolume? 'tw-border-2 tw-border-red-500' : 'tw-border tw-border-black'} tw-py-1 tw-pl-2 tw-pr-8 tw-w-full tw-min-w-0 tw-rounded-md focus:tw-outline-none`}
                                />
                                <div className={`tw-absolute tw-rounded-r-md tw-h-full tw-px-2 tw-right-0 tw-bottom-0 tw-text-white tw-border-t tw-border-r tw-border-b ${errors.actualVolume? 'tw-border-red-500 tw-bg-red-500' : 'tw-border-black tw-bg-primary-600'} tw-grid tw-place-items-center`}>
                                    <span>L</span>
                                </div>
                            </div>

                            <span className="tw-text-red-500 tw-font-semibold">{errors.initialVolume && errors.initialVolume[0]}</span>
                        </div>
                    </div>

                    {/* volume aktual */}
                    <div className="tw-flex tw-gap-4 tw-w-full tw-items-center">
                        <p className="tw-w-36 tw-flex-shrink-0">Volume setelah penerimaan</p>
                        <div className="tw-w-ful tw-flex tw-flex-col">
                            <div className={`${loading && 'tw-opacity-75'} tw-w-full tw-relative`}>
                                <input 
                                    value={actualVolume}
                                    onChange={(e) => setActualVolume(+e.target.value)} 
                                    type="number"
                                    className={`${errors.actualVolume? 'tw-border-2 tw-border-red-500' : 'tw-border tw-border-black'} tw-py-1 tw-pl-2 tw-pr-10 tw-w-full tw-min-w-0 tw-rounded-md focus:tw-outline-none`}
                                />
                                <div className={`tw-absolute tw-rounded-r-md tw-h-full tw-px-2 tw-right-0 tw-bottom-0  tw-text-white tw-border-t tw-border-r tw-border-b ${errors.actualVolume? 'tw-border-red-500 tw-bg-red-500' : 'tw-border-black tw-bg-primary-600'} tw-grid tw-place-items-center`}>
                                    <span>L</span>
                                </div>
                            </div>

                            <span className="tw-text-red-500 tw-font-semibold">{errors.actualVolume && errors.actualVolume[0]}</span>
                        </div>
                    </div>

                    {/* selisih volume */}
                    <div className="tw-flex tw-gap-4 tw-w-full tw-items-center">
                        <p className="tw-w-36 tw-flex-shrink-0">Selisih volume</p>
                        <p className="tw-text-right tw-w-full tw-font-semibold">{numberWithCommas((actualVolume - initialVolume) - penerimaan.pnbpVolume)} L</p>
                    </div>
                </div>

                <div className="tw-w-full tw-flex tw-justify-around tw-items-stretch tw-mt-4">
                    <button className={`${loading && 'tw-opacity-75'} btn-dense tw-border-red-500 tw-text-red-500 tw-border`} onClick={() => history.goBack()}>
                        <i className="bi bi-x-lg" />
                        <span>Batal</span>
                    </button>
                    <button className={`${loading && 'tw-opacity-75'} btn-dense tw-bg-primary-500 tw-text-white tw-py-2`} onClick={handleSubmit}>
                        {loading ? <Spinner /> : <i className="bi bi-minecart-loaded" />}
                        <span>{loading ? 'Menyimpan...' : 'Simpan'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
