import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({    
    filtersCard: {
        width: '65vw',
        height: '30vh',
        borderRadius: '1vw',
        display: 'flex',
        flexDirection: 'column-reverse',
    },
    investigationAmountContainer: {
        paddingLeft: '2.5vw',
    },
    investigationAmount: {
        display: 'flex',
        justifyContent: 'center',
    },
    investigationAmountText: {
        fontSize: '1.1vw',
    },
    allInvestigations: {
        display: 'flex',
        flexDirection: 'row',
    },
    allInvestigationsText: {
        fontSize: '1.3vw',
        paddingTop: '0.6vh',
    },
    navigateIcon: {
        backgroundColor: 'lightGrey',
        borderRadius: '2vw',
    }
});

export default useStyles;
