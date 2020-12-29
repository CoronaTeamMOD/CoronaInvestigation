import React, { useMemo } from 'react';
import { Card, CardProps, CircularProgress } from '@material-ui/core';

import useStyle from './LoadingCardStyles';

const LoadingCard: React.FC<Props> = ({isLoading, width, height, className, ...cardProps}): JSX.Element => {

    const classes = useStyle(width, height)();

    const cardClass = useMemo<string>(() => {
        if (isLoading) {
            return classes.loadingSpinnerCard;
        } else if (className) {
            return className
        } 
        return '';
    }, [isLoading]);

    return (
        <Card {...cardProps} className={cardClass}>
            {
                isLoading ?
                <CircularProgress color='primary' />
                :
                cardProps.children
            }
        </Card>
    )
}

interface Props extends CardProps {
    isLoading: boolean;
    width?: string;
    height?: string;
}

export default LoadingCard