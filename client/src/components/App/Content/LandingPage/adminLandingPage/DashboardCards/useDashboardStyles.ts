import { makeStyles } from '@material-ui/styles';

const smallCard = {

};

const useStyles = makeStyles({
    card: {
        borderRadius: '1vw',
        padding: '1vw',
    },
    cardTitle: {
        display: 'flex',
        alignItems: 'center',
        '&p': {
            fontSize: '1.2vw',
        },
        fontSize: '1.2vw',
    },
    red: {
        color: '#F95959',
    },
    mediumText: {
        fontSize: '1.2vw',
    },
    navigateIcon: {
        backgroundColor: 'WhiteSmoke',
        borderRadius: '2vw',
    }
});

export default useStyles;
