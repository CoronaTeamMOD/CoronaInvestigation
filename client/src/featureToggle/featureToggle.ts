import { createInstance } from '@optimizely/react-sdk';

export const optimizely = createInstance({
    sdkKey: process.env.REACT_APP_OPTIMIZELY_KEY
});