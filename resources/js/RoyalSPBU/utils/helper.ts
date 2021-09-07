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