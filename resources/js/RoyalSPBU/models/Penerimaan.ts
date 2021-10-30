import Tank from './Tank'
import Model, {ModelProps} from './Model'
import {format} from 'date-fns'
import idLocale from 'date-fns/locale/id'

interface Properties extends ModelProps {
    id: number,
    tank: Tank,
    volume: number,
    actualVolume: number,
    initialVolume: number,
    pnbp: string,
    pnbpVolume: number,
    truckId: string,
    issueTimestamp: Date,
    issuer: string,
    receiveTimestamp: Date | null,
    receiver: string,

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
        id: -1,
        issueTimestamp: new Date(0),
        issuer: '',
        receiveTimestamp: null,
        receiver: '',
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
        return this.actualVolume - this.initialVolume - this.pnbpVolume
    }

    isReceived(){
        return this.properties.receiveTimestamp !== null
    }

    isNotReceived(){
        return !this.isReceived()
    }

    getFormattedIssueTimestamp(dateFormat: string = 'dd MMMM yyyy'){
        return format(this.issueTimestamp, dateFormat, {locale: idLocale})
    }

    getFormattedReceiveTimestamp(dateFormat: string = 'dd MMMM yyyy'){
        return this.receiveTimestamp === null ? '' : format(this.receiveTimestamp, dateFormat, {locale: idLocale})
    }

    get issueTimestamp(){
        return this.properties.issueTimestamp
    }

    get issuer(){
        return this.properties.issuer
    }

    get receiveTimestamp(){
        return this.properties.receiveTimestamp
    }

    get receiver(){
        return this.properties.receiver
    }

    get id(){
        return this.properties.id
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

    set tankId(id: number){
        this.properties.tank.set({id})
    }
}