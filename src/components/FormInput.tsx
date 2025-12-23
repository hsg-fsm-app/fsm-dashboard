import { FormInputProps } from '@types/index';
import '@styles/components/FormInput.css';

const FormInput: React.FC<FormInputProps> = ({ label, type, value, placeholder, onChange }) => {
  return (
    <div className="cs-form-group">
      <label className="cs-form-label">{label}</label>
      <input 
        type={type} 
        className="cs-form-input" 
        value={value} 
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default FormInput;
