import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
    button: {
        display:'flex',
        alignItems: 'center'
    },
    wideScreenButton: {
        width: '7vw'
    },
    smallScreenButton: {
        width: '9vw'
    },
    logo: {
        width: '2vw'
    },
});

export default useStyle;