import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    managementControllers: {
        flex: 5,
        marginBottom: '0.5vh'
    },
    containerGrid: {
        maxWidth: '100vw',
    },
    fieldLabel: {
        '@media screen and (min-width: 1870px)': {
            marginRight: '-6vw',
        },
        marginRight: '-2vw',
    },
        statusSelect: {
        width: '14vw',
        height: '2vw'
    },
    subStatusSelect: {
        width: '14vw',
        height: '2vw'
    },
    statusSelectGrid: {
        flip: false,
        marginRight: '1vw'
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
});

export default useStyles;