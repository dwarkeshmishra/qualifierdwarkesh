import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface MultiSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export function MultiSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select options..."
}: MultiSelectProps) {
  const handleValueChange = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onValueChange(value.filter((v) => v !== selectedValue));
    } else {
      onValueChange([...value, selectedValue]);
    }
  };

  const displayValue = value.length > 0
    ? `${value.length} selected`
    : placeholder;

  return (
    <Select
      value={value[value.length - 1] || ""}
      onValueChange={handleValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={displayValue}>
          {displayValue}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                className="h-4 w-4"
                onChange={() => {}}
              />
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
