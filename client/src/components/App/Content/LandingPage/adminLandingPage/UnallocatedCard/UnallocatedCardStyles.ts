import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

export const cardWidth = '14vw';
export const cardHeight = '8vh';

const useStyles = makeStyles({
    unallocatedCard: {
        width: cardWidth,
        height: cardHeight,
        borderRadius: '1vw',
        padding: '1vw',
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.text.primary
        }
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
    unallocatedInvestigations: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '13vw',
    },
    unallocatedInvestigationsText: {
        fontSize: '1.2vw',
    },
    navigateIcon: {
        backgroundColor: 'WhiteSmoke',
        borderRadius: '2vw',
    }
});

export default useStyles;
