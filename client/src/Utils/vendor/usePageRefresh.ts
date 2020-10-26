import React from 'react';

type RequestHandler = () => void;
type MinuteInterval = number;
const usePageRefresh = (requestHandler: RequestHandler, minuteInterval: MinuteInterval) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
    const [refreshInterval, setRefreshInterval] = React.useState<NodeJS.Timeout | null>();

    React.useEffect(() => {
        return () => {
            stopWaiting();
        };
    }, []);

    const minuteToMSConvert = (minutes: number) => minutes * 60000;

    const startWaiting = () => {
        const intervalInMS = minuteToMSConvert(minuteInterval);
        setRefreshInterval(setInterval(showSnackbar, intervalInMS));
    };

    const restartWait = () => {
        stopWaiting();
        startWaiting();
    };

    const stopWaiting = () => {
        refreshInterval && clearInterval(refreshInterval);
        setRefreshInterval(null);
    };

    const showSnackbar = () => setSnackbarOpen(true);

    const onOk = () => {
        requestHandler();
        setSnackbarOpen(false);
        restartWait();
    };

    const onCancel = () => {
        setSnackbarOpen(false);
        restartWait();
    };

    return {
        startWaiting,
        snackbarOpen,
        setSnackbarOpen,
        onOk,
        onCancel
    }
};

export default usePageRefresh;