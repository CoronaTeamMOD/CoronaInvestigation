import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    heightendTextField: {
        minHeight: '3vh',
        '@media screen and (max-height: 950px)': {
            minHeight: '5.9vh'
        }
    },
    fullHeight: {
        height: '100%',
        width: '100%'
    }
});

export default useStyles;