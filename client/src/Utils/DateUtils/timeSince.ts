enum times  {
    now = 'פחות מדקה',
    seconds = 'שניות',
    minutes = 'דקות',
    hours = 'שעות',
    days = 'ימים',
    months = 'חודשים',
    years = 'שנים'
}



const getTimeSinceMessage = ( date : Date , includeSeconds : boolean) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    
    if (interval > 1) {
        return Math.floor(interval) + " " + times.years;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " " + times.months;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " " + times.days;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " " + times.hours;
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " " + times.minutes;
    }
    if (includeSeconds) {
        return Math.floor(seconds) + " " + times.seconds;
    }
    return times.now;
};

export default getTimeSinceMessage;