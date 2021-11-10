import React from 'react'

import { useAuth } from '../../../providers/AuthProvider'

import { useSnackbar } from 'notistack'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'

export default function PersediaanReport() {

    const {axios} = useAuth()

    const {enqueueSnackbar} = useSnackbar()

    React.useEffect(() => {
        requestTanks()
    }, [])

    const requestTanks = () => {
        axios({method:'get', url: '/laporan-bulanan/getTanks'})
        .then(result => { //handle success response
            let data = result.data;
            
            console.log(data) //todo remove log
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
            //
        })
    }

    return (
        <div className="tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Catatan Persediaan BBM Bulanan" />
            <div className="tw-flex tw-flex-col tw-px-4 tw-py-8">
                <p>Pilih tangki</p>
                
                
            </div>
        </div>
    )
}
