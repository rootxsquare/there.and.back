import { PassportSelector } from './components/PassportSelector';
import { Map } from './components/Map';
import { DetailPanel } from './components/DetailPanel';
import { usePassportStore } from './store/usePassportStore';

function App() {
  const selectedCountry = usePassportStore((state) => state.selectedCountry);

  return (
    <div className="h-screen w-screen fixed inset-0 overflow-hidden flex flex-col bg-[#eedc9a]">
      <DetailPanel />
      {/* Header Overlay */}
      <header className="absolute top-4 left-4 z-10 p-4 polaroid rounded-md">
        <h1 className="text-4xl font-handwriting font-bold text-stone-800 drop-shadow-sm flex items-center gap-2">
          <span className="-rotate-3 inline-block">✈️</span> 
          There and Back
        </h1>

      </header>

      {/* Main Map Area */}
      <main className={`flex-1 bg-stone-200/50 w-full h-full overflow-hidden relative transition-all duration-700 ${selectedCountry ? 'blur-[4px] brightness-95 scale-[0.99]' : ''}`}>
        <Map />
      </main>

      {/* Passport Selector Overlay Placeholder */}
      {/* Passport Selector Overlay Placeholder */}
      <div className="absolute top-6 right-6 z-10 w-[350px]">
         <div className="polaroid rounded-lg p-6 w-full">
            <div className="washi-tape-blue right-2"></div>
            <h2 className="font-handwriting text-3xl mb-1 font-bold">My Passports</h2>
            <p className="text-sm font-sans mb-4 text-stone-600 block">Add your citizenships to see where you can travel!</p>
            <PassportSelector />
         </div>
      </div>
    </div>
  );
}

export default App;
