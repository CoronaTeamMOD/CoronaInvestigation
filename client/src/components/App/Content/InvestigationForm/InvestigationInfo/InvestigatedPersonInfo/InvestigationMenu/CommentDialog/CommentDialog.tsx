import React, {useContext} from 'react';
import {useSelector} from 'react-redux';
import axios from 'Utils/axios';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@material-ui/core';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import CloseIcon from '@material-ui/icons/Close';

import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';

import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import {commentContext} from '../../../Context/CommentContext';

import useStyles from './CommentDialogStyles';
import CommentInput from './CommentInput';

const SAVE_BUTTON_TEXT = 'שמור הערה';
const DELETE_BUTTON_TEXT = 'מחק';

const CommentDialog = ({open, handleDialogClose}: Props) => {
    const [commentInput, setCommentInput] = React.useState<string>('');
    const {alertError} = useCustomSwal();
    const {comment, setComment} = useContext(commentContext);
    const classes = useStyles();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const resetInput = React.useCallback(() => setCommentInput(comment || ''), [comment]);

    React.useEffect(resetInput, [comment]);

    const sendComment = (commentToSend: string | null, errorMessage: string) => {
        const sendCommentLogger = logger.setup({
            workflow: `POST request add comment to investigation ${epidemiologyNumber}`,
        });
       
        axios.post('/investigationInfo/comment', {comment: commentToSend, epidemiologyNumber})
            .then(() => {
                setComment(commentToSend);
                sendCommentLogger.info('Successfully added comment to investigation',Severity.LOW)
            })
            .catch(() => {
                alertError(errorMessage);
                sendCommentLogger.error('Error occured in adding comment to investigation',Severity.HIGH)
            })
            .finally(handleDialogClose);
    };

    const onDialogClose = () => {
        resetInput();
        handleDialogClose();
    };

    const handleCommentSave = () => {
        sendComment(commentInput as string, 'שגיאה בשמירת ההערה')

    };

    const handleCommentDelete = () => {
        sendComment(null, 'שגיאה במחקית ההערה')
    };

    return (
        <Dialog open={open} onClose={onDialogClose} classes={{paper: classes.dialogPaper}}>
            <DialogTitle disableTypography>
                <Typography variant="h6" className={classes.title}>
                    <CommentIcon/>
                    <span className={classes.titleText}>
                    הוספת הערה על חקירה:
                    </span>
                </Typography>
                <IconButton className={classes.closeButton} onClick={onDialogClose}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <DialogContent className={classes.content}>
                <CommentInput commentInput={commentInput} handleInput={setCommentInput}/>
            </DialogContent>
            <DialogActions>
                <PrimaryButton width='custom'
                               disabled={!(commentInput && commentInput !== comment)}
                               onClick={handleCommentSave}>
                    {SAVE_BUTTON_TEXT}
                </PrimaryButton>
                <PrimaryButton width='custom' background='rgb(249, 89, 89)'
                               disabled={!comment}
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