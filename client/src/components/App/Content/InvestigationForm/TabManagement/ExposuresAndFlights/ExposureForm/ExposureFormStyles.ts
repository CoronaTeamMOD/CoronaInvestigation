import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    exposureSourceTextFied: {
        width: '60vw',
    },
    optionalExposureSources: {
        maxHeight: '50vh',
        overflowY: 'auto',
        marginTop: '1vh',
        direction: 'rtl',
        width: '70vw',
        minHeight: '10vh',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    loadingSpinner: {
        margin: '1vh 48%'
    },
    optionalExposureSource: {
        direction: 'ltr',
    },
    optionField: {
        marginLeft: '1vw',
        fontSize: '1vw',
    },
    searchedField: {
        fontWeight: 'bold'
    },
    loadingDiv: {
        width: '60vw',
        display: 'flex',
        justifyContent: 'center'
    }
});

export default useStyles;
