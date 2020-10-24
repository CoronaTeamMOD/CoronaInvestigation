import React, {useContext} from 'react';
import {useSelector} from 'react-redux';
import axios from 'Utils/axios';
import {
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
  import CommentIcon from '@material-ui/icons/CommentOutlined';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from './CommentDialogStyles';

import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import {commentContext} from '../../../Context/CommentContext';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        title: {
            display:'flex',
            alignItems: 'center',
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

interface DialogTitleProps extends WithStyles<typeof styles> {
    children: React.ReactNode;
    onClose: () => void;
}

const ClosableDialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classes.title}>{children}</Typography>
            {onClose ? (
                <IconButton className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});

const SAVE_BUTTON_TEXT = 'שמור הערה';
const DELETE_BUTTON_TEXT = 'מחק';
const COMMENT_PLACEHOLDER = 'ההערה שלך...';

const CommentDialog = ({open, handleDialogClose}: Props) => {
    const [commentInput, setCommentInput] = React.useState<string>('');
    const {alertError} = useCustomSwal();
    const {comment, setComment} = useContext(commentContext);
    const classes = useStyles();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const resetInput = () => setCommentInput(comment || '');

    React.useEffect(resetInput , [comment]);


    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCommentInput(event.target.value);
    };

    const sendComment = (commentToSend: string|null, errorMessage: string) => {
         axios.post('/investigationInfo/comment', {comment:commentToSend, epidemiologyNumber})
            .then(() => setComment(commentToSend))
            .catch(() => alertError(errorMessage))
            .finally(onDialogClose);
    };

    const onDialogClose = () => {
        resetInput();
        handleDialogClose();
    }

    const handleCommentSave = () => {
        sendComment(commentInput as string, 'שגיאה בשמירת ההערה')

    };

    const handleCommentDelete = () => {
        sendComment(null, 'שגיאה במחקית ההערה')
    };

    return (
        <Dialog open={open} onClose={onDialogClose} classes={{paper:classes.dialogPaper}}>
            <ClosableDialogTitle onClose={onDialogClose}>
                <>
                    <CommentIcon/>
                    <span style={{paddingRight: '1vw'}}>
                    הוספת הערה על חקירה:
                    </span>
                </>
            </ClosableDialogTitle>
            <DialogContent className={classes.content}>
                <TextField multiline fullWidth
                           placeholder={COMMENT_PLACEHOLDER}
                           value={commentInput} onChange={handleInput}
                />
            </DialogContent>
            <DialogActions>
                <PrimaryButton width='custom'
                               disabled={!(Boolean(commentInput) && commentInput !== comment)}
                               onClick={handleCommentSave}>
                    {SAVE_BUTTON_TEXT}
                </PrimaryButton>
                <PrimaryButton width='custom' background='rgb(249, 89, 89)'
                               disabled={!Boolean(comment)}
                               onClick={handleCommentDelete}>
                    {DELETE_BUTTON_TEXT}
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

interface Props {
    open: boolean;
    handleDialogClose: () => void;
}

export default CommentDialog;