import React from 'react';
import { Grid } from '@material-ui/core';

import Address from 'models/Address';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

interface Props {
    updateAddress: (updatedAddress: Address) => void | undefined;
    removeFloor?: boolean
}

const AddressForm : React.FC<Props> = (props: Props) : JSX.Element => {

    const { updateAddress, removeFloor } = props;

    const formClasses = useFormStyles();

    const [city, setCity] = React.useState<string>('');
    const [neighborhood, setNeighborhood] = React.useState<string>();
    const [street, setStreet] = React.useState<string>();
    const [houseNumber, setHouseNumber] = React.useState<string>();
    const [entrance, setEntrance] = React.useState<string>();
    const [floor, setFloor] = React.useState<string>();

    React.useEffect(() => {
        updateAddress({
            city, neighborhood, street, houseNumber, entrance, floor
        });
    }, [city, neighborhood, street, houseNumber, entrance, floor]);

    const onCityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setCity(event.target.value);
    const onNeighborhoodChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setNeighborhood(event.target.value);
    const onStreetChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setStreet(event.target.value);    
    const onHouseNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setHouseNumber(event.target.value);    
    const onEntranceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setEntrance(event.target.value);
    const onFloorChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setFloor(event.target.value);

    return (
        <>
            <div className={formClasses.formRow}>
                <Grid item xs={5}>
                    <FormInput fieldName='עיר'>
                        <CircleTextField 
                            value={city} 
                            onChange={onCityChange}/>
                    </FormInput>
                </Grid>
                <Grid item xs={5}>
                    <FormInput fieldName='שכונה'>
                        <CircleTextField 
                            value={neighborhood} 
                            onChange={onNeighborhoodChange}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={5}>
                    <FormInput fieldName='רחוב'>
                        <CircleTextField 
                            value={street} 
                            onChange={onStreetChange}/>
                    </FormInput>
                </Grid>
                <Grid item xs={5}>
                    <FormInput fieldName='מספר בית'>
                        <CircleTextField 
                            value={houseNumber} 
                            onChange={onHouseNumberChange}/>
                    </FormInput>
                </Grid>
            </div>
            <div className={formClasses.formRow}>
                <Grid item xs={5}>
                    <FormInput fieldName='כניסה'>
                        <CircleTextField 
                            value={entrance} 
                            onChange={onEntranceChange}/>
                    </FormInput>
                </Grid>
                <Grid item xs={5}>
                    { !removeFloor && <FormInput fieldName='קומה'>
                        <CircleTextField 
                            value={floor} 
                            onChange={onFloorChange}/>
                    </FormInput> }
                </Grid>
            </div>
        </>
    );
};

export default AddressForm;