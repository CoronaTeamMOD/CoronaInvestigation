import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    heightendTextField: {
        height: '4vh',
        marginTop: '0.25vh',
        '@media screen and (max-height: 950px)': {
            height: '6.25vh'
        }
    },
    centerLabel: {
        '& > label': {
            marginTop: '0.2vh'
        },
        '@media screen and (max-height: 950px)': {
            '& > label': {
                marginTop: '0.45vh'
            },
        }
    }
});

export default useStyles;