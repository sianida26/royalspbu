import React from 'react'

import Tank from '../../../models/Tank'

import { useAuth } from '../../../providers/AuthProvider'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'

import { useSnackbar } from 'notistack'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'

import moment from 'moment'


interface TankFromServer {
    id: number,
    name: string,
}

export default function PersediaanReport() {

    const {axios} = useAuth()

    const {enqueueSnackbar} = useSnackbar()
    const {configs, setConfig} = useAdminConfig()

    const [tanks, setTanks] = React.useState<Tank[]>([])
    const [loading, setLoading] = React.useState(false)

    //TODO create error flag and display it

    React.useEffect(() => {
        requestTanks()
    }, [])

    const requestTanks = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/persediaanReport/getTanks'})
        .then(result => { //handle success response
            let data: TankFromServer[] = result.data;
            setTanks(data.map(tank => new Tank({id: tank.id, name: tank.name})))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
                //Error caused from the server
                console.log(error.response) //todo remove log
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
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const handleClickTank = (tank: Tank) => {
        
        //open link /pdf/persediaanReport with parameter m as month with year, and t as tank id.
        let url = `/pdf/persediaanReport?m=${moment(configs.persediaanReportDate).format('MM-YYYY')}&t=${tank.id}`
        window.open(url, '_blank')?.focus() //opens file in new tab
    }

    return (
        <div className="tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Catatan Persediaan BBM Bulanan" />
            <div className="tw-flex tw-flex-col tw-px-4 tw-py-8">
                <p>Pilih tangki</p>
                
                {
                    //show loading if request is still processing
                    loading ? <div className="">Loading...</div> :
                    <div className="tw-flex tw-flex-col tw-gap-2">
                        {
                            tanks.map(tank => (
                                <div 
                                    key={tank.id} 
                                    onClick={() => handleClickTank(tank)}
                                    className={`tw-border-2 tw-border-primary-500 tw-px-4 tw-py-2 tw-text-lg tw-font-bold tw-rounded-lg`} 
                                >
                                    <div className="tw-flex-1 tw-text-left tw-text-gray-600">{tank.name}</div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}
