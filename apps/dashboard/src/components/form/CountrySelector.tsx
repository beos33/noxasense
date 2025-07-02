"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@/icons";

interface Country {
  value: string;
  label: string;
  code: string;
  flag: string;
}

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const countries: Country[] = [
  { value: "AF", label: "Afghanistan", code: "AF", flag: "🇦🇫" },
  { value: "AL", label: "Albania", code: "AL", flag: "🇦🇱" },
  { value: "DZ", label: "Algeria", code: "DZ", flag: "🇩🇿" },
  { value: "AD", label: "Andorra", code: "AD", flag: "🇦🇩" },
  { value: "AO", label: "Angola", code: "AO", flag: "🇦🇴" },
  { value: "AG", label: "Antigua and Barbuda", code: "AG", flag: "🇦🇬" },
  { value: "AR", label: "Argentina", code: "AR", flag: "🇦🇷" },
  { value: "AM", label: "Armenia", code: "AM", flag: "🇦🇲" },
  { value: "AU", label: "Australia", code: "AU", flag: "🇦🇺" },
  { value: "AT", label: "Austria", code: "AT", flag: "🇦🇹" },
  { value: "AZ", label: "Azerbaijan", code: "AZ", flag: "🇦🇿" },
  { value: "BS", label: "Bahamas", code: "BS", flag: "🇧🇸" },
  { value: "BH", label: "Bahrain", code: "BH", flag: "🇧🇭" },
  { value: "BD", label: "Bangladesh", code: "BD", flag: "🇧🇩" },
  { value: "BB", label: "Barbados", code: "BB", flag: "🇧🇧" },
  { value: "BY", label: "Belarus", code: "BY", flag: "🇧🇾" },
  { value: "BE", label: "Belgium", code: "BE", flag: "🇧🇪" },
  { value: "BZ", label: "Belize", code: "BZ", flag: "🇧🇿" },
  { value: "BJ", label: "Benin", code: "BJ", flag: "🇧🇯" },
  { value: "BT", label: "Bhutan", code: "BT", flag: "🇧🇹" },
  { value: "BO", label: "Bolivia", code: "BO", flag: "🇧🇴" },
  { value: "BA", label: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦" },
  { value: "BW", label: "Botswana", code: "BW", flag: "🇧🇼" },
  { value: "BR", label: "Brazil", code: "BR", flag: "🇧🇷" },
  { value: "BN", label: "Brunei", code: "BN", flag: "🇧🇳" },
  { value: "BG", label: "Bulgaria", code: "BG", flag: "🇧🇬" },
  { value: "BF", label: "Burkina Faso", code: "BF", flag: "🇧🇫" },
  { value: "BI", label: "Burundi", code: "BI", flag: "🇧🇮" },
  { value: "CV", label: "Cabo Verde", code: "CV", flag: "🇨🇻" },
  { value: "KH", label: "Cambodia", code: "KH", flag: "🇰🇭" },
  { value: "CM", label: "Cameroon", code: "CM", flag: "🇨🇲" },
  { value: "CA", label: "Canada", code: "CA", flag: "🇨🇦" },
  { value: "CF", label: "Central African Republic", code: "CF", flag: "🇨🇫" },
  { value: "TD", label: "Chad", code: "TD", flag: "🇹🇩" },
  { value: "CL", label: "Chile", code: "CL", flag: "🇨🇱" },
  { value: "CN", label: "China", code: "CN", flag: "🇨🇳" },
  { value: "CO", label: "Colombia", code: "CO", flag: "🇨🇴" },
  { value: "KM", label: "Comoros", code: "KM", flag: "🇰🇲" },
  { value: "CG", label: "Congo", code: "CG", flag: "🇨🇬" },
  { value: "CR", label: "Costa Rica", code: "CR", flag: "🇨🇷" },
  { value: "HR", label: "Croatia", code: "HR", flag: "🇭🇷" },
  { value: "CU", label: "Cuba", code: "CU", flag: "🇨🇺" },
  { value: "CY", label: "Cyprus", code: "CY", flag: "🇨🇾" },
  { value: "CZ", label: "Czech Republic", code: "CZ", flag: "🇨🇿" },
  { value: "CD", label: "Democratic Republic of the Congo", code: "CD", flag: "🇨🇩" },
  { value: "DK", label: "Denmark", code: "DK", flag: "🇩🇰" },
  { value: "DJ", label: "Djibouti", code: "DJ", flag: "🇩🇯" },
  { value: "DM", label: "Dominica", code: "DM", flag: "🇩🇲" },
  { value: "DO", label: "Dominican Republic", code: "DO", flag: "🇩🇴" },
  { value: "EC", label: "Ecuador", code: "EC", flag: "🇪🇨" },
  { value: "EG", label: "Egypt", code: "EG", flag: "🇪🇬" },
  { value: "SV", label: "El Salvador", code: "SV", flag: "🇸🇻" },
  { value: "GQ", label: "Equatorial Guinea", code: "GQ", flag: "🇬🇶" },
  { value: "ER", label: "Eritrea", code: "ER", flag: "🇪🇷" },
  { value: "EE", label: "Estonia", code: "EE", flag: "🇪🇪" },
  { value: "ET", label: "Ethiopia", code: "ET", flag: "🇪🇹" },
  { value: "FJ", label: "Fiji", code: "FJ", flag: "🇫🇯" },
  { value: "FI", label: "Finland", code: "FI", flag: "🇫🇮" },
  { value: "FR", label: "France", code: "FR", flag: "🇫🇷" },
  { value: "GA", label: "Gabon", code: "GA", flag: "🇬🇦" },
  { value: "GM", label: "Gambia", code: "GM", flag: "🇬🇲" },
  { value: "GE", label: "Georgia", code: "GE", flag: "🇬🇪" },
  { value: "DE", label: "Germany", code: "DE", flag: "🇩🇪" },
  { value: "GH", label: "Ghana", code: "GH", flag: "🇬🇭" },
  { value: "GR", label: "Greece", code: "GR", flag: "🇬🇷" },
  { value: "GD", label: "Grenada", code: "GD", flag: "🇬🇩" },
  { value: "GT", label: "Guatemala", code: "GT", flag: "🇬🇹" },
  { value: "GN", label: "Guinea", code: "GN", flag: "🇬🇳" },
  { value: "GW", label: "Guinea-Bissau", code: "GW", flag: "🇬🇼" },
  { value: "GY", label: "Guyana", code: "GY", flag: "🇬🇾" },
  { value: "HT", label: "Haiti", code: "HT", flag: "🇭🇹" },
  { value: "HN", label: "Honduras", code: "HN", flag: "🇭🇳" },
  { value: "HU", label: "Hungary", code: "HU", flag: "🇭🇺" },
  { value: "IS", label: "Iceland", code: "IS", flag: "🇮🇸" },
  { value: "IN", label: "India", code: "IN", flag: "🇮🇳" },
  { value: "ID", label: "Indonesia", code: "ID", flag: "🇮🇩" },
  { value: "IR", label: "Iran", code: "IR", flag: "🇮🇷" },
  { value: "IQ", label: "Iraq", code: "IQ", flag: "🇮🇶" },
  { value: "IE", label: "Ireland", code: "IE", flag: "🇮🇪" },
  { value: "IL", label: "Israel", code: "IL", flag: "🇮🇱" },
  { value: "IT", label: "Italy", code: "IT", flag: "🇮🇹" },
  { value: "JM", label: "Jamaica", code: "JM", flag: "🇯🇲" },
  { value: "JP", label: "Japan", code: "JP", flag: "🇯🇵" },
  { value: "JO", label: "Jordan", code: "JO", flag: "🇯🇴" },
  { value: "KZ", label: "Kazakhstan", code: "KZ", flag: "🇰🇿" },
  { value: "KE", label: "Kenya", code: "KE", flag: "🇰🇪" },
  { value: "KI", label: "Kiribati", code: "KI", flag: "🇰🇮" },
  { value: "KP", label: "North Korea", code: "KP", flag: "🇰🇵" },
  { value: "KR", label: "South Korea", code: "KR", flag: "🇰🇷" },
  { value: "KW", label: "Kuwait", code: "KW", flag: "🇰🇼" },
  { value: "KG", label: "Kyrgyzstan", code: "KG", flag: "🇰🇬" },
  { value: "LA", label: "Laos", code: "LA", flag: "🇱🇦" },
  { value: "LV", label: "Latvia", code: "LV", flag: "🇱🇻" },
  { value: "LB", label: "Lebanon", code: "LB", flag: "🇱🇧" },
  { value: "LS", label: "Lesotho", code: "LS", flag: "🇱🇸" },
  { value: "LR", label: "Liberia", code: "LR", flag: "🇱🇷" },
  { value: "LY", label: "Libya", code: "LY", flag: "🇱🇾" },
  { value: "LI", label: "Liechtenstein", code: "LI", flag: "🇱🇮" },
  { value: "LT", label: "Lithuania", code: "LT", flag: "🇱🇹" },
  { value: "LU", label: "Luxembourg", code: "LU", flag: "🇱🇺" },
  { value: "MG", label: "Madagascar", code: "MG", flag: "🇲🇬" },
  { value: "MW", label: "Malawi", code: "MW", flag: "🇲🇼" },
  { value: "MY", label: "Malaysia", code: "MY", flag: "🇲🇾" },
  { value: "MV", label: "Maldives", code: "MV", flag: "🇲🇻" },
  { value: "ML", label: "Mali", code: "ML", flag: "🇲🇱" },
  { value: "MT", label: "Malta", code: "MT", flag: "🇲🇹" },
  { value: "MH", label: "Marshall Islands", code: "MH", flag: "🇲🇭" },
  { value: "MR", label: "Mauritania", code: "MR", flag: "🇲🇷" },
  { value: "MU", label: "Mauritius", code: "MU", flag: "🇲🇺" },
  { value: "MX", label: "Mexico", code: "MX", flag: "🇲🇽" },
  { value: "FM", label: "Micronesia", code: "FM", flag: "🇫🇲" },
  { value: "MD", label: "Moldova", code: "MD", flag: "🇲🇩" },
  { value: "MC", label: "Monaco", code: "MC", flag: "🇲🇨" },
  { value: "MN", label: "Mongolia", code: "MN", flag: "🇲🇳" },
  { value: "ME", label: "Montenegro", code: "ME", flag: "🇲🇪" },
  { value: "MA", label: "Morocco", code: "MA", flag: "🇲🇦" },
  { value: "MZ", label: "Mozambique", code: "MZ", flag: "🇲🇿" },
  { value: "MM", label: "Myanmar", code: "MM", flag: "🇲🇲" },
  { value: "NA", label: "Namibia", code: "NA", flag: "🇳🇦" },
  { value: "NR", label: "Nauru", code: "NR", flag: "🇳🇷" },
  { value: "NP", label: "Nepal", code: "NP", flag: "🇳🇵" },
  { value: "NL", label: "Netherlands", code: "NL", flag: "🇳🇱" },
  { value: "NZ", label: "New Zealand", code: "NZ", flag: "🇳🇿" },
  { value: "NI", label: "Nicaragua", code: "NI", flag: "🇳🇮" },
  { value: "NE", label: "Niger", code: "NE", flag: "🇳🇪" },
  { value: "NG", label: "Nigeria", code: "NG", flag: "🇳🇬" },
  { value: "NO", label: "Norway", code: "NO", flag: "🇳🇴" },
  { value: "OM", label: "Oman", code: "OM", flag: "🇴🇲" },
  { value: "PK", label: "Pakistan", code: "PK", flag: "🇵🇰" },
  { value: "PW", label: "Palau", code: "PW", flag: "🇵🇼" },
  { value: "PA", label: "Panama", code: "PA", flag: "🇵🇦" },
  { value: "PG", label: "Papua New Guinea", code: "PG", flag: "🇵🇬" },
  { value: "PY", label: "Paraguay", code: "PY", flag: "🇵🇾" },
  { value: "PE", label: "Peru", code: "PE", flag: "🇵🇪" },
  { value: "PH", label: "Philippines", code: "PH", flag: "🇵🇭" },
  { value: "PL", label: "Poland", code: "PL", flag: "🇵🇱" },
  { value: "PT", label: "Portugal", code: "PT", flag: "🇵🇹" },
  { value: "QA", label: "Qatar", code: "QA", flag: "🇶🇦" },
  { value: "RO", label: "Romania", code: "RO", flag: "🇷🇴" },
  { value: "RU", label: "Russia", code: "RU", flag: "🇷🇺" },
  { value: "RW", label: "Rwanda", code: "RW", flag: "🇷🇼" },
  { value: "KN", label: "Saint Kitts and Nevis", code: "KN", flag: "🇰🇳" },
  { value: "LC", label: "Saint Lucia", code: "LC", flag: "🇱🇨" },
  { value: "VC", label: "Saint Vincent and the Grenadines", code: "VC", flag: "🇻🇨" },
  { value: "WS", label: "Samoa", code: "WS", flag: "🇼🇸" },
  { value: "SM", label: "San Marino", code: "SM", flag: "🇸🇲" },
  { value: "ST", label: "Sao Tome and Principe", code: "ST", flag: "🇸🇹" },
  { value: "SA", label: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
  { value: "SN", label: "Senegal", code: "SN", flag: "🇸🇳" },
  { value: "RS", label: "Serbia", code: "RS", flag: "🇷🇸" },
  { value: "SC", label: "Seychelles", code: "SC", flag: "🇸🇨" },
  { value: "SL", label: "Sierra Leone", code: "SL", flag: "🇸🇱" },
  { value: "SG", label: "Singapore", code: "SG", flag: "🇸🇬" },
  { value: "SK", label: "Slovakia", code: "SK", flag: "🇸🇰" },
  { value: "SI", label: "Slovenia", code: "SI", flag: "🇸🇮" },
  { value: "SB", label: "Solomon Islands", code: "SB", flag: "🇸🇧" },
  { value: "SO", label: "Somalia", code: "SO", flag: "🇸🇴" },
  { value: "ZA", label: "South Africa", code: "ZA", flag: "🇿🇦" },
  { value: "SS", label: "South Sudan", code: "SS", flag: "🇸🇸" },
  { value: "ES", label: "Spain", code: "ES", flag: "🇪🇸" },
  { value: "LK", label: "Sri Lanka", code: "LK", flag: "🇱🇰" },
  { value: "SD", label: "Sudan", code: "SD", flag: "🇸🇩" },
  { value: "SR", label: "Suriname", code: "SR", flag: "🇸🇷" },
  { value: "SZ", label: "Eswatini", code: "SZ", flag: "🇸🇿" },
  { value: "SE", label: "Sweden", code: "SE", flag: "🇸🇪" },
  { value: "CH", label: "Switzerland", code: "CH", flag: "🇨🇭" },
  { value: "SY", label: "Syria", code: "SY", flag: "🇸🇾" },
  { value: "TW", label: "Taiwan", code: "TW", flag: "🇹🇼" },
  { value: "TJ", label: "Tajikistan", code: "TJ", flag: "🇹🇯" },
  { value: "TZ", label: "Tanzania", code: "TZ", flag: "🇹🇿" },
  { value: "TH", label: "Thailand", code: "TH", flag: "🇹🇭" },
  { value: "TL", label: "Timor-Leste", code: "TL", flag: "🇹🇱" },
  { value: "TG", label: "Togo", code: "TG", flag: "🇹🇬" },
  { value: "TO", label: "Tonga", code: "TO", flag: "🇹🇴" },
  { value: "TT", label: "Trinidad and Tobago", code: "TT", flag: "🇹🇹" },
  { value: "TN", label: "Tunisia", code: "TN", flag: "🇹🇳" },
  { value: "TR", label: "Turkey", code: "TR", flag: "🇹🇷" },
  { value: "TM", label: "Turkmenistan", code: "TM", flag: "🇹🇲" },
  { value: "TV", label: "Tuvalu", code: "TV", flag: "🇹🇻" },
  { value: "UG", label: "Uganda", code: "UG", flag: "🇺🇬" },
  { value: "UA", label: "Ukraine", code: "UA", flag: "🇺🇦" },
  { value: "AE", label: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { value: "GB", label: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { value: "US", label: "United States", code: "US", flag: "🇺🇸" },
  { value: "UY", label: "Uruguay", code: "UY", flag: "🇺🇾" },
  { value: "UZ", label: "Uzbekistan", code: "UZ", flag: "🇺🇿" },
  { value: "VU", label: "Vanuatu", code: "VU", flag: "🇻🇺" },
  { value: "VA", label: "Vatican City", code: "VA", flag: "🇻🇦" },
  { value: "VE", label: "Venezuela", code: "VE", flag: "🇻🇪" },
  { value: "VN", label: "Vietnam", code: "VN", flag: "🇻🇳" },
  { value: "YE", label: "Yemen", code: "YE", flag: "🇾🇪" },
  { value: "ZM", label: "Zambia", code: "ZM", flag: "🇿🇲" },
  { value: "ZW", label: "Zimbabwe", code: "ZW", flag: "🇿🇼" }
];

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder = "Select a country",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countries.find(country => country.value === value);

  const filteredCountries = countries.filter(country =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country: Country) => {
    onChange(country.value);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Display selected country or placeholder */}
      <div
        onClick={handleInputClick}
        className="h-11 w-full cursor-pointer rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      >
        {selectedCountry ? (
          <div className="flex items-center space-x-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-gray-800 dark:text-white/90">{selectedCountry.label}</span>
          </div>
        ) : (
          <span className="text-gray-400 dark:text-gray-400">{placeholder}</span>
        )}
        <ChevronDownIcon className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {/* Search input */}
          <div className="border-b border-gray-200 p-2 dark:border-gray-700">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-full rounded border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden dark:border-gray-600 dark:bg-gray-800 dark:text-white/90 dark:placeholder:text-gray-400"
            />
          </div>

          {/* Country list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.value}
                  onClick={() => handleSelect(country)}
                  className="flex cursor-pointer items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {country.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {country.code}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector; 