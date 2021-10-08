import React from 'react'

import QRCode from 'react-qr-code'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../providers/AuthProvider'
import OperatorHeader from '../../components/OperatorHeader'

export default function Absen() {

    const {enqueueSnackbar} = useSnackbar()
    const {axios} = useAuth()

    const [loading, setLoading] = React.useState(true)
    const [token, setToken] = React.useState('')

    React.useEffect(() => {
        requestPresenceToken()
    },[])

    const requestPresenceToken = () => {
        setLoading(true)
        axios({method:'get', url: '/getPresenceToken'})
        .then(result => { //handle success response
            let data = result.data;
            setToken(data.token)
            console.log(data) //todo: clear console
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    //TODO: handle error

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-h-screen tw-justify-center tw-w-screen">
            {/* {
                loading? <div>Loading QR code</div> : 
                <div>
                    <QRCode value={token} level="H"></QRCode>
                    <span>{token}</span>
                </div>
            } */}

            <OperatorHeader title="Presensi" />

            <div className="tw-flex tw-flex-col tw-w-full tw-flex-grow tw-items-center tw-justify-center tw-bg-gray-50">

                {/* card qr */}
                <div className="tw-bg-white tw-w-80 tw-shadow-md tw-my-10 tw-rounded-2xl tw-items-center tw-py-6 tw-px-6">
                    <span className="tw-font-medium tw-text-gray-600 tw-text-md tw-text-center tw-mx-1">
                        Gunakan kode QR ini untuk presensi
                    </span>
                    <div className="tw-flex tw-items-center tw-justify-center tw-my-5 tw-h-72 tw-text-center tw-font-semibold tw-text-2xl">
                        {
                            loading ? <div className="tw-bg-gray-400 tw-animate-pulse tw-h-64 tw-w-64" />
                            : <QRCode value={token} level="H" />
                        }
                    </div>
                    <div className="tw-w-full tw-flex tw-justify-center">
                        {
                            loading ? <span className="tw-rounded-lg tw-h-5 tw-w-24 tw-bg-gray-400 tw-animate-pulse" />
                            : <p className="tw-text-center tw-text-lg tw-font-semibold tw-tracking-widest">{token}</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
