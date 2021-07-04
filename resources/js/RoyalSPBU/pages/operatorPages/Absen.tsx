import React from 'react'

import QRCode from 'react-qr-code'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../providers/AuthProvider'

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

    return (
        <div className="tw-flex tw-flex-col tw-p-5">
            {
                loading? <div>Loading QR code</div> : 
                <div>
                    <QRCode value={token} level="H"></QRCode>
                    <span>{token}</span>
                </div>
            }
        </div>
    )
}
