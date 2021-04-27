const RUNNER = '🏃';
const COMPLETED = '█';
const UNCOMPLETED = '░'
const BAR_LENGTH = Math.min(50 , process.stdout.columns - 1) // account for runner;

const generateLoadingBar = (fraction : number) => {
    const gustCount = Math.floor(fraction * BAR_LENGTH) - 1;
    const dotCount = BAR_LENGTH - gustCount - 1; // account for runner

    return  repeatString(UNCOMPLETED,dotCount) + RUNNER + repeatString(COMPLETED,gustCount) ; 
}

const repeatString = (string : string, times : number) => {
    let newString = '';
    for(let i = 0 ; i < times; i++ ) {
        newString += string;
    }
    return newString;
}

export default generateLoadingBar;