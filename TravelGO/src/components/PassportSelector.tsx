import { useState } from 'react';
import { usePassportStore } from '../store/usePassportStore';
import { COUNTRIES } from '../data/countries';
import { X, Search } from 'lucide-react';

export function PassportSelector() {
  const { passports, addPassport, removePassport } = usePassportStore();
  const [search, setSearch] = useState('');

  const filteredCountries = Object.entries(COUNTRIES)
    .filter(([code, name]) => 
      name.toLowerCase().includes(search.toLowerCase()) && !passports.includes(code)
    )
    .slice(0, 5); // show max 5 suggestions

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-stone-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border-2 border-dashed border-stone-300 rounded-md leading-5 bg-white placeholder-stone-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand sm:text-sm font-handwriting text-xl"
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* Dropdown Results */}
        {search && filteredCountries.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto sm:text-sm paper-shadow border border-stone-100">
            {filteredCountries.map(([code, name]) => (
              <li
                key={code}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-stone-50 font-sans text-stone-700 font-medium"
                onClick={() => {
                  addPassport(code);
                  setSearch('');
                }}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-xl">{getFlagEmoji(code)}</span>
                  <span className="block truncate">{name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Passports */}
      <div className="flex flex-wrap gap-2">
        {passports.length === 0 && (
          <span className="text-sm italic text-stone-400 font-handwriting text-lg">No passports added yet...</span>
        )}
        {passports.map((code) => (
          <div key={code} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-light text-white shadow-sm transition-transform hover:-translate-y-0.5" >
            <span className="mr-1.5 text-base">{getFlagEmoji(code)}</span>
            {COUNTRIES[code]}
            <button
              type="button"
              onClick={() => removePassport(code)}
              className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full text-white hover:bg-brand/20 hover:text-white focus:outline-none transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Minimal helper to convert country code to flag emoji
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
