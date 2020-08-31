import { makeStyles } from '@material-ui/styles';

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
    informationBar: {
        display: 'flex',
        flexWrap: 'wrap',
        whiteSpace: 'pre',
        alignItems: 'center',
        paddingTop: '1vh',
        justifyContent: 'space-between'
    },
    divider: {
        paddingLeft: '0.5vw',
        flip:false,
    },
    additionalInfo: {
        display: 'flex',
    },
    exitInvestigationButton: {
        marginTop: '1vh',
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
        width: '7vw',
    }, 
    managementControllers: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    checkbox: {
        marginTop: '0.25vh',
    }
});

export default useStyles;
