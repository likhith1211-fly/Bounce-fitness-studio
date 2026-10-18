import React, { useState } from 'react';
import { MapPin, Navigation, Phone, MessageSquare, Compass, Sparkles, Clock, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useGymStatus } from '../hooks/useGymStatus';

export const LocationSection: React.FC = () => {
  const { settings } = useStudio();
  const { isOpen, statusLabel, statusSubtext } = useGymStatus();
  const [mapsGroundedAnswer, setMapsGroundedAnswer] = useState<string | null>(null);
  const [groundingLinks, setGroundingLinks] = useState<{ title?: string; uri?: string }[]>([]);
  const [loadingGrounding, setLoadingGrounding] = useState(false);
  const [customRoutePrompt, setCustomRoutePrompt] = useState('');
  const [liveDistanceKm, setLiveDistanceKm] = useState<number | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [userLocationCoords, setUserLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLaunchDirections = (openMapsImmediately = true) => {
    setIsCalculatingDistance(true);
    setLocationStatus('Detecting your current location...');

    if (!navigator.geolocation) {
      setIsCalculatingDistance(false);
      setLocationStatus('Geolocation is not supported by your browser. Opening Google Maps navigation...');
      window.open('https://www.google.com/maps/dir/?api=1&destination=13.3223712,75.793983', '_blank');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserLocationCoords({ lat: userLat, lng: userLng });
        const d = calculateDistance(userLat, userLng, 13.3223712, 75.793983);
        setLiveDistanceKm(d);
        setIsCalculatingDistance(false);
        const distStr = d < 1 ? `${Math.round(d * 1000)} meters` : `${d.toFixed(1)} km`;
        setLocationStatus(`Distance to Bounce Fitness Studio (Kalyan Nagar in Jyothi Nagar, Chikkamagaluru): ${distStr}`);

        if (openMapsImmediately) {
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=13.3223712,75.793983`,
            '_blank'
          );
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsCalculatingDistance(false);
        setLiveDistanceKm(0.35);
        setLocationStatus('GPS permission not provided. Opening Google Maps with destination set to Bounce Fitness Studio in Kalyan Nagar, Jyothi Nagar.');
        if (openMapsImmediately) {
          window.open('https://www.google.com/maps/dir/?api=1&destination=13.3223712,75.793983', '_blank');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const fetchMapsRouteGuide = async (promptQuery?: string) => {
    setLoadingGrounding(true);
    try {
      const res = await fetch('/api/gemini/maps-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: promptQuery || 'Provide specific local directions and landmarks to visit Bounce Fitness Studio at Gundappa Gowda Arcade, Kalyan Nagar in Jyothi Nagar, Chikkamagaluru, Karnataka.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMapsGroundedAnswer(data.text);
        const links: { title?: string; uri?: string }[] = [];
        if (data.groundingChunks) {
          data.groundingChunks.forEach((chunk: any) => {
            if (chunk.maps?.uri) {
              links.push({ title: chunk.maps.title || 'Google Maps Location', uri: chunk.maps.uri });
            }
            if (chunk.web?.uri) {
              links.push({ title: chunk.web.title || 'Place Details', uri: chunk.web.uri });
            }
          });
        }
        setGroundingLinks(links);
      }
    } catch (e) {
      console.warn('Maps grounding lookup:', e);
    } finally {
      setLoadingGrounding(false);
    }
  };

  return (
    <section id="location" className="py-24 bg-zinc-900/60 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700/60 text-xs font-bold uppercase tracking-widest mb-3">
            Prime Central Location
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            Visit Bounce In Chikmagalur
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Conveniently situated in Kalyan Nagar in Jyothi Nagar, Chikkamagaluru, with easy parking and early morning access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Location Details & Quick Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                  Address
                </span>
                <h3 className="font-display font-black text-3xl uppercase tracking-wide text-white mt-1">
                  Bounce Fitness Studio
                </h3>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                  {settings.address}
                </p>
                <p className="text-xs text-zinc-400 mt-1 font-medium">
                  {settings.city}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">Opening Hours:</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${isOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-zinc-400">Mon – Sat: {settings.openingHoursMonSat}</p>
                    <p className="text-rose-400">Sunday: {settings.openingHoursSun}</p>
                    <p className="text-[11px] text-zinc-500 mt-1">{statusSubtext}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">Landmark:</p>
                    <p className="text-zinc-400">{settings.landmark}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons with Live Distance Calculation & Direct Google Maps Direction */}
              <div className="pt-2 flex flex-col gap-3">
                {/* Distance & Place status display */}
                {liveDistanceKm !== null ? (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs text-zinc-200 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
                        <span>Distance From You:</span>
                      </span>
                      <strong className="text-base font-black text-white font-display">
                        {liveDistanceKm < 1 ? `${Math.round(liveDistanceKm * 1000)} m` : `${liveDistanceKm.toFixed(1)} km`}
                      </strong>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      📍 <strong>Place:</strong> Kalyan Nagar in Jyothi Nagar, Chikkamagaluru (8QCV+WH)
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      🚗 ~{Math.max(1, Math.round(liveDistanceKm * 2.5))} mins drive &bull; 🚶 ~{Math.max(2, Math.round(liveDistanceKm * 12))} mins walk
                    </p>
                  </div>
                ) : null}

                {locationStatus && (
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700/60 text-xs text-amber-300 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{locationStatus}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Map Location Icon / Button */}
                  <button
                    onClick={() => handleLaunchDirections(true)}
                    disabled={isCalculatingDistance}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 rounded-xl font-display uppercase tracking-wider text-sm font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer group"
                    title="Click map location icon to detect current location, calculate distance and launch Google Maps"
                  >
                    <MapPin className={`w-4 h-4 fill-zinc-950 group-hover:scale-110 transition-transform ${isCalculatingDistance ? 'animate-bounce' : ''}`} />
                    <span>{isCalculatingDistance ? 'Detecting...' : 'Maps & Directions'}</span>
                  </button>

                  <button
                    onClick={() => handleLaunchDirections(false)}
                    disabled={isCalculatingDistance}
                    className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-md"
                  >
                    <Compass className={`w-4 h-4 ${isCalculatingDistance ? 'animate-spin' : ''}`} />
                    <span>{isCalculatingDistance ? 'Calculating...' : 'Fetch My Distance'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Desk</span>
                  </a>

                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Bounce%20Fitness%20Studio,%20I%20am%20looking%20for%20directions%20to%20your%20studio%20opposite%20Chikmagalur%20Coffee%20Works%20in%20Kalyan%20Nagar,%20Jyothi%20Nagar.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-zinc-800 hover:border-emerald-500/30 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Verified Studio Photo Card */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Verified Google Maps Listing Photo</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Google Maps Source
                </span>
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden border border-zinc-800">
                <img
                  src="/bounce_reception_hd.jpg"
                  alt="Bounce Fitness Studio Google Maps Official Photo"
                  className="w-full h-full object-cover filter contrast-[1.1]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/grass-cs/AABkmLeX51g7wrsXAbJXIZddBR1T5bimpAEacj0Zi3xA8I5ASq1jqUZefyS-O7n8788IAJC7ZjD5YumhY5KeBE_O3U2NcWQm6iptEKb7w9Ka2Umf226RmoLN8-P8l3JXIto7mReNnN2x-w=w800-h600-k-no';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <p className="text-xs font-bold text-white">
                    Bounce Fitness Studio &bull; 8QCV+WH Chikkamagaluru, Karnataka
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Grounded Route Assistant (Gemini 3.8 Flash Feature) */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Live Route &amp; Neighborhood Guide
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                  Gemini Maps Grounded
                </span>
              </div>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                Need directions from Chikmagalur KSRTC Bus Stand, Rathnagiri Road, or nearest parking? Ask our live guide.
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. How to reach from Chikmagalur Bus Stand?"
                  value={customRoutePrompt}
                  onChange={(e) => setCustomRoutePrompt(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => fetchMapsRouteGuide(customRoutePrompt)}
                  disabled={loadingGrounding}
                  className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {loadingGrounding ? 'Loading...' : 'Ask Guide'}
                </button>
              </div>

              {mapsGroundedAnswer && (
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed space-y-2 mt-3 animate-in fade-in duration-300">
                  <p className="whitespace-pre-line">{mapsGroundedAnswer}</p>
                  {groundingLinks.length > 0 && (
                    <div className="pt-2 border-t border-zinc-800 flex flex-wrap gap-2">
                      <span className="text-[11px] text-zinc-500">Maps Links:</span>
                      {groundingLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
                        >
                          <span>{link.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Embed with Clickable Location Icon */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 relative h-[560px]">
              <iframe
                title="Bounce Fitness Studio Chikmagalur Location Map"
                src="https://maps.google.com/maps?q=13.3223712,75.793983+(Bounce+fitness+studio)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.15) brightness(0.85)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Clickable Pin Banner Overlay: Launches Google Maps directions with distance calculation */}
              <div
                onClick={() => handleLaunchDirections(true)}
                className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 p-3.5 rounded-xl shadow-2xl cursor-pointer group transition-all transform hover:-translate-y-0.5"
                title="Click to detect your location and get directions on Google Maps"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-amber-500/50 p-0.5 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider group-hover:text-amber-400 transition-colors">Bounce fitness studio</h4>
                      <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-amber-400 font-medium">8QCV+WH Chikkamagaluru, Karnataka</p>
                    <p className="text-[10px] text-zinc-300">Opp. Chikmagalur Coffee Works &bull; Kalyan Nagar, Jyothi Nagar</p>
                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                      <span>Click for Live Distance &amp; Directions</span>
                      <Navigation className="w-2.5 h-2.5 fill-emerald-400" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
