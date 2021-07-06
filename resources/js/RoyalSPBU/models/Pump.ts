import Nozzle, { INozzleData } from './Nozzle'

interface IPumpData {
    id? : number,
    available? : boolean,
    nozzles? : Nozzle[]
}

interface PumpData {
    id: number,
    available: boolean,
    nozzles: Nozzle[]
}

export default class Pump {
    
    // public id: number = -1
    private _data: PumpData = {
        id: -1,
        available: false,
        nozzles: []
    }

    constructor(data: IPumpData = {}){
        this._data = {
            ...this._data,
            ...data
        }
    }

    
    public get data() : PumpData {return this._data}
    public get id() : number {return this._data.id}
    public get nozzles() : Nozzle[]{return this._data.nozzles}
    

    public set data(v : IPumpData) {
        this._data = {
            ...this._data,
            ...v
        };
    }

    //helpers
    public setNozzleData(id: number, data: INozzleData): Pump{
        let exists = false
        let i = 0
        while (!exists && i < this._data.nozzles.length){
            let nozzle = this._data.nozzles[i]
            if (nozzle.id == id){
                exists = true
                this._data.nozzles[i].data = data
            }
        }
        return this
    }
}