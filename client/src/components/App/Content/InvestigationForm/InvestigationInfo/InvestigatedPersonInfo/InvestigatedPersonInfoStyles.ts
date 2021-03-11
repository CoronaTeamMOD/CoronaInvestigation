import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    paper: {
        padding: '0.7vw',
        borderRadius: 0
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
        paddingRight: '0.5vw',
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
        alignItems: 'center',
        whiteSpace: 'pre',
        flex: 12
    },
    smallSizeText: {
        fontSize: '1rem'
    },
    saveButton: {
        direction: 'rtl'
    }
});

export default useStyles;