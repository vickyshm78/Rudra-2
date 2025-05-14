import React from 'react';
import Input, { InputProps } from './input';

export interface FormFieldProps extends InputProps {
  id: string;
  label: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  ...props
}) => {
  return (
    <Input
      id={id}
      label={required ? `${label} *` : label}
      aria-required={required}
      {...props}
    />
  );
};

export default FormField;