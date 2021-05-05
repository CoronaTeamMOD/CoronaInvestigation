import {makeStyles} from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles({
    optionalExposureSources: {
        maxHeight: '50vh',
        overflowY: 'auto',
        margin: '15px 0 15px -30px',
        direction: 'rtl',
        width: '70%',
        minHeight: '10vh',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    loadingSpinner: {
        margin: '1vh 48%'
    },
    optionalExposureSource: {
        direction: 'ltr',
        paddingLeft: '0'
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
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    swalText: {
        fontFamily: 'Assistant',
    },
    errorLabel: {
        color: theme.palette.error.main
    },
    placeTypeSpace: {
        margin: '30px 0 20px'
    },
    patientDetailsWrapper: {
        marginTop: '15px'
    }
});

export default useStyles;
