import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const { gallery } = useStudio();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const categories = ['ALL', 'EQUIPMENT', 'STUDIO', 'EXTERIOR', 'TRAINING', 'CLASSES'];

  const filteredItems = activeCategory === 'ALL'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredItems.length]);

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setZoomed(false);
    setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setZoomed(false);
    setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-24 bg-zinc-900/60 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700/60 text-xs font-bold uppercase tracking-widest mb-3">
            Studio Floor &amp; Atmosphere
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            Photo Gallery
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Take a visual tour inside Bounce Fitness Studio Chikmagalur. Well-equipped training stations, clean spaces, and athletic focus.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedImageIndex(index);
                setZoomed(false);
              }}
              className="group relative h-64 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 cursor-pointer shadow-md"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover object-center filter contrast-[1.05] group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <span className="self-start px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900/90 text-amber-400 border border-zinc-700/60 backdrop-blur-sm">
                  {item.category}
                </span>

                <div className="flex items-end justify-between">
                  <h4 className="text-xs font-bold text-white line-clamp-2 max-w-[80%]">
                    {item.title}
                  </h4>
                  <div className="w-7 h-7 rounded-full bg-amber-500/90 flex items-center justify-center text-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                {filteredItems[selectedImageIndex].category}
              </span>
              <span className="text-zinc-500">&bull;</span>
              <span className="text-sm font-semibold text-white">
                {selectedImageIndex + 1} of {filteredItems.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoomed(!zoomed)}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
                title={zoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:bg-zinc-800"
                title="Close Lightbox (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-zinc-900/80 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-700/60 transition-all cursor-pointer shadow-lg"
              title="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center p-2">
              <img
                src={filteredItems[selectedImageIndex].imageUrl}
                alt={filteredItems[selectedImageIndex].title}
                className={`max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 ${
                  zoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setZoomed(!zoomed)}
              />
            </div>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-zinc-900/80 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-700/60 transition-all cursor-pointer shadow-lg"
              title="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption */}
          <div className="text-center z-10 pb-2">
            <h4 className="text-base sm:text-lg font-display uppercase tracking-wider text-white">
              {filteredItems[selectedImageIndex].title}
            </h4>
            <p className="text-xs text-zinc-500 mt-0.5">
              Bounce Fitness Studio &bull; Chikmagalur, Karnataka
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
