import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@trg_package/vite/components';

const ConditionSelect: React.FC<{
  label: string;
  value: string | undefined;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}> = ({ label, value, options, onChange, disabled, className }) => (
  <Select value={value} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger className={className}>
      <SelectValue placeholder={label} />
    </SelectTrigger>
    <SelectContent className={className}>
      <SelectGroup>
        <SelectLabel>{label}</SelectLabel>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
export default ConditionSelect;
