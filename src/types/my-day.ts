export interface IMyDay {
  wakeTime: number
  wakeLabel: string
  sleepTime: number
  sleepLabel: string
  name?: string
  plans: {
    name: string
    start: number
    end: number
  }[]
}
