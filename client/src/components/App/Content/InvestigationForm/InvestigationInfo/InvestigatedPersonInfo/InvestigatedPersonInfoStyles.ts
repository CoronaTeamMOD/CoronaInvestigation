import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    paper: {
        padding: '0.7vw',
        margin: '2vh',
        paddingLeft: '2vw',
    },
    headerTopPart: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '1vw',
        flip: false,
        height: '5vh',
        marginBottom: '15px',
    },
    investigationHeaderInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    investigationTitle: {
        flip: false,
        fontWeight: 400,
        fontSize: '1rem',
        marginLeft: '18px'
    },
    investigationNameTitle: {
        flip: false,
        fontWeight: 400,
        fontSize: '1rem',
        marginLeft: '30px'
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
        margin: '5px 0'
    },
    commentLine: {
        fontSize: '1rem',
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
    },
    smallSizeText: {
        fontSize: '1rem'
    },
    saveButton: {
        direction: 'rtl',
        marginRight: '1vw'
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
    button: {
        width: '8vw',
        border: 'rgba(0, 0, 0, 0.26) 1px solid',
        height: '100%',
        fontWeight: 400,
        marginLeft: '20px',
        borderRadius: '20px',
        minWidth: '100px',
    },
    commentTitle: {
        fontSize: '1rem',
        marginRight: '20px',
        height: '5vh',
        marginTop: '7px',
    }
});

export default useStyles;