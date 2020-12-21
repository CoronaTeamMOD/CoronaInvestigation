import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({    
    filtersCard: {
        width: '67vw',
        height: '30vh',
        borderRadius: '1vw',
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
    }
});

export default useStyles;
