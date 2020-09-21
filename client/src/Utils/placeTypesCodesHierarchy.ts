import HospitalEventForm
    from "../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/PlacesAdditionalForms/HospitalEventForm";
import SchoolEventForm
    from "../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/PlacesAdditionalForms/SchoolEventForm";
import TrainEventForm
    from "../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/TrainEventForm";
import BusEventForm
    from "../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/BusEventForm";
import FlightEventForm
    from "../components/App/Content/InvestigationForm/TabManagement/InteractionsTab/InteractionEventForm/PlacesAdditionalForms/TransportationAdditionalForms/FlightEventForm";

export interface FormOptions {
    code: number | string;
    hasAddress: boolean;
    isNamedLocation:  boolean;
    isBusiness:  boolean;
    isTransportation:  boolean;
    extraFields?: React.FC[];
    nameFieldLabel?: string;
}

export interface SubplaceConfig extends Partial<FormOptions> {
    code: number;
    name: string;
}

export interface FormConfig extends FormOptions {
    code: string;
    subTypesCodes: SubplaceConfig[]
}

export const defaultOptions = {
    hasAddress: true,
    isNamedLocation: true,
    isBusiness: true,
    isTransportation: false,
};

export const getSubtypeCodeByName  = (placeTypeCode:string, subplaceTypeName:string) => {
    const placeConfig = getPlaceConfigByCode(placeTypeCode);
    const subPlaceConfig = placeConfig &&  placeConfig.subTypesCodes.find((subPlaceConfig: SubplaceConfig) => subPlaceConfig.name === subplaceTypeName);
    return subPlaceConfig ? subPlaceConfig.code : undefined;
}

export const getPlaceConfigByCode = (placeTypeCode:string) => Object.values(placeTypesCodesHierarchy).find((placeConfig: FormConfig) => placeConfig.code === placeTypeCode);

export const getOptionsByPlaceAndSubplaceType = (placeTypeCode:string, subplaceTypeCode:number) => {
    const placeConfig = getPlaceConfigByCode(placeTypeCode);
    const subPlaceConfig = placeConfig &&  placeConfig.subTypesCodes.find((subPlaceConfig: SubplaceConfig) => subPlaceConfig.code === subplaceTypeCode);
    return  {...placeConfig, ...subPlaceConfig};
}

const placeTypesCodesHierarchy: {[key: string]: FormConfig} = {
    privateHouse: {
        code: 'בית פרטי',
        ...defaultOptions,
        isNamedLocation: false,
        isBusiness: false,
        subTypesCodes: []
    },
    office: {
        code: 'משרד',
        nameFieldLabel: 'שם המשרד',
        ...defaultOptions,
        subTypesCodes: []
    },
    transportation: {
        code: 'תחבורה',
        hasAddress: false,
        isNamedLocation: false,
        isBusiness: false,
        isTransportation: true,
        subTypesCodes: [
           {
               name: 'bus',
                code:1,
                extraFields: [BusEventForm, TrainEventForm],
            },
            {
                name: 'train',
                code: 85,
                extraFields: [TrainEventForm]
            },
             {
                 name: 'flight',
                 code: 38,
                 extraFields: [FlightEventForm]
             },
            {
                name: 'organizedTransport',
                code: 31,
                isBusiness: true,
            },
        ]
    },
    school: {
        code: 'מוסד חינוכי',
        extraFields: [SchoolEventForm],
        ...defaultOptions,
        subTypesCodes: [
            {
                name: 'elementarySchool',
                code: 15,
            },
            {
                name: 'highSchool',
                code: 127
            },
        ]
    },
    medical: {
        code: 'מוסד רפואי',
        ...defaultOptions,
        subTypesCodes: [
            {
                name: 'hospital',
                code: 122,
                nameFieldLabel: 'שם בית חולים',
                extraFields: [HospitalEventForm],
            },
        ]
    },
    religion: {
        code: 'אתר דת',
        ...defaultOptions,
        subTypesCodes: []
    },
    geriatric: {
        code: 'מוסד גריאטרי',
        ...defaultOptions,
        subTypesCodes: []
    },
    otherPublicPlaces: {
        code: 'מקומות ציבוריים נוספים',
        ...defaultOptions,
        subTypesCodes: [
             {
                 name: 'publicPark',
                 code: 77,
                isBusiness: false,
            },
            {
                name: 'zoo',
                code: 288,
                isBusiness: false,
            },
            {
                name: 'stadium',
                code: 5,
                isBusiness: false,
            } ,
            {
                name: 'amphitheater',
                code: 6,
                isBusiness: false,
            },
             {
                 name: 'beach',
                code: 33,
                isBusiness: false,
            },
        ]
    },
}

export default placeTypesCodesHierarchy;