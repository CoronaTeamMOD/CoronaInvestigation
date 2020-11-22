import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1vh',
        padding: '0 2vw'
    },
    rowAlignment: {
        display: 'flex',
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    gridContainer: {
        margin: '0 5vh'
    },
    divider: {
        margin: '0 2.3vw'
    },
    detailsGrid: {
        padding: '1vh 0'
    },
    interactionItem: {
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '2px solid rgba(224,224,224,1)'
    },
    excelControllers: {
        display: 'flex'
    }
});

export default useStyle;