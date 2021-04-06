const dateToAge = (date : Date | string) => {
    var ageDifMs = Date.now() - new Date(date).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default dateToAge;