import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { FormProvider, useForm } from 'react-hook-form';

import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';
import TypePreventiveTextField from 'commons/TypingPreventionTextField/TypingPreventionTextField';

import { initialComment } from '../../../Context/CommentContext';

const errorMessage = 'השדה יכול להכניס רק תווים חוקיים';
const maxLengthErrorMessage = 'השדה יכול להכיל 500 תווים בלבד';
const COMMENT_PLACEHOLDER = 'ההערה שלך...';
const MAX_CHARS_ALLOWED = 500;

const stringAlphabet = yup
    .string()
    .matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage)
    .max(MAX_CHARS_ALLOWED, maxLengthErrorMessage);

const commentFieldName = 'comment';
const commentSchema = yup.object().shape({ [commentFieldName]: yup.string() });

const CommentInput = ({ commentInput, handleInput }: Props) => {
    const methods = useForm({
        mode: 'all',
        defaultValues: { [commentFieldName]: initialComment },
        resolver: yupResolver(commentSchema)
    });

    return (
        <FormProvider {...methods}>
            <TypePreventiveTextField
                name={commentFieldName}
                multiline fullWidth
                validationSchema={stringAlphabet}
                placeholder={COMMENT_PLACEHOLDER}
                value={commentInput} onChange={handleInput}
            />
        </FormProvider>
    );
};

interface Props {
    commentInput: string;
    handleInput: (input: string) => void;
};

export default CommentInput;
