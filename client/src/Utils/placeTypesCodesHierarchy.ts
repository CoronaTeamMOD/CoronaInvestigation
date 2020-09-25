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
            eventsHall: 2,
            stadium: 5,
            amphitheater: 6,
            hotel: 12,
            pool: 22,
            gardenEvents: 24,
            gym: 32,
            beach: 33,
            shops: 35,
            sportsHall: 44,
            sportsField: 45,
            museumOrGallery: 47,
            restaurantAndCoffeeShop: 59,
            other: 64,
            super: 70,
            publicPark: 77,
            bar: 79,
            zoo: 288,
        }
    },
}

export default placeTypesCodesHierarchy;