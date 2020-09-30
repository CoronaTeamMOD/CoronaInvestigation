import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    mainTextItem: {
        marginRight: '9.5vw',
    },
    mainTextField: {
        width: '17vw',
    },
    secondaryTextItem: {
        '@media screen and (max-width: 1000px)': {
            marginLeft: '2vw',
        },
    },
    secondaryTextLabel: {
        '@media screen and (max-width: 1000px)': {
            marginLeft: '-1vw',
        },
    },
    secondaryTextField: {
        marginLeft: '-0.5vw',
        width: '9vw'
    },
});

export default useStyles;