import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({    
    filtersCard: {
        width: '65vw',
        height: '30vh',
        borderRadius: '1vw',
        display: 'flex',
        flexDirection: 'column-reverse',
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
    },
    navigateIcon: {
        backgroundColor: 'lightGrey',
        borderRadius: '2vw',
    }
});

export default useStyles;
