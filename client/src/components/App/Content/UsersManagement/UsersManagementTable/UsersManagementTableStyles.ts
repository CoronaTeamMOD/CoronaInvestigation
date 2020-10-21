import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        height: '84vh',
        backgroundColor: '#F3F6FB',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    tableContainer : {
        width: '90vw',
        height: '70vh',
    },
    autoComplete: {
        width: '10vw'
    },
    pagination: {
        marginTop: '3vh'
    }
}));

export default useStyles;