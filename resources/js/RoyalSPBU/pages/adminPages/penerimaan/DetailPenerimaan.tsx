import React from 'react'

import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router'

import { useAuth } from '../../../providers/AuthProvider'
import { useAdminConfig, requestPenerimaanDefaultObejct, konfirmasiPenerimaanDefaultObejct, detailPenerimaanDefaultObject } from '../../../providers/AdminConfigProvider'
import Penerimaan from '../../../models/Penerimaan'
import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import {numberWithCommas} from '../../../utils/helper'


export default function DetailPenerimaan() {

    const history = useHistory()
    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()
    const {configs, setConfig} = useAdminConfig()

    const [isLoading, setLoading] = React.useState(false)
    const [data, setData] = React.useState<Penerimaan>(new Penerimaan())

    React.useEffect(() => {

        //redirect to home if no data provided in context API
        if (configs.detailPenerimaanObject.isNotDefined()){
            history.replace('/');
            return
        }
        setData(configs.detailPenerimaanObject)

        setConfig({detailPenerimaanObject: new Penerimaan()}) //hapus objek
    },[])

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            <AdminHeaderSidebar title="Penerimaan BBM" />

            <div className="tw-flex tw-flex-col tw-gap-2 tw-divide-y tw-px-4 tw-mt-4">
                {
                    [
                        ['Hari/Tanggal Permintaan', data.getFormattedIssueTimestamp()],
                        ['Hari/Tanggal Penerimaan', data.getFormattedReceiveTimestamp()],
                        ['Pemohon', data.issuer],
                        ['Penerima', data.receiver],
                        ['Nama tangki', data.tankName],
                        ['Volume PNBP', numberWithCommas(data.pnbpVolume)+" L"],
                        ['No Mobil Tangki', data.truckId],
                        ['No PNBP', data.pnbp],
                        ['Volume sebelum penerimaan', numberWithCommas(data.initialVolume)+" L"],
                        ['Volume penerimaan aktual', numberWithCommas(data.actualVolume)+" L"],
                        ['Selisih volume', numberWithCommas(data.getVolumeDiff())+" L"]
                    ].map((item, i) => <div key={i} className="tw-flex tw-w-full tw-items-center">
                        <p className="tw-w-40 tw-flex-shrink-0">{item[0]}</p>
                        <p className="tw-w-full tw-font-semibold tw-text-right">{item[1]}</p>
                    </div>)
                }
            </div>
        </div>
    )
}
