import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, MapPin, Search } from 'lucide-react';
import { usePassportStore } from '../store/usePassportStore';
import { useCountrySummary, useCountryAttractions } from '../hooks/useCountryDetails';
import { useVisaAccess } from '../hooks/useVisaAccess';
import { VisaSpecsCharm } from './VisaSpecsCharm';
import { COUNTRIES } from '../data/countries';

export function DetailPanel() {
  const { selectedCountry, setSelectedCountry } = usePassportStore();
  const [expandedPhoto, setExpandedPhoto] = useState<{ src: string; title: string; extract: string; articleUrl?: string } | null>(null);

  const countryNameForWiki = selectedCountry && COUNTRIES[selectedCountry] ? COUNTRIES[selectedCountry] : selectedCountry;

  const { data: summary, isLoading: isLoadingSummary, isError: isErrorSummary } = useCountrySummary(countryNameForWiki);
  const { data: attractions, isLoading: isLoadingAttractions } = useCountryAttractions(countryNameForWiki);
  const { getDestinationStatus } = useVisaAccess();

  // Close when pressing Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (expandedPhoto) setExpandedPhoto(null);
        else setSelectedCountry(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [expandedPhoto, setSelectedCountry]);

  if (!selectedCountry) return null;

  return (
    <>
      {/* Right Anchored Scrapbook Panel */}
      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] lg:w-[500px] z-40 bg-[#fcf9f2] shadow-[-10px_0_30px_rgba(0,0,0,0.15)] flex flex-col border-l-8 border-stone-200"
        >
          {/* Header area with Flag */}
          <div className="relative p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-stone-100 to-[#f0ece1] border-b border-stone-300">
             <div className="washi-tape absolute top-4 left-4 z-10 rotate-3 opacity-60"></div>
             <button
               onClick={() => setSelectedCountry(null)}
               className="absolute top-6 right-6 p-2 rounded-full bg-white text-stone-600 hover:bg-stone-200 transition-colors z-50 shadow-sm"
             >
               <X size={20} />
             </button>
             
             <div className="flex items-end gap-4 mt-6">
                {/* Dynamically load the flag from flagcdn using ISO2 code (selectedCountry is ISO2) */}
                <div className="w-20 h-14 bg-stone-200 border-2 border-white shadow-md overflow-hidden transform -rotate-2 relative rounded-sm">
                   {selectedCountry && selectedCountry.length === 2 && (
                       <img src={`https://flagcdn.com/w160/${selectedCountry.toLowerCase()}.png`} alt="Flag" className="w-full h-full object-cover" />
                   )}
                </div>
                <h2 className="font-handwriting font-bold text-4xl text-stone-800 leading-none">
                  {countryNameForWiki}
                </h2>
             </div>
          </div>

          {/* Scrolling Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
             <div className="washi-tape-yellow absolute bottom-12 -right-8 z-10 opacity-70"></div>
             
             {isLoadingSummary ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-handwriting text-2xl text-stone-500 animate-pulse">Gathering travel notes...</span>
                </div>
             ) : isErrorSummary ? (
                <div className="bg-white p-6 rounded-lg text-center paper-shadow">
                  <h3 className="font-handwriting text-xl text-red-500 mb-2">Oops!</h3>
                  <p className="font-sans text-stone-700 text-sm">We couldn't find the scrapbook notes for {countryNameForWiki}.</p>
                </div>
             ) : summary && (
                <div className="flex flex-col h-full space-y-8 pb-12">
                   {/* Travel Notes */}
                   <div>
                     <h3 className="font-sans font-bold text-stone-400 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                        <MapPin size={14} /> Travel Notes
                     </h3>
                     <div className="font-sans text-stone-700 leading-relaxed text-[15px]">
                       <p>{summary.extract}</p>
                     </div>
                   </div>

                   {/* Visa Quick Look */}
                   <div className="pt-4 border-t border-stone-200 border-dashed">
                      <VisaSpecsCharm status={getDestinationStatus(selectedCountry)} />
                      
                      <div className="mt-8 flex justify-center">
                         <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent((countryNameForWiki || '') + ' official visa requirements tourists')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full font-bold shadow-[0_4px_14px_0_rgba(231,111,81,0.39)] hover:shadow-[0_6px_20px_rgba(231,111,81,0.23)] hover:bg-[#f25c3a] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                         >
                            <ExternalLink size={16} />
                            Check Official Rules
                         </a>
                       </div>
                   </div>
                </div>
             )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Animated Polaroids (Outside the Right Panel, Over Map) */}
      {!isLoadingSummary && summary && (
        <div className="fixed inset-y-0 left-0 right-[450px] lg:right-[500px] z-30 pointer-events-none p-12 overflow-hidden flex flex-wrap content-center justify-center gap-8">
            {/* The Main Hero Photo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: -4,
                y: [0, -15, 0] // Floating animation
              }}
              transition={{ 
                opacity: { duration: 0.5 },
                scale: { duration: 0.5, type: "spring" },
                rotate: { duration: 0.7, type: "spring" },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 }
              }}
              className="polaroid bg-white p-3 pb-12 shadow-2xl pointer-events-auto cursor-zoom-in w-72 hover:z-50 transition-shadow duration-300 group"
              onClick={() => setExpandedPhoto({
                  src: summary.originalimage?.source || summary.thumbnail?.source || '',
                  title: countryNameForWiki || '',
                  extract: '',
                  articleUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(countryNameForWiki || '')}`
              })}
            >
              <div className="washi-tape-blue top-0 left-1/2 -ml-16 z-40"></div>
              <div className="w-full aspect-square overflow-hidden bg-stone-100 relative group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-black/10 group-hover:after:transition-all">
                <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 z-10 w-10 h-10 drop-shadow-md transition-opacity" />
                <img 
                  src={summary.originalimage?.source || summary.thumbnail?.source || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80'} 
                  alt={countryNameForWiki || 'Destination'}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <p className="font-handwriting text-2xl text-center mt-3 text-stone-800">{countryNameForWiki}</p>
            </motion.div>

            {/* Tourist Attraction Polaroids (Load Silently) */}
            {!isLoadingAttractions && attractions && attractions.map((attr, idx) => {
               const delays = [0.5, 1.5, 2.5];
               const baseRotations = [8, -6, 12];
               return (
                  <motion.div 
                    key={attr.title}
                    initial={{ opacity: 0, scale: 0.8, rotate: baseRotations[idx] * 2 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: baseRotations[idx],
                      y: [0, -10, 0] // Floating animation
                    }}
                    transition={{ 
                      opacity: { duration: 0.5, delay: 0.2 * idx },
                      scale: { duration: 0.5, type: "spring", delay: 0.2 * idx },
                      rotate: { duration: 0.7, type: "spring", delay: 0.2 * idx },
                      y: { duration: 5 + idx, repeat: Infinity, ease: "easeInOut", delay: delays[idx] }
                    }}
                    className="polaroid bg-white p-2 pb-8 shadow-xl pointer-events-auto cursor-zoom-in w-56 hover:z-50 transition-shadow duration-300 group"
                    onClick={() => setExpandedPhoto({
                        src: attr.thumbnail?.source || attr.originalimage?.source || '',
                        title: attr.title,
                        extract: '',
                        articleUrl: attr.articleUrl
                    })}
                  >
                    <div className="w-full aspect-square overflow-hidden bg-stone-100 relative group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-black/10 group-hover:after:transition-all">
                       <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 z-10 w-8 h-8 drop-shadow-md transition-opacity" />
                       <img 
                         src={attr.thumbnail?.source || attr.originalimage?.source} 
                         alt={attr.title}
                         className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                       />
                    </div>
                    <p className="font-handwriting text-lg text-center mt-2 text-stone-800 line-clamp-1 px-1" title={attr.title}>{attr.title}</p>
                  </motion.div>
               );
            })}
        </div>
      )}

      {/* Expanded Photo Overlay */}
      <AnimatePresence>
         {expandedPhoto && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-stone-900/90 backdrop-blur-md flex flex-col items-center justify-center p-8 cursor-zoom-out"
              onClick={() => setExpandedPhoto(null)}
            >
               <button
                 onClick={() => setExpandedPhoto(null)}
                 className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
               >
                 <X size={36} />
               </button>
               
               <motion.img 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  src={expandedPhoto.src} 
                  alt={expandedPhoto.title}
                  className="max-w-[90vw] max-h-[75vh] object-contain rounded-md shadow-2xl border-4 border-white"
                  onClick={(e) => e.stopPropagation()}
               />
               <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-center max-w-2xl bg-black/40 p-4 rounded-xl flex flex-col items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
               >
                  <h3 className="text-white font-handwriting text-3xl">{expandedPhoto.title}</h3>
                  {expandedPhoto.extract && <p className="text-white/80 font-sans text-sm">{expandedPhoto.extract}</p>}
                  
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                      <a 
                         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(expandedPhoto.title + ' ' + (countryNameForWiki || ''))}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-sans text-sm font-medium transition-colors border border-white/30 backdrop-blur-sm"
                      >
                         <MapPin size={14} /> View on Google Maps
                      </a>
                      
                      {expandedPhoto.articleUrl && (
                         <a 
                           href={expandedPhoto.articleUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-sans text-sm font-medium transition-colors border border-white/30 backdrop-blur-sm"
                         >
                            <ExternalLink size={14} /> View Travel Guide
                         </a>
                      )}
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
      
      {/* Dimmed backdrop blocking the left side behind polaroids but not map */}
      {selectedCountry && (
          <div 
             className="fixed inset-0 bg-stone-600/10 z-20" 
             onClick={() => setSelectedCountry(null)}
          ></div>
      )}
    </>
  );
}
