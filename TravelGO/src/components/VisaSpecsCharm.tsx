import { Calendar, CircleDollarSign, Fingerprint, FileText } from 'lucide-react';
import type { VisaStatus } from '../hooks/useVisaAccess';

interface VisaSpecsProps {
  status: VisaStatus;
}

export function VisaSpecsCharm({ status }: VisaSpecsProps) {
  // Mock data based on typical real-world visa categories
  const getSpecs = (s: VisaStatus) => {
    switch (s) {
      case 'visa-free':
        return {
          cost: 'Free',
          stay: 'Up to 90 Days',
          income: 'None required',
          docs: ['Valid Passport (6+ months)']
        };
      case 'e-visa':
        return {
          cost: '$20 - $80',
          stay: '30 to 90 Days',
          income: 'None required',
          docs: ['Valid Passport', 'Online Application', 'Digital Photo']
        };
      case 'visa on arrival':
        return {
          cost: '$30 - $100',
          stay: '15 to 30 Days',
          income: 'Proof of onward travel usually required',
          docs: ['Valid Passport', 'Cash for Fee', 'Return Ticket']
        };
      case 'visa required':
        return {
          cost: '$60 - $200+',
          stay: 'Determined upon application',
          income: 'Proof of sufficient funds (e.g. Bank statements)',
          docs: ['Valid Passport', 'Embassy Interview', 'Itinerary', 'Proof of funds']
        };
      default:
        return {
          cost: 'Unknown',
          stay: 'Unknown',
          income: 'Unknown',
          docs: ['Valid Passport']
        };
    }
  };

  const specs = getSpecs(status);

  return (
    <div className="bg-[#fcf5e2] p-4 rounded-sm shadow-md border-l-4 border-brand font-sans text-sm relative transform rotate-1 mt-4">
      <div className="washi-tape-yellow -top-3 left-1/2 -ml-16 scale-75"></div>
      <h4 className="font-handwriting font-bold text-xl mb-3 border-b border-stone-300 pb-1 text-stone-800">
        Visa Quick Look
      </h4>
      <ul className="space-y-3 text-stone-700">
        <li className="flex items-start gap-2">
          <CircleDollarSign size={16} className="mt-0.5 text-stone-500" />
          <div>
            <span className="font-bold text-stone-800">Est. Cost:</span> {specs.cost}
          </div>
        </li>
        <li className="flex items-start gap-2">
          <Calendar size={16} className="mt-0.5 text-stone-500" />
          <div>
            <span className="font-bold text-stone-800">Typical Stay:</span> {specs.stay}
          </div>
        </li>
        <li className="flex items-start gap-2">
          <Fingerprint size={16} className="mt-0.5 text-stone-500" />
          <div>
            <span className="font-bold text-stone-800">Income Req:</span> {specs.income}
          </div>
        </li>
        <li className="flex items-start gap-2">
          <FileText size={16} className="mt-0.5 text-stone-500" />
          <div>
            <span className="font-bold text-stone-800">Key Docs:</span>
            <ul className="list-disc ml-5 mt-1 text-xs">
              {specs.docs.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}
