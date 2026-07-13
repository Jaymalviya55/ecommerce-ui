import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import type { AnalyticsData } from './types';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface LocationSalesMapProps {
  data: AnalyticsData['locationSales'];
}

export const LocationSalesMap = ({ data }: LocationSalesMapProps) => {
  return (
    <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Sales By Location</h3>
      
      {/* Interactive World Map */}
      <div className="flex-1 min-h-[160px] flex items-center justify-center mb-6 overflow-hidden rounded-xl bg-slate-50/50 dark:bg-slate-900/50 cursor-move">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }} style={{ width: "100%", height: "100%" }}>
            <ZoomableGroup 
              zoom={data.some(l => l.location.toLowerCase().includes('india')) ? 3 : 1} 
              center={data.some(l => l.location.toLowerCase().includes('india')) ? [78.9629, 20.5937] : [20, 20]} 
              minZoom={1} maxZoom={8}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name;
                    const isMatched = data.some(loc => loc.location.toLowerCase().includes(countryName.toLowerCase()));
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isMatched ? "#8b5cf6" : "#f1f5f9"}
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none", transition: "all 250ms" },
                          hover: { fill: isMatched ? "#7c3aed" : "#e2e8f0", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
      </div>

      <div className="space-y-5">
          {data.length > 0 ? (
              data.slice(0,4).map((loc, idx) => (
                  <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{loc.location}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{(loc.revenue/1000).toFixed(1)}k</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${loc.percentage}%` }} />
                      </div>
                  </div>
              ))
          ) : (
              <div className="text-slate-400 text-sm text-center pt-8">No location data.</div>
          )}
      </div>
    </div>
  );
};
