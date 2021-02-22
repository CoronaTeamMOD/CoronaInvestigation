import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
    tableContainer: {
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
                fontSize: 'x-large'
            }
        }
    },
    icon: {},
    active: {},
    counter: {
        width: '90vw',
    },
    filters: {
        width: '90vw',
    },
    header: {
        fontSize: '4vh',
        display: 'flex',
        justifyContent: 'center'
    },
    filtersContent: {
        width: '90vw',
        marginBottom: '2vh'
    },
    sourceOrganization: {
        width: '8vw',
        height: '2vw'
    },
    desks: {
        width: '9vw',
        height: '2vw'
    },
    deactivateButton: {
        borderRadius: '48px',
        color: 'white',
        background: theme.palette.error.main,
        '&:hover': {
            background: theme.palette.error.main,
        },
    }
}));

export default useStyles;