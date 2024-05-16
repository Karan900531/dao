declare module 'dayjs' {
    const dayjs: Dayjs;
    export = dayjs;
}

interface Dayjs {
    // Define the methods and properties of the Dayjs object here
    // For example:
    (date?: dayjs.ConfigType): dayjs.Dayjs;
    // Add more methods and properties as needed
}
