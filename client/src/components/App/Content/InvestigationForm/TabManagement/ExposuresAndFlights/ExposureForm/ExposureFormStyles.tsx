import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    exposureForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    exposureContactNameFields: {
        marginLeft: '-14vw'
    },
    exposureContactName: {
        marginLeft: '1vw',
    },
    exposureNameLabel: {
        marginRight: '-14vw',
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