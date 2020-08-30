import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    paper: {
        padding: '0.7vw',
        borderRadius: 0
    },
    investigationHeaderInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    investigationTitle: {
        paddingRight:'0.5vw',
        flip:false,
        fontWeight: 400,
    },
    additionalInfo: {
        display: 'flex',
        flexWrap: 'wrap',
        whiteSpace: 'pre',
        alignItems: 'center',
        paddingTop: '1vh'
    },
    divider: {
        paddingLeft: '0.5vw',
        flip:false,
    }
});

export default useStyles;