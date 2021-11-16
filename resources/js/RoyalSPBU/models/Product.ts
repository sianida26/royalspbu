import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    id: number,
    name: string,
    price: number,
    penerimaanPrice: number,
}

export default class Product extends Model{

    properties: Properties = {
        id: -1,
        name: '',
        price: 0,
        penerimaanPrice: 0,
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

    get id(){
        return this.properties.id
    }

    get name(){
        return this.properties.name
    }

    get price(){
        return this.properties.price
    }

    get penerimaanPrice(){
        return this.properties.penerimaanPrice
    }

    set price(price: number){
        this.set({price})
    }

    set name(name: string){
        this.set({name})
    }
}