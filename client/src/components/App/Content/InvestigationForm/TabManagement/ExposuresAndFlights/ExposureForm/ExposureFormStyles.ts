import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    exposureSourceTextFied: {
        width: '70vw',
    },
    optionalExposureSources: {
        maxHeight: '50vh',
        overflowY: 'auto',
        marginTop: '1vh',
        direction: 'rtl',
        width: '70vw',
        minHeight: '10vh',
    },
    loadingSpinner: {
        margin: '1vh 48%'
    },
    optionalExposureSource: {
        direction: 'ltr',
    },
    optionField: {
        marginLeft: '1vw' 
    },
    searchedField: {
        fontWeight: 'bold'
    }
});

export default useStyles;
