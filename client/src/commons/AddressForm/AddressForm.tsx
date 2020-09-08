import React from 'react';

import Address from 'models/Address';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import LocationInput, {GoogleApiPlace} from '../LocationInputField/LocationInput';
import useStyles from './AddressFormStyles';

const AddressForm : React.FC<Props> = (props: Props) : JSX.Element => {
    const { updateAddress, removeFloor } = props;

    const formClasses = useFormStyles();
    const additionalClasses = useStyles();

    const [address, setAddress] = React.useState<GoogleApiPlace | null>(null);
    const [entrance, setEntrance] = React.useState<string>();
    const [floor, setFloor] = React.useState<string>();

    React.useEffect(() => {
        address &&  updateAddress({
            address, entrance, floor
        });
    }, [address, entrance, floor]);

    const onLocationChange = (event: React.ChangeEvent<{}>, newValue: GoogleApiPlace | null) => {
        setAddress(newValue);
    };
    const onEntranceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setEntrance(event.target.value);
    const onFloorChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setFloor(event.target.value);

    return (
        <>
            <div className={formClasses.formRow + ' ' + additionalClasses.addressRow}>
                <div>
                    <FormInput fieldName='כתובת'>
                        <LocationInput selectedAddress={address} setSelectedAddress={onLocationChange}/>
                    </FormInput>
                </div>

                <div>
                    <FormInput fieldName='כניסה'>
                        <CircleTextField
                            onBlur={onEntranceChange}/>
                    </FormInput>
                </div>
                <div>
                    { !removeFloor && <FormInput fieldName='קומה'>
                        <CircleTextField
                            onBlur={onFloorChange}/>
                    </FormInput> }
                </div>
            </div>
        </>
    );
};

export default AddressForm;

interface Props {
    updateAddress: (updatedAddress: Address) => void;
    removeFloor?: boolean
}