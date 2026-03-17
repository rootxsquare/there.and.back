import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';
import { usePassportStore } from '../store/usePassportStore';

const VISA_DATA_URL = 'https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-matrix-iso2.csv';

export type VisaStatus = 'visa-free' | 'e-visa' | 'visa on arrival' | 'visa required' | 'unknown';

interface VisaData {
  [passportCode: string]: {
    [destinationCode: string]: string;
  };
}

const rankStatus = (val: string): number => {
  if (!val || val === 'unknown') return 0;
  if (val === 'visa required') return 1;
  if (val === 'e-visa' || val === 'eta') return 2;
  if (val === 'visa on arrival') return 3;
  // If it's a number (days) or -1 (home country) or explicit visa-free
  if (!isNaN(Number(val)) || val.includes('visa-free') || val === '-1') return 4;
  return 0; // fallback
};

export const normalizeStatus = (val: string): VisaStatus => {
  const r = rankStatus(val);
  if (r === 4) return 'visa-free';
  if (r === 3) return 'visa on arrival';
  if (r === 2) return 'e-visa';
  if (r === 1) return 'visa required';
  return 'unknown';
};

export function useVisaAccess() {
  const { passports } = usePassportStore();

  const query = useQuery<VisaData>({
    queryKey: ['visaData'],
    queryFn: async () => {
      const response = await fetch(VISA_DATA_URL);
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data: VisaData = {};
            results.data.forEach((row: any) => {
              const passportCode = row['Passport'];
              if (passportCode) {
                data[passportCode] = row;
              }
            });
            resolve(data);
          },
          error: (error: any) => reject(error),
        });
      });
    },
    staleTime: Infinity, // data rarely changes
  });

  // Calculate combined best status
  const getDestinationStatus = (destinationIso2: string): VisaStatus => {
    if (!query.data || passports.length === 0) return 'unknown';

    let bestRank = -1;
    let bestVal = 'unknown';

    for (const p of passports) {
      const accessRaw = query.data[p]?.[destinationIso2];
      if (accessRaw) {
        const r = rankStatus(accessRaw);
        if (r > bestRank) {
          bestRank = r;
          bestVal = accessRaw;
        }
      }
    }

    return normalizeStatus(bestVal);
  };

  return {
    ...query,
    getDestinationStatus,
  };
}
