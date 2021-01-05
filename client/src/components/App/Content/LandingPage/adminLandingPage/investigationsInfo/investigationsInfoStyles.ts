import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

export const cardWidth = '67vw';
export const cardHeight = '35vh';

const useStyles = makeStyles({
    filtersCard: {
        width: cardWidth,
        height: cardHeight,
        borderRadius: '1vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    investigationInfoButtonWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around'
    },
    investigationAmountContainer: {
        display: 'flex',
        paddingTop: '1vh',
        paddingRight: '2vw',
        alignItems: 'center',
        flip: false,
    },
    investigationAmountText: {
        fontSize: '1.5vw',
        marginLeft: '0.3vw',
        flip: false
    },
    allInvestigationsText: {
        fontSize: '1.3vw',
    },
    navigateIcon: {
        backgroundColor: 'WhiteSmoke',
        borderRadius: '2vw',
    },
    investigationsGraphContainer: {
        height: '14vh', 
        width: '11vw' 
    }
});

export default useStyles;
