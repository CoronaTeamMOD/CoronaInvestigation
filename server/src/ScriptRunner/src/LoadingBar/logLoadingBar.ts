import generateLoadingBar from './generateLoadingBar';

const logLoadingBar = (currentIndex : number , scriptsLength : number, scriptName : string) => {
    console.log(`${generateLoadingBar(currentIndex / scriptsLength)} ${currentIndex}/${scriptsLength} - ${scriptName}`);
}

export default logLoadingBar;