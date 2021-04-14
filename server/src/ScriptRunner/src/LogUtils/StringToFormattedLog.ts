const StringToFormattedLog = (message : string) => {
    return `${getLogDateTime()} ${message}`;
}

const getLogDateTime = () => {
    const now = new Date();

    return `[${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`
}

export default StringToFormattedLog;