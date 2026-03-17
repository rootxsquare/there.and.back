import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useVisaAccess } from "../hooks/useVisaAccess";
import type { VisaStatus } from "../hooks/useVisaAccess";
import { COUNTRIES } from "../data/countries";
import { usePassportStore } from "../store/usePassportStore";

// TopoJSON from react-simple-maps examples (has ISO_A2 usually or we map by name)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Create a reverse map for lookup
const NAME_TO_CODE: Record<string, string> = {};
Object.entries(COUNTRIES).forEach(([code, name]) => {
  NAME_TO_CODE[name] = code;
  NAME_TO_CODE[name.toLowerCase()] = code;
});
// Add common variants
NAME_TO_CODE['United States of America'] = 'US';
NAME_TO_CODE['Russian Federation'] = 'RU';
NAME_TO_CODE['United Kingdom of Great Britain and Northern Ireland'] = 'GB';
NAME_TO_CODE['Iran (Islamic Republic of)'] = 'IR';
NAME_TO_CODE['Republic of Korea'] = 'KR';
NAME_TO_CODE['Viet Nam'] = 'VN';

const getStatusColor = (status: VisaStatus) => {
  switch (status) {
    case 'visa-free': return '#899b79'; // RDR2 warm olive green
    case 'e-visa': return '#8ca4ac'; // faded blue-grey
    case 'visa on arrival': return '#d0a265'; // warm leather ochre
    case 'visa required': return '#a64b3c'; // faded brick red
    default: return '#e4d5b7'; // parchment base
  }
};

export function Map() {
  const { getDestinationStatus, isLoading } = useVisaAccess();

  return (
    <div className="w-full h-full bg-[#eedc9a]/40 flex items-center justify-center relative map-texture shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]">
      <ComposableMap
        projectionConfig={{ scale: 140, center: [0, 20] }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const iso2 = NAME_TO_CODE[countryName] || NAME_TO_CODE[countryName?.toLowerCase()];
                const status = iso2 ? getDestinationStatus(iso2) : 'unknown';
                const fillColor = getStatusColor(status);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#bda785"
                    strokeWidth={0.5}
                    onClick={() => {
                        const { setSelectedCountry } = usePassportStore.getState();
                        setSelectedCountry(iso2 ? iso2 : countryName); // Pass ISO if available
                    }}
                    style={{
                      default: { outline: "none", transition: 'all 250ms' },
                      hover: { fill: "#d0a265", outline: "none", cursor: "pointer", transition: 'all 250ms' },
                      pressed: { fill: "#bc473a", outline: "none" },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 z-20 polaroid p-4 text-sm font-sans flex flex-col gap-2 rounded-xl">
        <h3 className="font-handwriting font-bold text-xl mb-1">Visa Legend</h3>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{backgroundColor: '#899b79'}}></div> Visa-Free</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{backgroundColor: '#8ca4ac'}}></div> e-Visa / ETA</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{backgroundColor: '#d0a265'}}></div> Visa on Arrival</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{backgroundColor: '#a64b3c'}}></div> Visa Required</div>
        {isLoading && <span className="text-xs text-stone-500 mt-2">Loading data...</span>}
      </div>
    </div>
  );
}
