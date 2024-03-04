import { ReactNode } from 'react';
import './fieldWrapper.scss';

export function FieldWrapper({children}:{children: ReactNode}){
    return <div className='field-wrapper'>{children}</div>
}