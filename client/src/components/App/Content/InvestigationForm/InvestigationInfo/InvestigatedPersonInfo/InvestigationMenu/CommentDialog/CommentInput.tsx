import React, { useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { FormProvider, useForm } from 'react-hook-form';

import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';
import { alphaNumericSpecialCharsErrorMessage, max750LengthErrorMessage } from 'commons/Schema/messages';
import { useSelector, useDispatch } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { SetInvestigationComment, setInvestigationInfoChanged } from 'redux/Investigation/investigationActionCreators';


const COMMENT_PLACEHOLDER = 'ההערה שלך...';
const MAX_CHARS_ALLOWED = 750;

const stringAlphabet = yup
    .string()
    .matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, alphaNumericSpecialCharsErrorMessage)
    .max(MAX_CHARS_ALLOWED, max750LengthErrorMessage);

const commentFieldName = 'comment';
const commentSchema = yup.object().shape({ [commentFieldName]: yup.string() });

const CommentInput = ({ isViewMode }: Props) => {
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(commentSchema)
    });
    const dispatch = useDispatch();
    const [commentInput, setCommentInput] = React.useState<string | null>('');
    const comment = useSelector<StoreStateType, string | null>(state=>state.investigation.comment);
    const handleInput = (input: string) => {
        setCommentInput(input);
        dispatch(setInvestigationInfoChanged(true))
    }
    useEffect(() => {
        if (comment) {
            setCommentInput(comment);
        }
    }, [comment === null])

    return (
        <FormProvider {...methods}>
            <TypePreventiveTextField
                name={commentFieldName}
                multiline fullWidth
                validationSchema={stringAlphabet}
                placeholder={COMMENT_PLACEHOLDER}
                disabled={isViewMode}
                value={commentInput} onChange={handleInput}
                onBlur={()=>{if (commentInput != null) dispatch(SetInvestigationComment(commentInput))}}
            />
        </FormProvider>
    );
};

interface Props {
    isViewMode?: boolean;  
};

export default CommentInput;