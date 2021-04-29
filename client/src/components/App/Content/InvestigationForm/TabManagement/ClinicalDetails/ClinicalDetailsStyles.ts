import {makeStyles} from '@material-ui/styles';

export const useStyles = makeStyles({
    form: {
        padding: '10vh 2vw'
    },
    rowGridItem: {
        display: 'flex',
        flexDirection: 'row',
    },
    containerGrid: {
        maxWidth: '100vw',
        height: '9vh'
    },
    fieldLabel: {
        '@media screen and (min-width: 1870px)': {
            marginRight: '-6vw',
        },
        marginRight: '-2vw',
    },
    hospitalLabel: {
        marginRight: '1vw',
    },
    backgroundDiseasesLabel: {
        '@media screen and (max-width: 950px)': {
            marginTop: '3vh'
        },
    },
    dates: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '100%',
        marginBottom: '0.5vw',
        alignItems: 'center',
    },
    hospitalizationDates: {
        display: 'flex',
        flexDirection: 'row',
    },
    smallGrid: {
        width: '60vw'
    },
    isolationProblemTextField: {
        marginLeft: '1vw',
        width: '15vw',
    },
    otherTextField: {
        marginTop: '1vh',
        marginLeft: '-22vw',
    },
    symptomsDateCheckBox: {
        marginTop: '1vh',
        marginLeft: '1vw',
    },
    spacedDates: {
        marginRight: '1vw',
        padding: '6px',
    },
    verticalSpacing: {
        marginBottom: '1vh',
    },
    hospitalInput: {
      marginLeft: '5vw',
    },
    symptomsAndDiseasesCheckbox: {
        'media screen and (max-width: 1500px)': {
            marginRight: '-1vw'
        },
        'media screen and (min-width: 1500px)': {
            marginRight: '-5vw'
        },
    },
    hiddenIsPregnant: {
        display: 'none'
    },
    clinicalDetailsStub: {
        margin: '10px 15px 10px 0',
    }
});

export interface ClinicalDetailsClasses {
    form: string;
    rowGridItem: string;
    containerGrid: string;
    fieldLabel: string;
    hospitalLabel: string;
    backgroundDiseasesLabel: string;
    dates: string;
    hospitalizationDates: string;
    smallGrid: string;
    isolationProblemTextField: string;
    otherTextField: string;
    symptomsDateCheckBox: string;
    spacedDates: string;
    verticalSpacing: string;
    hospitalInput: string;
    symptomsAndDiseasesCheckbox: string;
    clinicalDetailsStub: string;
}