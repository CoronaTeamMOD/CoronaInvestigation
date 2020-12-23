import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    unassignedCard: {
        width: '14vw',
        height: '8vh',
        borderRadius: '1vw',
        padding: '1vw'
    },
    investigationAmount: {
        display: 'flex',
        justifyContent: 'center',
    },
    investigationNumberText: {
        fontSize: '1.2vw',
        color: theme.palette.error.main,
    },
    investigationAmountText: {
        fontSize: '1.2vw',
    },
    allInvestigations: {
        display: 'flex',
        flexDirection: 'row',
    },
    allInvestigationsText: {
        fontSize: '1.3vw',
    },
    navigateIcon: {
        backgroundColor: 'lightGrey',
        borderRadius: '2vw',
    }
}));

export default useStyles;
