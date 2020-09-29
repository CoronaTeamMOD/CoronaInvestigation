const placeTypesCodesHierarchy = {
    privateHouse: {
        code: 'בית פרטי',
        subTypesCodes: {
            investigatedPersonHouse: 9,
        }
    },
    office: {
        code: 'משרד',
        subTypesCodes: {
        }
    },
    transportation: {
        code: 'תחבורה',
        subTypesCodes: {
            bus: 1,
            train: 85,
            flight: 38,
            organizedTransport: 31,
        }
    },
    school: {
        code: 'מוסד חינוכי',
        subTypesCodes: {
            elementarySchool: 15,
            highSchool: 127,
        }
    },
    medical: {
        code: 'מוסד רפואי',
        subTypesCodes: {
            hospital: 122,
        }
    },
    religion: {
        code: 'אתר דת',
        subTypesCodes: {
        }
    },
    geriatric: {
        code: 'מוסד גריאטרי',
        subTypesCodes: {
        }
    },
    otherPublicPlaces: {
        code: 'מקומות ציבוריים נוספים',
        subTypesCodes: {
            publicPark: 77,
            zoo: 288,
            stadium: 5,
            amphitheater: 6,
            beach: 33,
            mall: 83
        }
    },
}

export default placeTypesCodesHierarchy;