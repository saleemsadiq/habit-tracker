// here we make changes to one file so it is reflected in other files since it is exported , rather than making changes to every single file
// when a change is needed. it is the localstorage key used across the appliction, all read & write must use it

// const variable that doesnt change
export const STORAGE_KEYS = {
    users:'habit-tracker-users',
    session:'habit-tracker-session',
    habits:'habit-tracker-habits'
} as const

// habit frequency option, only daily was done for now
export const HABIT_FREQUENCY = {
    daily: 'daily'
}as const

// validation rule for habit field
export const HABIT_VALIDATION = {
    nameMaxLength: 60,
} as const

// splash screen display duration in ms
export const SPLASH_DURATION = 1000 //1 second used here 
