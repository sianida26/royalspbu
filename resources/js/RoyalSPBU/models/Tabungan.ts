import Tank from './Tank'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    amount: number,
    reportFilename: string,
}

export enum UploadStatus {
    NONE,
    COMPRESSING,
    UPLOADING,
    ERROR,
    UPLOADED,
}

export default class Tabungan extends Model{

    properties: Properties = {
        amount: 0,
        reportFilename: '',
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

    get reportFilename(){
        return this.properties.reportFilename
    }
}