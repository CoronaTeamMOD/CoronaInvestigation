const RUNNER = '🏃';
const GUST = '💨';
const DOT = '➖󠀠'
const BAR_LENGTH = 18;

const generateLoadingBar = (fraction : number) => {
    const gustCount = Math.floor(fraction * BAR_LENGTH) - 1;
    const dotCount = BAR_LENGTH - gustCount - 1; // account for runner

    return  repeatString(DOT,dotCount) + RUNNER + repeatString(GUST,gustCount) ; 
}

const repeatString = (string : string, times : number) => {
    let newString = '';
    for(let i = 0 ; i < times; i++ ) {
        newString += string;
    }
    return newString;
}

export default generateLoadingBar;