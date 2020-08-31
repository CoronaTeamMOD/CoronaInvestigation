import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        padding: '2vh 2vw',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    verifiedPatientToggle: {
        height: '3vh',
        width: '5vw',
    },
    noBtn: {
        borderRadius: '0 25px 25px 0 !important'
    },
    yesBtn: {
        borderRadius: '25px 0 0 25px !important'
    },
    nameTextField: {
        
    }
});

export default useStyles;
