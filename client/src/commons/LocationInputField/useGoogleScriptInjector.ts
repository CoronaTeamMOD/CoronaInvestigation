export const INJECTION_STATE_NOT_YET = 'NOT_YET';
export const INJECTION_STATE_IN_PROGRESS = 'IN_PROGRESS';
export const INJECTION_STATE_DONE = 'DONE';

let injectionState: string = INJECTION_STATE_NOT_YET;
let injectionError: Error | null = null;

let onScriptLoadCallbacks: (() => void)[] = [];
let onScriptLoadErrorCallbacks: ((error: Error | null) => void)[] = [];

const injectScript = (apiKey: string): Promise<void> => {
    switch (injectionState) {
        case INJECTION_STATE_DONE:
            return injectionError ? Promise.reject(injectionError) : Promise.resolve();

        case INJECTION_STATE_IN_PROGRESS:
            return new Promise((resolve, reject) => {
                onScriptLoadCallbacks.push(resolve);
                onScriptLoadErrorCallbacks.push(reject);
            });

        default: // INJECTION_STATE_NOT_YET

            injectionState = INJECTION_STATE_IN_PROGRESS;

            return new Promise((resolve, reject) => {
                const script = document.createElement('script');

                script.type = 'text/javascript';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.async = true;
                script.defer = true;

                const onScriptLoad = () => {
                    // Resolve current promise
                    resolve();
                    // Resolve the pending promises in their respective order
                    onScriptLoadCallbacks.forEach((cb) => cb());

                    cleanup();
                };
                const onScriptLoadError = () => {
                    // Reject all promises with this error
                    injectionError = new Error('[react-google-places-autocomplete] Could not inject Google script');
                    // Reject current promise with the error
                    reject(injectionError);
                    // Reject all pending promises in their respective order with the error
                    onScriptLoadErrorCallbacks.forEach((cb) => cb(injectionError));

                    cleanup();
                };

                // Release callbacks and unregister listeners
                const cleanup = () => {
                    script.removeEventListener('load', onScriptLoad);
                    script.removeEventListener('error', onScriptLoadError);
                    onScriptLoadCallbacks = [];
                    onScriptLoadErrorCallbacks = [];
                    injectionState = INJECTION_STATE_DONE;
                };

                script.addEventListener('load', onScriptLoad);
                script.addEventListener('error', onScriptLoadError);

                document.body.appendChild(script);
            });
    }
};

export default injectScript;