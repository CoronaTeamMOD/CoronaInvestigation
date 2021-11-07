import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles({
    optionalExposureSources: {
        maxHeight: '50vh',
        overflowY: 'auto',
        margin: '0px 0 30px -30px',
        direction: 'rtl',
        width: '70%',
        minHeight: '10vh',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        width: '8vw',
        border: 'rgba(0, 0, 0, 0.26) 1px solid',
        height: '100%',
        fontWeight: 400,
        borderRadius: '20px',
        minWidth: '100px',
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
        margin: '15px 0 15px 0'
    },
    searchContainer: {
        paddingLeft: '0 !important'
    },
    filterSelect: {
        marginTop: '20px',
        '& .MuiSelect-root': {
            padding: '12px 32px 12px 12px'
        }
    }
});

export default useStyles;