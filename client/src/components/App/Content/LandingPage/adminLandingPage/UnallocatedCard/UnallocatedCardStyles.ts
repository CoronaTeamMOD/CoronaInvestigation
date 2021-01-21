import { makeStyles } from '@material-ui/styles';

export const cardHeight = '8vh';

const useStyles = makeStyles({
    unallocatedCard: {
        borderRadius: '1vw',
        padding: '1vh 1vw',
        cursor: 'pointer',
    },
    investigationAmount: {
        fontSize: '1.2vw',
        display: 'flex',
    },
    investigationNumberText: {
        color: '#F95959',
        marginRight: '0.8vw',
    },
    navigateIcon: {
        backgroundColor: 'WhiteSmoke',
        borderRadius: '2vw',
        marginRight: '0.5vw'
    },
    investigationText: {
        flex: 'auto' 
    },
});

export default useStyles;
