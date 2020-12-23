import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({    
    filtersCard: {
        width: '65vw',
        height: '30vh',
        borderRadius: '1vw',
        display: 'flex',
        flexDirection: 'column-reverse',
    },
    newButton: {
        backgroundColor: '#1F78B4',
    },
    inProcessButton: {
        backgroundColor: 'grey',
    },
    notAssignedButton: {
        backgroundColor: '#33A02C',
    },
    assignedToNotActiveButton: {
        backgroundColor: '#F95959',
        fontSize: '0.1vw'
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
    }
});

export default useStyles;
