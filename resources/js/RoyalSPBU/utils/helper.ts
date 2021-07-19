export const uniqueArray = <Type>(arr: Type[]) => arr.filter((x,i) => arr.indexOf(x) === i)

export function isToday(date: Date): boolean {
    let today = new Date()
    return date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()
}