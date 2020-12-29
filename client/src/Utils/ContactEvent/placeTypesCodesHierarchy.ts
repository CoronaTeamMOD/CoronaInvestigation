import BusEventForm
    from '../../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionDialog/InteractionEventForm/InteractionSection/TransportationForms/BusEventForm';
import TrainEventForm
    from '../../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionDialog/InteractionEventForm/InteractionSection/TransportationForms/TrainEventForm';
import FlightEventForm
    from '../../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionDialog/InteractionEventForm/InteractionSection/TransportationForms/FlightEventForm';
import SchoolEventForm
    from '../../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionDialog/InteractionEventForm/InteractionSection/SchoolEventForm/SchoolEventForm';
import HospitalEventForm
    from '../../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionDialog/InteractionEventForm/InteractionSection/HospitalEventForm/HospitalEventForm';

export interface FormOptions {
    code: number | string;
    hasAddress: boolean;
    isNamedLocation:  boolean;
    isBusiness:  boolean;
    isTransportation:  boolean;
    extraFields?: React.FC<any>[];
    nameFieldLabel?: string;
}

export interface SubplaceConfig extends Partial<FormOptions> {
    code: number;
}

export interface FormConfig extends FormOptions {
    code: string;
    subTypesCodes?: {[subtypeKey: string]: SubplaceConfig}
}

export const defaultOptions: Omit<FormOptions, 'code'> = {
    hasAddress: true,
    isNamedLocation: true,
    isBusiness: true,
    isTransportation: false,
};

export const getOptionsByPlaceAndSubplaceType = (placeTypeCode: string, subplaceTypeCode: number | null) => {
    const placeConfig = Object.values(placeTypesCodesHierarchy).find(placeTypeConfig => placeTypeConfig.code === placeTypeCode);
    if(!placeConfig)
        return defaultOptions;
    const subPlaceConfig = placeConfig.subTypesCodes &&
        Object.values(placeConfig.subTypesCodes)
            .find(subtype => subtype.code === subplaceTypeCode);
    return  {...placeConfig, ...subPlaceConfig};
};

type Places = 'privateHouse' | 'office' | 'transportation' | 'school' | 'medical' | 'religion' | 'geriatric' | 'otherPublicPlaces';

const placeTypesCodesHierarchy: Record<Places, FormConfig> = {
    privateHouse: {
        code: 'בית פרטי',
        ...defaultOptions,
        isNamedLocation: false,
        isBusiness: false,
        subTypesCodes: {
            patientHouse: {
                code: 9
            }
        }
    },
    office: {
        code: 'משרד',
        nameFieldLabel: 'שם המשרד',
        ...defaultOptions,
    },
    transportation: {
        code: 'תחבורה',
        hasAddress: false,
        isNamedLocation: false,
        isBusiness: false,
        isTransportation: true,
        subTypesCodes: {
            bus: {
                code:1,
                extraFields: [BusEventForm, TrainEventForm],
            },
            train: {
                code: 85,
                extraFields: [TrainEventForm]
            },
            flight: {
                code: 38,
                extraFields: [FlightEventForm]
            },
            organizedTransport: {
                code: 31,
                isBusiness: true,
            },
        }
    },
    school: {
        code: 'מוסד חינוכי',
        extraFields: [SchoolEventForm],
        ...defaultOptions,
        subTypesCodes: {
            elementarySchool: {
                code: 15,
            },
            highSchool: {
                code: 127
            }
        }
    },
    medical: {
        code: 'מוסד רפואי',
        ...defaultOptions,
        subTypesCodes: {
            hospital: {
                code: 122,
                nameFieldLabel: 'שם בית חולים',
                extraFields: [HospitalEventForm],
            }
        }
    },
    religion: {
        code: 'אתר דת',
        ...defaultOptions,
    },
    geriatric: {
        code: 'מוסד גריאטרי',
        ...defaultOptions,
    },
    otherPublicPlaces: {
        code: 'מקומות ציבוריים נוספים',
        ...defaultOptions,
        subTypesCodes: {
            publicPark: {
                code: 77,
                isBusiness: false,
            },
            zoo: {
                code: 288,
                isBusiness: false,
            },
            stadium: {
                code: 5,
                isBusiness: false,
            } ,
            amphitheater: {
                code: 6,
                isBusiness: false,
            },
            beach: {
                code: 33,
                isBusiness: false,
            },
        }
    },
}

export default placeTypesCodesHierarchy;