interface Properties {
    id: number,
    name: string,
    price: number,
}

export default class Product{

    private _isDefined = false

    private properties: Properties = {
        id: -1,
        name: '',
        price: 0,
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

    get name(){
        return this.properties.name
    }

    get price(){
        return this.properties.price
    }
}