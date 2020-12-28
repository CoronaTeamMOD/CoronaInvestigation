import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    filtersCard: {
        width: '67vw',
        height: '35vh',
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
        flip: false
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
    }
});

export default useStyles;
