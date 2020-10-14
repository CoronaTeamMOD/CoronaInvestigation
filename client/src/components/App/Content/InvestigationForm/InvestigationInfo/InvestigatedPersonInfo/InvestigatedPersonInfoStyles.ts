import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    paper: {
        padding: '0.7vw',
        borderRadius: 0
    },
    headerTopPart:{
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '1vw',
        flip: false,
        height: '5vh'
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
    informationBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    divider: {
        paddingLeft: '0.5vw',
        flip:false,
    },
    additionalInfo: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        whiteSpace: 'pre',
        flex: 12
    },
    managementControllers: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 5,
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    containerGrid: {
        maxWidth: '100vw',
    },
    fieldLabel: {
        '@media screen and (min-width: 1870px)': {
            marginRight: '-6vw',
        },
        marginRight: '-2vw',
    },
    subStatusSelect: {
        width: '12vw'
    }
});

export default useStyles;