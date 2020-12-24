import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    unassignedCard: {
        width: '14vw',
        height: '8vh',
        borderRadius: '1vw',
        padding: '1vw',
        cursor: 'pointer',
    },
    investigationAmount: {
        display: 'flex',
    },
    investigationNumberText: {
        fontSize: '1.2vw',
        color: '#F95959',
        marginRight: '0.8vw',
    },
    investigationAmountText: {
        fontSize: '1.2vw',
    },
    unnasignedInvestigations: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '13vw',
    },
    unnasignedInvestigationsText: {
        fontSize: '1.3vw',
    },
    navigateIcon: {
        backgroundColor: 'lightGrey',
        borderRadius: '2vw',
    }
});

export default useStyles;
