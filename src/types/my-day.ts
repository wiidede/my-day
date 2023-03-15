export interface IMyDay {
  wakeTime: number
  wakeLabel: string
  sleepTime: number
  sleepLabel: string
  plans: {
    name: string
    start: number
    end: number
  }[]
}
