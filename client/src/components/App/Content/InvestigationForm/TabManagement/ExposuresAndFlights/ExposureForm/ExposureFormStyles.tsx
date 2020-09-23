import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    exposureForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    exposureContactName: {
        marginLeft: '-10vw',
        marginRight: '1vw'
    },
    exposureFields: {
        marginLeft: '-2.5vw',
    },
    exposureDate: {
        marginLeft: '-12.5vw',
    },
    exposureAddress: {
        '@media screen and (min-width: 1220px)': {
            paddingRight: '51vw'
        },
        paddingRight: '22vw'
    }
});

export default useStyles;