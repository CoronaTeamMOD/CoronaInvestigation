import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    investigatedDateCard: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: 'lightgray',
        margin: '1vh 0',
        padding: '1vh 1vw'
    },
    dateInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateSection: {
        display: 'flex',
        alignItems: 'center',
    },
    infoSection: {
        display: 'flex',
        alignItems: 'center',
    },
    createContactButton: {
        marginRight: 'auto'
    },
    arrowWrapper: {
        width: '5vw'
    }
});

export default useStyles;
