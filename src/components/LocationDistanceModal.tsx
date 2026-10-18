import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, ExternalLink, X, Car, Footprints, AlertCircle, CheckCircle2, Phone, RotateCw } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface LocationDistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Bounce Fitness Studio Coordinates in Chikkamagaluru
const STUDIO_COORDS = {
  lat: 13.3223712,
  lng: 75.793983,
  name: 'Bounce Fitness Studio',
  plusCode: '8QCV+WH Chikkamagaluru, Karnataka',
  address: 'Opp. Chikmagalur Coffee Works, Gundappa Gowda Arcade, Kalyan Nagar, Jyothi Nagar, Chikkamagaluru',
  mapsShortUrl: 'https://maps.app.goo.gl/V4SnWmRmTnYMvcob6',
};

// Popular Chikkamagaluru Hubs for instant distance calculation
const LOCAL_HUBS = [
  { name: 'Chikkamagaluru KSRTC Bus Stand', distKm: 1.2, driveMin: 3, walkMin: 15, area: 'Bus Stand Road' },
  { name: 'Jyothi Nagar / Kalyan Nagar Circle', distKm: 0.25, driveMin: 1, walkMin: 3, area: 'Jyothi Nagar' },
  { name: 'Coffee Board Layout / Indira Gandhi Rd', distKm: 0.9, driveMin: 2, walkMin: 11, area: 'Indira Gandhi Rd' },
  { name: 'Azad Park / District Stadium', distKm: 1.5, driveMin: 4, walkMin: 19, area: 'Stadium Area' },
  { name: 'Ramanahalli / Ring Road Junction', distKm: 2.4, driveMin: 6, walkMin: 30, area: 'Ramanahalli' },
  { name: 'Indavara Lake / Bypass Road', distKm: 3.8, driveMin: 8, walkMin: 48, area: 'Bypass' },
];

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
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
}

export const LocationDistanceModal: React.FC<LocationDistanceModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useStudio();
  const [geoState, setGeoState] = useState<'idle' | 'locating' | 'success' | 'denied' | 'error'>('idle');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [selectedHub, setSelectedHub] = useState<typeof LOCAL_HUBS[0] | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    if (isOpen && geoState === 'idle') {
      detectUserLocation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setGeoState('error');
      setErrorDetails('Geolocation is not supported by your browser.');
      return;
    }

    setGeoState('locating');
    setErrorDetails('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });

        const dist = calculateHaversineDistance(lat, lng, STUDIO_COORDS.lat, STUDIO_COORDS.lng);
        setDistanceKm(dist);
        setGeoState('success');
      },
      (err) => {
        console.warn('Geolocation permission denied or timed out:', err);
        setGeoState('denied');
        if (err.code === err.PERMISSION_DENIED) {
          setErrorDetails('Location permission was denied. You can check distances from Chikkamagaluru landmarks below.');
        } else {
          setErrorDetails('Could not obtain precise GPS signal. Showing local landmarks below.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Turn by turn navigation link
  const getNavigationUrl = () => {
    if (userCoords) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${STUDIO_COORDS.lat},${STUDIO_COORDS.lng}&destination_place_id=0x3bbad77989f350b1:0x334fc8bac7b2d0f8`;
    }
    return STUDIO_COORDS.mapsShortUrl;
  };

  // Drive and walk calculations
  const displayDist = distanceKm !== null ? distanceKm : (selectedHub ? selectedHub.distKm : null);
  const estDriveMin = displayDist ? Math.max(1, Math.round(displayDist * 2.5)) : null;
  const estWalkMin = displayDist ? Math.max(2, Math.round(displayDist * 12)) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              <MapPin className="w-3 h-3" />
              <span>Google Maps Verified Studio</span>
            </div>
            <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
              Studio Location &amp; Distance
            </h3>
          </div>
        </div>

        {/* Location Identity Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-6 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-display font-bold text-lg text-white">
                Bounce Fitness Studio
              </h4>
              <p className="text-xs text-amber-400 font-mono font-bold mt-0.5">
                Plus Code: {STUDIO_COORDS.plusCode}
              </p>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {STUDIO_COORDS.address}
              </p>
            </div>
            <a
              href={STUDIO_COORDS.mapsShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 shrink-0 shadow-lg transition-transform hover:scale-105"
              title="Open Google Maps Place"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
            <span>Coordinates: <strong className="text-zinc-200">13.3223712° N, 75.793983° E</strong></span>
            <a
              href={`tel:${settings.phone}`}
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>

        {/* GPS Live Distance Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 border border-amber-500/30 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>Distance From Your Current Location</span>
            </span>
            <button
              onClick={detectUserLocation}
              disabled={geoState === 'locating'}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-white bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${geoState === 'locating' ? 'animate-spin' : ''}`} />
              <span>{geoState === 'locating' ? 'Detecting...' : 'Re-calculate'}</span>
            </button>
          </div>

          {geoState === 'locating' && (
            <div className="py-6 text-center space-y-2">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-zinc-300 font-medium">
                Fetching GPS coordinates from your device...
              </p>
              <p className="text-[11px] text-zinc-500">
                Please allow location access when prompted by your browser
              </p>
            </div>
          )}

          {geoState === 'success' && distanceKm !== null && (
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-4xl text-amber-400">
                  {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`}
                </span>
                <span className="text-xs font-semibold uppercase text-zinc-400">
                  from your current location
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Driving Time</span>
                    <strong className="text-sm font-bold text-white">~{estDriveMin} mins</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Walking Time</span>
                    <strong className="text-sm font-bold text-white">~{estWalkMin} mins</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Live GPS location acquired successfully!</span>
              </div>
            </div>
          )}

          {(geoState === 'denied' || geoState === 'error') && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>{errorDetails || 'GPS location not available. Select your nearest landmark below to calculate distance.'}</span>
              </div>

              {selectedHub && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Distance from {selectedHub.name}:</span>
                    <strong className="text-lg font-bold text-amber-400">{selectedHub.distKm} km</strong>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-300">
                    <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-amber-400" /> ~{selectedHub.driveMin} mins drive</span>
                    <span className="flex items-center gap-1.5"><Footprints className="w-3.5 h-3.5 text-emerald-400" /> ~{selectedHub.walkMin} mins walk</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chikkamagaluru Landmarks Distance Picker */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Select Nearest Landmark in Chikkamagaluru
            </h5>
            <span className="text-[10px] text-zinc-500">Tap to calculate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LOCAL_HUBS.map((hub) => {
              const isSelected = selectedHub?.name === hub.name;
              return (
                <button
                  key={hub.name}
                  onClick={() => setSelectedHub(hub)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold truncate">{hub.name}</p>
                    <p className="text-[10px] text-zinc-500">{hub.area}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-400 block">{hub.distKm} km</span>
                    <span className="text-[9px] text-zinc-500">~{hub.driveMin}m drive</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={getNavigationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-base font-bold shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Navigation className="w-5 h-5 fill-zinc-950" />
            <span>Open Google Maps Turn-By-Turn Navigation</span>
          </a>

          <a
            href={STUDIO_COORDS.mapsShortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-semibold text-xs tracking-wider uppercase transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>Open Bounce Fitness Studio Listing on Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};
