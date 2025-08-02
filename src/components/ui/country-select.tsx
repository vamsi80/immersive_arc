"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getAllCountryNames } from "@/lib/utils/countries";

interface CountrySelectProps {
  value: string;
  onChange: (val: string) => void;
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const countryList = getAllCountryNames();

  return (
    <div className="grid gap-3">
      <Label htmlFor="country">Country</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="country">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          {countryList.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
