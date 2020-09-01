import requestPromise from 'request-promise';

export const httpRequest = (
    requestUrl: string,
    methodUrl: string,
    data: any = null,
    headers: any = {}
):  requestPromise.RequestPromise => (
    requestPromise({
        url: requestUrl,
        method: methodUrl,
        json: data,
        headers,
        rejectUnauthorized: false
    })
);