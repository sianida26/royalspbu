import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'


import axios from  '../../../utils/AdminAxios'
import {ProductObject, PumpObject} from '../../../types'

interface Nozzle {
    id: number,
    tankId: number,
    totalizator: number,
}

interface ServerResponse {
    id: number,
    nozzles: Nozzle[],
}

export default function Products() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()

    const {configs, setConfig} = useAdminConfig()

    const [pumps, setPumps] = useState<ServerResponse[]>([])
    const [isLoading, setLoading] = useState(true)

    const requestAllPumps = () => {
        setLoading(true)
        axios({method:'get', url: '/pump/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setPumps(data.map(pump => ({
                id: pump.id,
                nozzles: pump.nozzles
            })))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        requestAllPumps()
    },[])

    const handleEditPump = (pump: PumpObject) => {
        setConfig({editPumpObject: pump})
        history.push('/pompa/edit')
    }

    return (
        <div className="tw-flex tw-flex-col">
            {
                isLoading ? <span>Loading...</span>
                : pumps.length > 0 ? pumps.map((pump,i) => (
                    <div key={pump.id} className="tw-w-full tw-border tw-border-black tw-rounded-lg tw-p-4 tw-flex tw-flex-col" onClick={() => handleEditPump(pump)}>
                        <p>Nomor Pompa : {i+1}</p>
                    </div>
                ))
                : <span>Belum ada pompa</span>
            }
            <div className="tw-w-full tw-border tw-border-black tw-rounded-lg tw-p-4 tw-flex tw-flex-col" onClick={() => history.push('/pompa/tambah')}>
                Tambah pompa
            </div>
        </div>
    )
}
