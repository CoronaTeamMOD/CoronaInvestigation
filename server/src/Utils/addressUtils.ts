import Address from '../Models/Address/Address';
import InsertAndGetAddressIdInput from '../Models/Address/InsertAndGetAddressIdInput'

export const formatToInsertAndGetAddressIdInput = (address: Address) :  InsertAndGetAddressIdInput => ({
    cityValue: address.city || null,
    streetValue: address.street || null,
    floorValue: address.floor || null,
    houseNumValue: address.houseNum || null,
});