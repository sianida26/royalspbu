import Pump from './Pump'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    id: number,
    pump: Pump,
}

export default class DailyPumpReport extends Model{

    properties: Properties = {
        id: -1,
        pump: new Pump(),
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

    getRevenue(): number{
        return this.properties.pump.nozzles.reduce((prev, current) => {
            return prev+current.getRevenue()
        }, 0)
    }

    get id(){
        return this.properties.id
    }

    get pump(){
        return this.properties.pump
    }
}