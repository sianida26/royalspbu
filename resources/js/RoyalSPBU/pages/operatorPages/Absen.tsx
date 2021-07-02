import React from 'react'

import QRCode from 'react-qr-code'
import { useSnackbar } from 'notistack'

import axios from '../../utils/OperatorAxios'

export default function Absen() {

    const {enqueueSnackbar} = useSnackbar()

    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        requestPresenceToken()
    },[])

    const requestPresenceToken = () => {
        axios({method:'get', url: '/getPresenceToken'})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data) //todo: clear console
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        });
    }

    return (
        <div>
            <QRCode value={"hei"}></QRCode>
            <span>Ini nanti text qr code nya</span>
        </div>
    )
}
