import React from 'react'
import { FormProvider } from 'react-hook-form';

const MockFormProvider : React.FC<Props> = (props) => {
    return (
        //@ts-ignore - this is stright out of the documentation (!) https://github.com/react-hook-form/react-hook-form/blob/4babac795fd7f51d4d4d9bcb382a5551886842f4/src/useFormContext.test.tsx#L15
        <FormProvider >
            {props.children}
        </FormProvider>
    )
}

interface Props {
    
}

export default MockFormProvider;
