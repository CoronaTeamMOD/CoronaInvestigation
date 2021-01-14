import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    heightendTextField: {
        height: '3.99vh',
        '@media screen and (max-height: 950px)': {
            height: '5.9vh'
        }
    }
});

export default useStyles;