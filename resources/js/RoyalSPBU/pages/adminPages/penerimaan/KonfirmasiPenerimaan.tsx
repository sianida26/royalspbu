import React from 'react'

import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router'

import { useAuth } from '../../../providers/AuthProvider'
import { useAdminConfig, requestPenerimaanDefaultObejct, konfirmasiPenerimaanDefaultObejct } from '../../../providers/AdminConfigProvider'

interface Penerimaan{
    actualVolume? : number,
    id?: number,
    initialVolume? : number,
    issueTimestamp?: string,
    issuer?: string,
    pnbp?: string,
    pnbpVolume?: number,
    receiveTimestamp?: string,
    receiver?: string,
    tankId?: number,
    tankName?: string,
    truckId?: string
}

export default function KonfirmasiPenerimaan() {

    const history = useHistory()
    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()
    const {configs, setConfig} = useAdminConfig()

    const [isLoading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState<Penerimaan>({
        actualVolume: 0,
        id: -1,
        initialVolume: 0,
        issueTimestamp: '',
        issuer: '-',
        pnbp: '',
        pnbpVolume: 0,
        receiveTimestamp: '',
        receiver: '',
        tankId: 0,
        tankName: '',
        truckId: '',
    })

    React.useEffect(() => {

        //redirect to home if no data provided in context API
        if (configs.konfirmasiPenerimaanObject!.id < 0){
            history.replace('/');
            return
        }
        updateFormData(configs.konfirmasiPenerimaanObject!)

        setConfig({konfirmasiPenerimaanObject: konfirmasiPenerimaanDefaultObejct}) //hapus objek
    },[])

    const handleSubmit = () => {
        setLoading(true)
        axios({
            method: 'post',
            url: '/admin/penerimaan/confirm',
            data: formData
        })
        .then((response) => {
            console.log(response)
            history.replace('/penerimaan')
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const updateFormData = (newData: Penerimaan) => {
        setFormData(prev => ({
            ...prev,
            ...newData
        }))
    }

    const handleFormChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            <p>Pemohon: {formData.issuer}</p>
            <p>Hari/tanggal: {formData.issueTimestamp}</p>
            <p>Nama Tangki: {formData.tankName}</p>
            <p>Volume PNBP: {formData.pnbpVolume}</p>
            <p>-----</p>
            <p>Penerimaan</p>
            <p>No Mobil tangki</p>
            <input value={formData.truckId} onChange={(e) => handleFormChange('truckId',e.target.value)} />
            <p>No PNBP</p>
            <input value={formData.pnbp} onChange={(e) => handleFormChange('pnbp',e.target.value)} />
            <p>Volume sebelum penerimaan</p>
            <input value={formData.initialVolume} onChange={(e) => handleFormChange('initialVolume', e.target.value)} type="number" />
            <p>Volume penerimaan aktual</p>
            <input value={formData.actualVolume} onChange={(e) => handleFormChange('actualVolume', e.target.value)} type="number" />
            <p>Selisih volume: {(formData.actualVolume || 0) - (formData.pnbpVolume || 0)} L</p>
            <button onClick={() => history.goBack()}>Batal</button>
            <button onClick={handleSubmit}>Simpan</button>
        </div>
    )
}
