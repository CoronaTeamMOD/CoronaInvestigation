import Times from 'models/enums/Times';

const getTimeSinceMessage = (date: Date, includeSeconds: boolean) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + ' ' + Times.years;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' ' + Times.months;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' ' + Times.days;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' ' + Times.hours;
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' ' + Times.minutes;
    }
    if (includeSeconds) {
        return Math.floor(seconds) + ' ' + Times.seconds;
    }
    return Times.now;
};

export default getTimeSinceMessage;
