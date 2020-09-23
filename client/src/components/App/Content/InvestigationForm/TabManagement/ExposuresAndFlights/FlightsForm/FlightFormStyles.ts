import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    contactName: {
        marginLeft: '',
        marginRight: '',
    },
    flightDates: {
        display: 'flex',
        '@media screen and (max-width: 900px)': {
            marginLeft: '-25vw',
        },
        marginLeft: '-14vw',
    },
    spacedOutDates: {
        marginRight: '2.5vw',
    }
});

export default useStyles;