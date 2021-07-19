import React from 'react'

import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router'

import { useAuth } from '../../../providers/AuthProvider'
import { useAdminConfig, requestPenerimaanDefaultObejct } from '../../../providers/AdminConfigProvider'

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
            if (configs.editRequestPenerimaanObject!.id < 0){
                history.replace('/');
                return
            }

            setId(configs.editRequestPenerimaanObject!.id)
            setSelectedTank(configs.editRequestPenerimaanObject!.tankId)
            setVolume(configs.editRequestPenerimaanObject!.volume)

            setConfig({editRequestPenerimaanObject: requestPenerimaanDefaultObejct}) //hapus objek edit
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
            console.log('created or edited.')
            //todo buat aksi tampilkan snackbar
        })
        .catch(() => {
            console.log('error')
            //todo buat aksi tampilkan snackbar
        })
    }

    return (
        <div className="tw-w-full tw-flex tw-p-2 tw-flex-col">
            <span>Ini nanti tanggal</span>
            <span>nama tangki</span>
            <select value={selectedTank} onChange={(e) => setSelectedTank(+e.target.value)}>
                {
                    tanks.map(tank => <option 
                        key={tank.id} 
                        value={tank.id}
                    >{tank.name}</option>)
                }
            </select>
            <span>Volume PNBP</span>
            <input 
                value={volume <= 0 ? "" : volume} 
                type="number"
                onChange={e => setVolume(+e.target.value)} 
                className="tw-border-b tw-w-full tw-border-black" />
            <button className="tw-w-full tw-border tw-border-black">Batal</button>
            <button className="tw-w-full tw-border tw-border-black tw-mt-2" onClick={handleSubmit}>Buat Permintaan</button>
        </div>
    )
}
