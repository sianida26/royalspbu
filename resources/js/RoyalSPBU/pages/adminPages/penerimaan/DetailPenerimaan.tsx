import React from 'react'

import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router'

import { useAuth } from '../../../providers/AuthProvider'
import { useAdminConfig, requestPenerimaanDefaultObejct, konfirmasiPenerimaanDefaultObejct, detailPenerimaanDefaultObject } from '../../../providers/AdminConfigProvider'

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

export default function DetailPenerimaan() {

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
        if (configs.detailPenerimaanObject!.id < 0){
            history.replace('/');
            return
        }
        updateFormData(configs.detailPenerimaanObject!)

        setConfig({detailPenerimaanObject: detailPenerimaanDefaultObject}) //hapus objek
    },[])

    const updateFormData = (newData: Penerimaan) => {
        setFormData(prev => ({
            ...prev,
            ...newData
        }))
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            <p>Hari/Tanggal Permintaan: {formData.issueTimestamp}</p>
            <p>Hari/Tanggal Penerimaan: {formData.receiveTimestamp}</p>
            <p>Pemohon: {formData.issuer}</p>
            <p>Penerima: {formData.receiver}</p>
            <p>Nama tangki: {formData.tankName}</p>
            <p>Volume PNBP: {formData.pnbpVolume}</p>
            <p>No Mobil Tangki: {formData.truckId}</p>
            <p>No PNBP: {formData.pnbp}</p>
            <p>Volume sebelum penerimaan: {formData.initialVolume}</p>
            <p>Volume penerimaan aktual: {formData.actualVolume}</p>
            <p>Selisih Volume: {(formData.actualVolume || 0) - (formData.initialVolume || 0)}</p>
        </div>
    )
}
