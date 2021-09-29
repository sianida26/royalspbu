import Nozzle, {Properties as NozzleProps} from './Nozzle'

interface Properties {
    id: number,
    pumpNumber: number,
    nozzles: Nozzle[],
}

export default class Pump{

    private _isDefined = false

    private properties: Properties = {
        id: -1,
        pumpNumber: 0,
        nozzles: [],
    }

    constructor(props?: Partial<Properties>){
        if (props === undefined) return
        this.properties = {
            ...this.properties,
            ...props,
        }
        this._isDefined = true
    }

    isDefined(): boolean {
        return this._isDefined
    }

    isNotDefined(): boolean{
        return !this._isDefined
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

    get nozzles(){
        return this.properties.nozzles
    }

    get pumpNumber(){
        return this.properties.pumpNumber
    }

    set nozzles(_nozzles: Nozzle[]){
        this.properties = {
            ...this.properties,
            nozzles: _nozzles,
        }
    }
}