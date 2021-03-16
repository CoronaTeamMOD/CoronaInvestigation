import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    paper: {
        padding: '0.7vw',
        borderRadius: 0,
        margin: '2vh',
        paddingLeft: '2vw',
    },
    headerTopPart: {
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
        flip: false,
        fontWeight: 400,
    },
    informationBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    divider: {
        paddingLeft: '0.5vw',
        flip: false,
    },
    additionalInfo: {
        display: 'flex',
        flexWrap: 'wrap',
        whiteSpace: 'pre',
        flex: 12,
        flexDirection: 'column',
        marginLeft: '-0.5vw',
    },
    line: {
        display: 'flex',
        flexDirection: 'row',
    },
    commentLine: {
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
    },
    managementControllers: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 5,
        marginBottom: '0.5vh'
    },
    commentControllers: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 5,
        marginBottom: '0.5vh'
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
    statusSelect: {
        width: '14vw',
        height: '2vw'
    },
    subStatusSelect: {
        width: '14vw',
        height: '2vw'
    },
    statusSelectGrid: {
        flip: false,
        marginRight: '1vw'
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    subStatusLabel: {
    },
    button: {
        width: '8vw',
        border: 'rgba(0, 0, 0, 0.26) 1px solid',
        height: '5vh',
        fontWeight: 700,
        marginLeft: '20px',
        borderRadius: '20px',
    },
    commentTitle: {
        marginRight: '20px',
        height: '5vh',
        marginTop: '7px',
    }
});

export default useStyles;