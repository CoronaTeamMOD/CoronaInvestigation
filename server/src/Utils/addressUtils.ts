import Address from '../Models/Address/Address';
import InsertAndGetAddressIdInput from '../Models/Address/InsertAndGetAddressIdInput'

export const formatToInsertAndGetAddressIdInput = (address: Address) :  InsertAndGetAddressIdInput => ({
    cityValue: address.city || null,
    streetValue: address.street || null,
    apartmentValue: address.apartment || null,
    houseNumValue: address.houseNum || null,
    floorValue: address.floor || null,
});

export const formatToNullable = (address : Address): Address => {
    return {
        city : address.city || null,
        street : address.street || null, 
        houseNum : address.houseNum || null, 
        apartment : address.apartment || null,
        floor: address.floor || null, 
    }
} 