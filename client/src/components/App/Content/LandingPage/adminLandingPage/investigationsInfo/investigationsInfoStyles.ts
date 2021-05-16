import { makeStyles } from '@material-ui/styles';

export const cardWidth = '67vw';
export const cardHeight = '35vh';

const useStyles = makeStyles({
    filtersCard: {
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
        marginLeft: '0.3vw',
        flip: false
    },
    navigateIcon: {
        backgroundColor: 'WhiteSmoke',
        borderRadius: '2vw',
    }
});

export default useStyles;
