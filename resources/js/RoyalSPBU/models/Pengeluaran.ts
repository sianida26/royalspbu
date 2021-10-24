import Tank from './Tank'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    id: number|string,
    reportFilename: string|null,
    imageUrl: string|null,
    name: string,
    amount: number
}

export default class Pengeluaran extends Model{

    properties: Properties = {
        id: -1,
        reportFilename: '',
        name: '',
        imageUrl: null,
        amount: 0,
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

    get amount(){
        return this.properties.amount
    }

    get name(){
        return this.properties.name
    }

    get reportFilename(){
        return this.properties.reportFilename
    }

    get id(){
        return this.properties.id
    }
}