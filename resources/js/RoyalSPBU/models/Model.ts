
export interface ModelProps {

}

export default abstract class Model {

    protected _isDefined: boolean = false
    abstract properties: ModelProps

    isDefined(): boolean {
        return this._isDefined
    }

    isNotDefined(): boolean {
        return !this._isDefined
    }

    set(newProp: Partial<ModelProps>){
        this._isDefined = true
        this.properties = {
            ...this.properties,
            ...newProp,
        }
    }
}