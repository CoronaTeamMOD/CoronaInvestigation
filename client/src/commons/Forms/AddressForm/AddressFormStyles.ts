import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    heightendTextField: {
        height: '4vh',
        marginTop: '0.25vh',
        '@media screen and (max-height: 950px)': {
            height: '6.25vh'
        }
    }
});

export default useStyles;