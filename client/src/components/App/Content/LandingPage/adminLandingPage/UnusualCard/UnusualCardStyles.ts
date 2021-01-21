import { makeStyles } from '@material-ui/styles';

export const cardWidth = '14vw';
export const cardHeight = '16vh';

const useStyles = makeStyles({
    unusualCard: {
        borderRadius: '1vw',
        padding: '1vw'
    },
    unusualCompleted: {
        marginBottom:'1vw',
        marginTop:'1vw'
    },
    unusualInProcess: {
        marginTop:'1vw'
    },
    investigationAmount: {
        display: 'flex',
    },
    investigationNumberText: {
        marginRight: '0.8vw',
    },
    unusualInvestigations: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    unusualTitle: {
        display: 'flex',
        flexDirection: 'row',
    },
    navigateIcon: {
        backgroundColor: 'WhiteSmoke',
        borderRadius: '2vw',
    },
    warningIcon:{
        color: '#F95959',
        marginRight: '2vh',
    }
});

export default useStyles;
