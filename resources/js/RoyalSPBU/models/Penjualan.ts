import Tank from './Tank'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    tank: Tank,
    volume: number,
}

export default class Penjualan extends Model{

    properties: Properties = {
        tank: new Tank(),
        volume: 0,
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

    getIncome(){
        return this.volume*this.price
    }

    get volume():number{
        return this.properties.volume
    }

    get price():number{
        return this.properties.tank.product.price
    }

    get tankName():string{
        return this.properties.tank.name
    }

    set tankName(name: string){
        this.properties.tank.set({name})
    }

    set price(n: number){
        this.properties.tank.product.set({price: n})
    }
}