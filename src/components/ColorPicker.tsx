import { ColorPickerProps } from '@/types';
import '@styles/components/ColorPicker.css';

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, cssVar, onChange }) => {
  return (
    <div className="cs-color-picker">
      <label className="cs-color-label">{label}</label>
      <div className="cs-color-input-wrapper">
        <input 
          type="color" 
          value={value} 
          className="cs-color-input" 
          data-css-var={cssVar}
          onChange={(e) => onChange(e.target.value)}
        />
        <input 
          type="text" 
          value={value} 
          className="cs-color-text" 
          data-css-var={cssVar} 
          maxLength={7}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
