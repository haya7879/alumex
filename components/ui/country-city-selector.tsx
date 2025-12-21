import * as React from "react";
import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type CountryCitySelectorProps = {
  countries: Array<{
    id: string;
    name: string;
    iso2: string;
    cities: { id: string; name: string }[];
  }>;
  value: { countryId: string | null; cityId: string | null };
  onChange: (value: {
    countryId: string | null;
    cityId: string | null;
  }) => void;
  excludedCountries?: string[]; // ISO2 codes
  countryPlaceholder?: string;
  cityPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export const CountryCitySelector: React.FC<CountryCitySelectorProps> = ({
  countries,
  value,
  onChange,
  excludedCountries = [],
  countryPlaceholder = "Select country...",
  cityPlaceholder = "Select city...",
  disabled = false,
  required = false,
  className,
}) => {
  // Filtered countries (exclude by iso2)
  const filteredCountries = React.useMemo(
    () =>
      countries.filter(
        (c) => !excludedCountries.includes(c.iso2.toLowerCase())
      ),
    [countries, excludedCountries]
  );

  // Find selected country and its cities
  const selectedCountry = filteredCountries.find(
    (c) => c.id === value.countryId
  );
  const cities = selectedCountry?.cities || [];
  const selectedCity = cities.find((city) => city.id === value.cityId);

  // Popover open state
  const [countryOpen, setCountryOpen] = React.useState(false);
  const [cityOpen, setCityOpen] = React.useState(false);

  // Search state
  const [countrySearch, setCountrySearch] = React.useState("");
  const [citySearch, setCitySearch] = React.useState("");

  // Filtered lists
  const countryList = React.useMemo(() => {
    if (!countrySearch) return filteredCountries;
    return filteredCountries.filter((c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [filteredCountries, countrySearch]);

  const cityList = React.useMemo(() => {
    if (!citySearch) return cities;
    return cities.filter((c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [cities, citySearch]);

  // Handlers
  const handleCountrySelect = (country: (typeof filteredCountries)[0]) => {
    setCountryOpen(false);
    setCitySearch("");
    onChange({ countryId: country.id, cityId: null });
  };
  const handleCitySelect = (city: { id: string; name: string }) => {
    setCityOpen(false);
    onChange({ countryId: value.countryId, cityId: city.id });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Country Selector */}
      <div>
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="country-selector"
        >
          Country{required && <span className="text-red-500">*</span>}
        </label>
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
          <PopoverTrigger asChild>
            <button
              id="country-selector"
              type="button"
              className={cn(
                "w-full h-12 px-4 flex items-center justify-between border rounded-md bg-background text-left",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              aria-haspopup="listbox"
              aria-expanded={countryOpen}
              disabled={disabled}
            >
              {selectedCountry ? (
                <span className="flex items-center gap-2">
                  <Image
                    src={`https://flagcdn.com/w40/${selectedCountry.iso2.toLowerCase()}.png`}
                    alt={selectedCountry.name + " flag"}
                    width={24}
                    height={18}
                    className="rounded-sm border"
                  />
                  {selectedCountry.name}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {countryPlaceholder}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-80">
            <Command>
              <CommandInput
                placeholder="Search country..."
                value={countrySearch}
                onValueChange={setCountrySearch}
                autoFocus
              />
              <CommandList>
                <CommandEmpty>No countries found.</CommandEmpty>
                {countryList.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={country.name}
                    onSelect={() => handleCountrySelect(country)}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={`https://flagcdn.com/w40/${country.iso2.toLowerCase()}.png`}
                      alt={country.name + " flag"}
                      width={24}
                      height={18}
                      className="rounded-sm border"
                    />
                    <span>{country.name}</span>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {/* City Selector */}
      <div>
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="city-selector"
        >
          City{required && <span className="text-red-500">*</span>}
        </label>
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
          <PopoverTrigger asChild>
            <button
              id="city-selector"
              type="button"
              className={cn(
                "w-full h-12 px-4 flex items-center justify-between border rounded-md bg-background text-left",
                (!selectedCountry || disabled) &&
                  "opacity-50 cursor-not-allowed"
              )}
              aria-haspopup="listbox"
              aria-expanded={cityOpen}
              disabled={!selectedCountry || disabled}
            >
              {selectedCity ? (
                <span>{selectedCity.name}</span>
              ) : (
                <span className="text-muted-foreground">{cityPlaceholder}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-80">
            <Command>
              <CommandInput
                placeholder="Search city..."
                value={citySearch}
                onValueChange={setCitySearch}
                autoFocus
                disabled={!selectedCountry}
              />
              <CommandList>
                <CommandEmpty>No cities found.</CommandEmpty>
                {cityList.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() => handleCitySelect(city)}
                  >
                    {city.name}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
