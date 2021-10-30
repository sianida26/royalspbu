import React from 'react'

import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router'

import { useAuth } from '../../../providers/AuthProvider'
import { useAdminConfig, requestPenerimaanDefaultObejct } from '../../../providers/AdminConfigProvider'

import Penerimaan from '../../../models/Penerimaan'
import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'

import { formatDate } from '../../../utils/helper'

interface ServerResponse {
    id: number,
    name: string,
}

export default function CreatePenerimaan() {

    let isEdit = location.pathname.split('/').pop()?.toLowerCase() === "edit"

    const history = useHistory()
    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()
    const {configs, setConfig} = useAdminConfig()

    const [isLoading, setLoading] = React.useState(true)
    const [id, setId] = React.useState(-1)
    const [tanks, setTanks] = React.useState<ServerResponse[]>([])
    const [selectedTank, setSelectedTank] = React.useState(-1)
    const [volume, setVolume] = React.useState(0)

    React.useEffect(() => {
        if (isEdit){
            //redirect to home if no data provided in context API
            if (configs.editRequestPenerimaanObject.isNotDefined()){
                history.replace('/');
                return
            }

            setId(configs.editRequestPenerimaanObject!.id)
            setSelectedTank(configs.editRequestPenerimaanObject!.tankId)
            setVolume(configs.editRequestPenerimaanObject!.volume)

            setConfig({editRequestPenerimaanObject: new Penerimaan()}) //hapus objek edit
        }
        requestAllTankNames()
    },[])

    const requestAllTankNames = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/tank/getAll?onlyName=true'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setTanks(data.map(tank => ({
                id: tank.id,
                name: tank.name,
            })))
            if (!isEdit) setSelectedTank(data[0].id)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    const handleSubmit = () => {

        axios({
            method: 'post', 
            url: `/admin/penerimaan/${isEdit? 'edit' : 'create'}`, 
            data: {
                id,
                tankId : selectedTank,
                volume
            }
        })
        .then(() => {
            history.goBack()
            enqueueSnackbar('Penerimaan berhasil dibuat', {variant: 'success'})
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
                    case 422: /*Validation failed*/ break;
                    case 429: /*Too Many Request */ break;
                    case 500: //server error
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
        })
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Penerimaan BBM" />

            <div className="tw-flex tw-flex-col tw-w-full tw-px-4 tw-mt-4">
                <p className="tw-text-right tw-italic tw-font-semibold">{formatDate(new Date(), 'eeee, dd MMMM yyyy')}</p>
                <span>nama tangki</span>
                <select 
                    className="tw-w-full tw-p-1 tw-border tw-border-gray-700 tw-rounded-lg" 
                    value={selectedTank}
                    // disabled={isSending || isRequesting}
                    onChange={(e) => setSelectedTank(+e.target.value)} 
                >
                    {
                        tanks.map(tank => <option key={tank.id} value={tank.id}>{tank.name}</option>)
                    }
                </select>
                <span className="tw-mt-4">Volume PNBP</span>
                <div className="tw-mt-1 tw-mb-4 tw-relative">
                    <input 
                        value={volume <= 0 ? "" : volume} 
                        type="number"
                        onChange={e => setVolume(+e.target.value)} 
                        className="tw-border-b tw-w-full tw-border-black focus:tw-outline-none tw-pr-7" />
                    <span className="tw-absolute tw-right-3">L</span>
                </div>

                <div className="tw-flex tw-justify-around tw-items-center">
                    <button className="btn-dense tw-border tw-border-red-500 tw-text-red-500" onClick={() => history.goBack()}>
                        <i className="bi bi-x-lg" />
                        <span>Batal</span>
                    </button>
                    <button className="btn-dense tw-border tw-bg-green-500 tw-text-white" onClick={handleSubmit}>
                        <i className="bi bi-minecart" />
                        <span>Buat Permintaan</span>
                    </button>
                    {/* <button className="tw-w-full tw-border tw-border-black tw-mt-2" onClick={handleSubmit}>Buat Permintaan</button> */}
                </div>
            </div>
        </div>
    )
}
