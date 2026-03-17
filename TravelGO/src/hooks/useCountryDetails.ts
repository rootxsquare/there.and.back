import { useQuery } from '@tanstack/react-query';

export interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  articleUrl?: string;
}

export function useCountrySummary(countryName: string | null) {
  return useQuery<WikiSummary>({
    queryKey: ['countrySummary', countryName],
    queryFn: async () => {
      if (!countryName) throw new Error("No country name");
      
      const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`);
      if (!summaryRes.ok) throw new Error('Failed to fetch country details');
      return await summaryRes.json();
    },
    enabled: !!countryName,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCountryAttractions(countryName: string | null) {
  return useQuery<WikiSummary[]>({
    queryKey: ['countryAttractions', countryName],
    queryFn: async () => {
      if (!countryName) throw new Error("No country name");
      
      let attractions: WikiSummary[] = [];
      try {
        // Query Wikivoyage for images embedded in the country's travel guide page
        const queryUrl = `https://en.wikivoyage.org/w/api.php?action=query&titles=${encodeURIComponent(countryName)}&generator=images&gimlimit=30&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;
        
        const res = await fetch(queryUrl, { 
            headers: { 'Accept': 'application/json', 'User-Agent': 'TravelGoScrapbook/2.0' } 
        });
        
        if (res.ok) {
          const data = await res.json();
          const pages = Object.values(data.query?.pages || {}) as any[];
          
          // STRICT FILTER: We only want real photos of places.
          // Drop all vectors (svg), UI components (icons/logos), metadata (maps, banners), and flags.
          const photos = pages.filter(p => {
              if (!p.title) return false;
              const t = p.title.toLowerCase();
              return !t.match(/\.(svg|gif)$/) && 
                     !t.includes('map') && 
                     !t.includes('flag') && 
                     !t.includes('logo') && 
                     !t.includes('banner') && 
                     !t.match(/\bicon\b/);
          });

          // Sort photos pseudo-randomly so users see different attractions when clicking the same country
          const shuffledPhotos = photos.sort(() => 0.5 - Math.random());

          for (const p of shuffledPhotos) {
              const cleanTitle = p.title.replace(/^File:/, '').replace(/\.(jpe?g|png|svg)$/i, '').replace(/_/g, ' ').trim();
              const thumbUrl = p.imageinfo?.[0]?.thumburl;
              const originalUrl = p.imageinfo?.[0]?.url;
              
              if (thumbUrl && originalUrl) {
                  attractions.push({
                      title: cleanTitle,
                      extract: "",
                      thumbnail: { source: thumbUrl },
                      originalimage: { source: originalUrl },
                      // Wikivoyage doesn't map photos to specific articles natively, so read more will go to the country's travel guide
                      articleUrl: `https://en.wikivoyage.org/wiki/${encodeURIComponent(countryName)}`
                  });
              }

              if (attractions.length >= 3) break;
          }
        }
      } catch (e) {
         console.warn("Failed to fetch Wikivoyage attractions", e);
      }

      return attractions;
    },
    enabled: !!countryName,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
