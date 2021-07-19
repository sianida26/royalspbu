import React from 'react'

import {useHistory} from 'react-router'

import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'

interface Report {
    createdAt : string,
    editable: boolean,
    id: number,
    income: number,
    nozzles: Nozzle[],
    pumpId: number,
    pumpNumber: number,
    reporter: string,
}

interface Nozzle {
    price: number,
    productName: string,
    reportFilename: string,
    totalizatorFinal: number,
    totalizatorInitial: number,
}

export default function PompaHarian() {

    const history = useHistory()
    const {axios} = useAuth()

    const [reports, setReports] = React.useState<Report[]>([])
    const [loading, setLoading] = React.useState(true)
    const {configs, setConfig} = useAdminConfig()

    React.useEffect(() => {
        setLoading(true)
        axios({method: 'get', url: '/admin/dailyPumpReport/all'})
        .then(response => {
            let data : Report[] = response.data
            setReports(data)
            console.log(response.data)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
    },[])

    const handleReportClick = (report: Report) => {
        setConfig({
            pumpReportObejct: report
        })
        history.push('/laporan/pompa-harian/detail')
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col">
            {
                loading? <div>Loading...</div>
                : reports.length < 1 ? <div>Tidak ada data</div>
                : <div className="tw-w-full tw-flex tw-flex-col">
                    {
                        reports.map(report => (
                            <div className="tw-w-full tw-p-2 tw-border tw-border-black tw-my-2" key={report.id} onClick={()=>handleReportClick(report)}>
                                <p>Tanggal: {report.createdAt}</p>
                                <p>Pelapor: {report.reporter}</p>
                                <p>Nomor pompa: {report.pumpNumber}</p>
                                <p>Pemasukan pompa: {report.income}</p>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}
