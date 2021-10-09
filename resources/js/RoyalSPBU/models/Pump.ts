import Nozzle, {Properties as NozzleProps} from './Nozzle'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    available: boolean, //available for reporting or not
    id: number,
    pumpNumber: number,
    nozzles: Nozzle[],
}

export default class Pump extends Model{

    properties: Properties = {
        available: false,
        id: -1,
        pumpNumber: 0,
        nozzles: [],
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

    inputNozzles(nozzles: Partial<NozzleProps>[]): void {
        this.nozzles = nozzles.map(nozzle => new Nozzle(nozzle))
    }

    getNozzlesProps(): NozzleProps[]{
        return this.nozzles.map(nozzle => nozzle.props)
    }

    get id(){
        return this.properties.id
    }

    get nozzles(): Nozzle[]{
        return this.properties.nozzles
    }

    get pumpNumber(){
        return this.properties.pumpNumber
    }

    get available(){
        return this.properties.available
    }

    set nozzles(_nozzles: Nozzle[]){
        this.properties = {
            ...this.properties,
            nozzles: _nozzles,
        }
    }
}