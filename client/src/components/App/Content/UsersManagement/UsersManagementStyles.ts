import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { primaryBackgroundColor } from 'styles/theme';

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        height: '84vh',
        backgroundColor: primaryBackgroundColor,
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
    },
    activeSortIcon: {
        '&$active': {
            '&& $icon': {
              color: theme.palette.primary.dark,
              fontSize: "x-large"
            }
        }
    },
    icon: {},
    active: {},
}));

export default useStyles;