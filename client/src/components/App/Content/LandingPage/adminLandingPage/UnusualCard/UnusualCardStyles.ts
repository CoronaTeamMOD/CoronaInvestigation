import { makeStyles } from '@material-ui/styles';

export const cardWidth = '14vw';
export const cardHeight = '25vh';

const useStyles = makeStyles({
    unusualCard: {
        width: cardWidth,
        height: cardHeight,
        borderRadius: '1vw',
        padding: '1vw',
        cursor: 'pointer',
    },
    unusualCompleted: {
        marginBottom:'1vw',
        marginTop:'1vw'
    },
    unusualTreatment: {
        marginTop:'1vw'
    },
    investigationAmount: {
        display: 'flex',
    },
    investigationNumberText: {
        fontSize: '1.2vw',
        marginRight: '0.8vw',
    },
    investigationAmountText: {
        fontSize: '1.2vw',
    },
    unusualInvestigations: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '13vw',
    },
    unusualTitle: {
        display: 'flex',
        flexDirection: 'row',
    },
    unusualTitleText: {
        fontSize: '1.2vw',
    },
    unusualInvestigationsText: {
        fontSize: '1.2vw',
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
