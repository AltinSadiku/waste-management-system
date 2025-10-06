import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, Polyline, ScaleControl, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BottomSheet from '../components/BottomSheet';
import { binsAPI } from '../services/api';
import { MapPin, Sun, Moon, LocateFixed, X, SlidersHorizontal } from 'lucide-react';

// Backend bins

export default function MapView() {
  const [selected, setSelected] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'GENERAL', address: '', fillLevel: 0 });
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [mapStyle, setMapStyle] = useState('light');
  const [typeFilters, setTypeFilters] = useState(new Set());
  const [maxFill, setMaxFill] = useState(1);
  const center = useMemo(() => [42.6629, 21.1655], []);

  const getFillColor = (fill) => (fill < 0.5 ? '#22c55e' : fill < 0.8 ? '#f59e0b' : '#ef4444');

  const createBinIcon = (fill) =>
    L.divIcon({
      className: 'custom-bin-icon',
      html: `<div style="width:20px;height:20px;border-radius:50%;background:${getFillColor(
        fill
      )};box-shadow:0 0 0 3px white, 0 2px 8px rgba(0,0,0,0.3);border:2px solid white"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

  const createClusterIcon = (count) =>
    L.divIcon({
      className: 'custom-cluster-icon',
      html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#10b981;color:white;font-weight:700;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:12px">${count}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

  const clusterBins = (bins) => {
    const threshold = 0.002; // ~200m rough threshold
    const clusters = [];
    bins.forEach((b) => {
      let found = null;
      for (const c of clusters) {
        if (Math.abs(c.lat - b.lat) < threshold && Math.abs(c.lng - b.lng) < threshold) {
          found = c;
          break;
        }
      }
      if (found) {
        found.items.push(b);
        // simple centroid update
        found.lat = (found.lat * (found.items.length - 1) + b.lat) / found.items.length;
        found.lng = (found.lng * (found.items.length - 1) + b.lng) / found.items.length;
      } else {
        clusters.push({ lat: b.lat, lng: b.lng, items: [b] });
      }
    });
    return clusters;
  };

  function ClickCapture({ onPick }) {
    useMapEvent('click', (e) => {
      if (!adding) return;
      const { lat, lng } = e.latlng;
      const draftBin = { id: 'draft', lat, lng, type: form.type, fill: form.fillLevel, address: form.address, name: form.name };
      setDraft(draftBin);
      setSelected(null);
    });
    return null;
  }

  function FitRouteBounds({ points }) {
    const map = useMap();
    useEffect(() => {
      if (!points || points.length < 2) return;
      const bounds = L.latLngBounds(points.map((p) => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [40, 40] });
    }, [points, map]);
    return null;
  }

  const handleLocateMe = () => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClearRoute = () => setRouteCoords(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    binsAPI
      .getBins()
      .then((res) => {
        if (!mounted) return;
        const normalized = (res.data || []).map((b) => ({
          id: b.id,
          lat: b.latitude,
          lng: b.longitude,
          type: b.type || 'GENERAL',
          fill: b.fillLevel ?? 0,
          address: b.address || 'Unknown address',
          name: b.name,
        }));
        setBins(normalized);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const findNearest = async () => {
    const [clat, clng] = center;
    try {
      const res = await binsAPI.getNearest(clat, clng, 0.7);
      const b = res.data;
      if (!b) {
        setSelected(bins[0] || null);
        return;
      }
      setSelected({
        id: b.id,
        lat: b.latitude,
        lng: b.longitude,
        type: b.type || 'GENERAL',
        fill: b.fillLevel ?? 0,
        address: b.address || 'Unknown address',
        name: b.name,
      });
    } catch (e) {
      // fallback to local calc on error
      let best = null;
      let bestD = Number.POSITIVE_INFINITY;
      (bins || []).forEach((bin) => {
        const d = Math.hypot(bin.lat - clat, bin.lng - clng);
        if (bin.fill <= 0.7 && d < bestD) {
          best = bin;
          bestD = d;
        }
      });
      setSelected(best || bins[0] || null);
    }
  };

  const handleNavigate = () => {
    if (!selected) return;
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const start = [latitude, longitude];
        const dest = [selected.lat, selected.lng];
        setUserLocation(start);

        try {
          // OSRM expects lon,lat
          const url = `https://router.project-osrm.org/route/v1/driving/${encodeURIComponent(
            `${start[1]},${start[0]}`
          )};${encodeURIComponent(`${dest[1]},${dest[0]}`)}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('OSRM request failed');
          const data = await res.json();
          const coords = data?.routes?.[0]?.geometry?.coordinates;
          if (Array.isArray(coords) && coords.length) {
            // Convert [lon, lat] -> [lat, lon]
            const latlngs = coords.map((c) => [c[1], c[0]]);
            setRouteCoords(latlngs);
            return;
          }
          // Fallback to straight line if geometry missing
          setRouteCoords([start, dest]);
        } catch (err) {
          // Network or parse error: fallback to straight line
          setRouteCoords([start, dest]);
        }
      },
      () => {
        // If denied, do nothing (no route without location)
        setRouteCoords(null);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Waste Bin Map</h1>
                  <p className="text-green-100 mt-1">
                    Find nearby waste bins and manage your waste disposal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
            <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive Map</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Explore waste bins in your area</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => {
                      setAdding((v) => !v);
                      setDraft(null);
                    }}
                    className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      adding 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    {adding ? 'Click map to place bin…' : 'Add New Bin'}
                  </button>
                  
                  <button 
                    onClick={findNearest} 
                    className="inline-flex items-center px-6 py-3 rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <LocateFixed className="h-5 w-5 mr-2" />
                    Find Nearest
                  </button>
                  
                  <button
                    onClick={()=>setMapStyle(s=>s==='light'?'dark':'light')}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-lg transition-all duration-200"
                    aria-label="Toggle map style"
                    title={mapStyle==='light'?'Switch to dark map':'Switch to light map'}
                  >
                    {mapStyle==='light'? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-[70vh] relative">
          <div className="absolute left-4 top-4 z-[500] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl px-4 py-4 min-w-[280px]">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filters</div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Bin Types</div>
                <div className="grid grid-cols-2 gap-2">
                  {['GENERAL','GLASS','PAPER','PLASTIC','METAL','ORGANIC'].map((t)=> (
                    <button
                      key={t}
                      onClick={()=>setTypeFilters(prev=>{const n=new Set(prev); if(n.has(t)) n.delete(t); else n.add(t); return n;})}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                        typeFilters.has(t)
                          ?'bg-green-600 text-white border-green-600 shadow-md' 
                          :'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Max Fill Level</div>
                <div className="flex items-center gap-3">
                  <input 
                    className="flex-1 accent-green-600" 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={Math.round(maxFill*100)} 
                    onChange={(e)=>setMaxFill(Number(e.target.value)/100)} 
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12 text-right">{Math.round(maxFill*100)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-4 z-[500] flex flex-col gap-3">
            <button 
              onClick={handleLocateMe} 
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-xl" 
              title="Locate me" 
              aria-label="Locate me"
            >
              <LocateFixed className="w-5 h-5 text-gray-700 dark:text-gray-300"/>
            </button>
            <button 
              onClick={()=>setRouteCoords(null)} 
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-xl" 
              title="Clear route" 
              aria-label="Clear route"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300"/>
            </button>
          </div>

          <div className="absolute left-4 bottom-4 z-[500] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl px-4 py-4 min-w-[200px]">
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm">Fill Level Legend</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="inline-block w-4 h-4 rounded-full shadow-sm" style={{background:'#22c55e'}}></span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Low fill (&lt;50%)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block w-4 h-4 rounded-full shadow-sm" style={{background:'#f59e0b'}}></span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Medium (50-79%)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block w-4 h-4 rounded-full shadow-sm" style={{background:'#ef4444'}}></span>
                <span className="text-sm text-gray-700 dark:text-gray-300">High (80%+)</span>
              </div>
            </div>
          </div>

          <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap, &copy; CARTO'
              url={mapStyle==='light'?'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png':'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
            />
            <ScaleControl position="bottomright" />
            <ClickCapture />
            {userLocation && (
              <>
                <CircleMarker
                  center={userLocation}
                  radius={12}
                  pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.3, weight: 3 }}
                />
                <CircleMarker
                  center={userLocation}
                  radius={6}
                  pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.8, weight: 2 }}
                />
              </>
            )}
            {routeCoords && (
              <>
                <Polyline 
                  positions={routeCoords} 
                  pathOptions={{ 
                    color: '#10b981', 
                    weight: 6, 
                    opacity: 0.8,
                    dashArray: '10, 10',
                    dashOffset: '0'
                  }} 
                />
                <Polyline 
                  positions={routeCoords} 
                  pathOptions={{ 
                    color: '#ffffff', 
                    weight: 8, 
                    opacity: 0.3
                  }} 
                />
                <FitRouteBounds points={routeCoords} />
              </>
            )}
            {!loading && bins.length === 0 && (
              <></>
            )}
            {clusterBins((bins||[]).filter(b => (typeFilters.size? typeFilters.has(b.type): true) && (b.fill ?? 0) <= maxFill)).map((c, idx) =>
              c.items.length > 1 ? (
                <Marker
                  key={`cluster-${idx}`}
                  position={[c.lat, c.lng]}
                  icon={createClusterIcon(c.items.length)}
                  eventHandlers={{ click: () => setSelected(c.items[0]) }}
                />
              ) : (
                <Marker
                  key={c.items[0].id}
                  position={[c.items[0].lat, c.items[0].lng]}
                  icon={createBinIcon(c.items[0].fill)}
                  eventHandlers={{ click: () => setSelected(c.items[0]) }}
                />
              )
            )}
            {draft && (
              <Marker position={[draft.lat, draft.lng]} icon={createBinIcon(draft.fill || 0)} />
            )}
          </MapContainer>
            </div>
          </div>
        </div>
      </div>

      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected ? 'Bin details' : ''}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-xs uppercase tracking-wide text-gray-500">Type</div>
                <div className="mt-1 font-semibold flex items-center gap-2">
                  {selected.type}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {selected.type === 'GENERAL' ? 'General' : selected.type}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-right">
                <div className="text-xs uppercase tracking-wide text-gray-500">Fill level</div>
                <div className="mt-1 font-semibold">{Math.round(selected.fill * 100)}%</div>
                <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      selected.fill < 0.5 ? 'bg-green-500' : selected.fill < 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.round(selected.fill * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="text-xs uppercase tracking-wide text-gray-500">Address</div>
              <div className="mt-1 font-semibold">{selected.address}</div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleNavigate} className="inline-flex items-center px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
                <MapPin className="w-4 h-4 mr-1" /> Navigate
              </button>
              <button className="inline-flex items-center px-3 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">
                Report issue
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      <BottomSheet open={!!draft} onClose={() => setDraft(null)} title="Add New Bin" subtitle="Fill in the details for the new waste bin">
        {draft && (
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              await binsAPI.createBin({
                name: form.name || undefined,
                type: form.type,
                address: form.address || undefined,
                latitude: draft.lat,
                longitude: draft.lng,
                fillLevel: form.fillLevel ?? 0,
              });
              setDraft(null);
              setAdding(false);
              setForm({ name: '', type: 'GENERAL', address: '', fillLevel: 0 });
              // reload
              setLoading(true);
              const res = await binsAPI.getBins();
              const normalized = (res.data || []).map((b) => ({
                id: b.id,
                lat: b.latitude,
                lng: b.longitude,
                type: b.type || 'GENERAL',
                fill: b.fillLevel ?? 0,
                address: b.address || 'Unknown address',
                name: b.name,
              }));
              setBins(normalized);
              setLoading(false);
            }}
          >
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Bin Name</label>
              <input 
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
                value={form.name} 
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
                placeholder="Enter bin name (optional)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Bin Type</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="GENERAL">🗑️ General</option>
                  <option value="GLASS">🍷 Glass</option>
                  <option value="PAPER">📄 Paper</option>
                  <option value="PLASTIC">♻️ Plastic</option>
                  <option value="METAL">🔩 Metal</option>
                  <option value="ORGANIC">🌱 Organic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Fill Level (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={Math.round((form.fillLevel || 0) * 100)}
                  onChange={(e) => setForm((f) => ({ ...f, fillLevel: Math.min(100, Math.max(0, Number(e.target.value))) / 100 }))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Address</label>
              <input 
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
                value={form.address} 
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} 
                placeholder="Enter address (optional)"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Latitude</label>
                <input 
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed" 
                  value={draft.lat.toFixed(6)} 
                  readOnly 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Longitude</label>
                <input 
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed" 
                  value={draft.lng.toFixed(6)} 
                  readOnly 
                />
              </div>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setDraft(null)} 
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Save Bin
              </button>
            </div>
          </form>
        )}
      </BottomSheet>
    </div>
  );
}


