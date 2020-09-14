import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    paper: {
        padding: '0.7vw',
        borderRadius: 0
    },
    headerTopPart:{
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '3vh',
        flip:false,
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
});

export default useStyles;