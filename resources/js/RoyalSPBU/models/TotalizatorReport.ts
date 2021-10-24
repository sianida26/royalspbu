import Penerimaan from './Penerimaan'
import Pengeluaran from './Pengeluaran'
import Penjualan from './Penjualan'
import Tabungan from './Tabungan'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    penerimaans: Penerimaan[],
    pengeluarans: Pengeluaran[],
    penjualans: Penjualan[],
    reporter: string,
    date: Date,
    tabungan?: Tabungan,
}

export default class TotalizatorReport extends Model{

    properties: Properties = {
        penerimaans: [],
        pengeluarans: [],
        penjualans: [],
        reporter: '',
        tabungan: undefined,
        date: new Date(),
    }

    constructor(props?: Partial<Properties>){
        super()
        if (props === undefined) return
        this.properties = {
            ...this.properties,
            ...props,
        }
        this._isDefined = true
    }

    getNetIncome(): number{
        return this.getGrossIncome() - this.getTotalExpenses()
    }

    getGrossIncome(): number{
        return this.properties.penjualans.reduce((accumulator, currentValue) => accumulator+currentValue.getIncome(), 0)
    }

    getTotalExpenses(): number{
        return this.properties.pengeluarans.reduce((accumulator, currentValue) => accumulator+currentValue.amount, 0)
    }

    get reporter(){
        return this.properties.reporter
    }

    get penerimaans(){
        return this.properties.penerimaans
    }

    get penjualans(){
        return this.properties.penjualans
    }

    get pengeluarans(){
        return this.properties.pengeluarans
    }

    get tabungan(){
        return this.properties.tabungan
    }

    get date(){
        return this.properties.date
    }
}