import {format} from 'date-fns'
import idLocale from 'date-fns/locale/id'

export const uniqueArray = <Type>(arr: Type[]) => arr.filter((x,i) => arr.indexOf(x) === i)


//code from https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
export function debounce<T extends unknown[], U>(
    callback: (...args: T) => PromiseLike<U>| U,
    wait: number
){
    let timer: number

    return (...args: T): Promise<U> => {
        clearTimeout(timer)
        return new Promise(resolve => {
            timer = window.setTimeout(() => resolve(callback(...args)), wait)
        })
    }
}

export function isToday(date: Date): boolean {
    let today = new Date()
    return date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()
}

export function formatRupiah(rp: number, prefix: string = "Rp"): string {
    let numberString = rp.toString().replace(/[^,\d]/g,''),
    split = numberString.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi)

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if(ribuan){
        let separator = sisa ? '.' : ''
        rupiah += separator+ribuan.join('.')
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
    return prefix+rupiah
}

export function numberWithCommas(n: number, separator: string = ".") {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

export function formatDate(d: Date, f: string = 'dd MMMM yyyy'){
    return format(d, f, {locale: idLocale})
}