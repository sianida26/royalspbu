import Tank from './Tank'

export interface Properties {
    id: number,
    tankId: number | null,
    totalizator: number,
}

export default class Nozzle{

    private _isDefined = false

    private properties: Properties = {
        id: -1,
        tankId: null,
        totalizator: 0,
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

    get id(){
        return this.properties.id
    }

    get tankId(){
        return this.properties.tankId
    }

    get totalizator(){
        return this.properties.totalizator
    }

    get props(){
        return this.properties
    }
}