import Tank from './Tank'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    tank: Tank,
    volume: number,
    actualVolume: number,
    initialVolume: number,
    pnbp: string,
    pnbpVolume: number,
    truckId: string,
}

export default class Penerimaan extends Model{

    properties: Properties = {
        tank: new Tank(),
        volume: 0,
        actualVolume: 0,
        initialVolume: 0,
        pnbp: '',
        pnbpVolume: 0,
        truckId: '',
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

    getVolumeDiff(){
        return this.actualVolume - this.pnbpVolume
    }

    get tankName(){
        return this.properties.tank.name
    }

    get volume(){
        return this.properties.volume
    }

    get truckId(){
        return this.properties.truckId
    }

    get pnbp(){
        return this.properties.pnbp
    }

    get initialVolume(){
        return this.properties.initialVolume
    }

    get pnbpVolume(){
        return this.properties.pnbpVolume
    }

    get actualVolume(){
        return this.properties.actualVolume
    }

    set tankName(name: string){
        this.properties.tank.set({name})
    }
}