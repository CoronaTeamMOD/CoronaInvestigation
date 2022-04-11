import BorderCheckpoint from "./BorderCheckpoint";

interface BorderCheckpointData {
   wasAbroad?: boolean;
   borderCheckpoint?: BorderCheckpoint | string;
   borderCheckpointType?: number;
   arrivalDateToIsrael?: Date;
   arrivalTimeToIsrael?: string;
   lastDestinationCountry?: string;
}

export const defaultBorderCheckpointData: BorderCheckpointData = {
   wasAbroad: false,
   borderCheckpoint: undefined,
   borderCheckpointType: undefined,
   arrivalDateToIsrael: undefined,
   arrivalTimeToIsrael: undefined,
   lastDestinationCountry: undefined
};

export default BorderCheckpointData;
