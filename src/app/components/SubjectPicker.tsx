// ===== SUBJECT PICKER =====
// Nutzt native <select> für System-Picker (iOS Wheel / Android Spinner)

import NativeSelect from './NativeSelect';

interface SubjectPickerProps {
  value: string;
  onChange: (subject: string) => void;
  subjects: string[];
  label?: string;
  className?: string;
}

export default function SubjectPicker({ 
  value, 
  onChange, 
  subjects, 
  label = 'Fach',
  className = '' 
}: SubjectPickerProps) {
  const options = subjects.map((s) => ({ value: s, label: s }));

  return (
    <NativeSelect
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Fach auswählen"
      className={className}
    />
  );
}
