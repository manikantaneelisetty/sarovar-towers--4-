import React, {
  useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, memo, forwardRef
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Sofa, UtensilsCrossed, ChefHat, Flame, BedDouble, Bed, ShowerHead,
  Shirt, Clapperboard, Briefcase, Trees, Waves, Dumbbell, HardHat, Video,
  X, ChevronLeft, ChevronRight, Play, MapPin, Layers, Quote, ZoomIn, ArrowDown,
  Heart, ArrowUp, Image as ImageIcon, Film, SlidersHorizontal, Volume2, VolumeX, Sparkles
} from 'lucide-react';

/* =========================================================================
   TOKENS
   Base theme matches the existing site (#050608 / --primary cyan-blue
   engineering glow). Gold is the second accent, used sparingly for
   stats, dividers and the active-nav indicator — "engineering + craft".
========================================================================= */
const GOLD = '#D4AF37';
const GOLD_SOFT = 'rgba(212, 175, 55, 0.18)';
const BLUE = 'rgba(56, 189, 248, 0.9)';
const EASE = [0.16, 1, 0.3, 1];

/* =========================================================================
   DATA
   Programmatically assembled so the 16 requested rooms/zones each get a
   hero, stats, mixed-media wall, a design -> construction -> completion
   -> walkthrough story strip, materials, longer editorial copy, a
   before/after comparison where it matters, and a guaranteed walkthrough
   clip — without hand-typing near-duplicate content 16 times. Swap the
   img/videoSrc paths for real assets; everything else is real, considered
   copy.
========================================================================= */
const CATEGORY_META = [
  { id: 'exterior', title: 'Exterior', icon: Building2, tagline: 'The first impression, engineered to last generations.' },
  { id: 'living-room', title: 'Living Room', icon: Sofa, tagline: "Where the family's day begins and ends." },
  { id: 'dining-area', title: 'Dining Area', icon: UtensilsCrossed, tagline: 'A table built for gathering, lit for every hour.' },
  { id: 'dry-kitchen', title: 'Dry Kitchen', icon: ChefHat, tagline: 'Everyday cooking, engineered for calm.' },
  { id: 'wet-kitchen', title: 'Wet Kitchen', icon: Flame, tagline: 'Where the real work happens, built to take the heat.' },
  { id: 'master-bedroom', title: 'Master Bedroom', icon: BedDouble, tagline: 'A private retreat tuned to light and silence.' },
  { id: 'bedroom-suites', title: 'Bedroom Suites', icon: Bed, tagline: 'Every suite finished to the same exacting standard.' },
  { id: 'luxury-bathroom', title: 'Luxury Bathroom', icon: ShowerHead, tagline: 'Spa-grade detailing behind every door.' },
  { id: 'walk-in-wardrobe', title: 'Walk-in Wardrobe', icon: Shirt, tagline: 'Storage as considered as the rooms around it.' },
  { id: 'family-entertainment', title: 'Family Entertainment', icon: Clapperboard, tagline: 'A room built entirely around sound and light.' },
  { id: 'home-office', title: 'Home Office', icon: Briefcase, tagline: 'A workspace with the quiet of a library.' },
  { id: 'landscape', title: 'Landscape', icon: Trees, tagline: 'Groundwork that softens the architecture above it.' },
  { id: 'swimming-pool', title: 'Swimming Pool', icon: Waves, tagline: 'Structural precision beneath a still surface.' },
  { id: 'fitness-area', title: 'Fitness Area', icon: Dumbbell, tagline: 'A private gym engineered for serious training.' },
  { id: 'construction-progress', title: 'Construction Progress', icon: HardHat, tagline: 'The unseen engineering behind the finish.' },
  { id: 'project-walkthrough', title: 'Project Walkthrough', icon: Video, tagline: 'The entire project, in one continuous take.' }
];

const STATS_BY_ID = {
  exterior: [{ label: 'Facade Area', value: '48,000 sq.ft' }, { label: 'Height', value: '212 ft' }, { label: 'Structural System', value: 'RCC Shear Wall' }],
  'living-room': [{ label: 'Area', value: '1,850 sq.ft' }, { label: 'Ceiling Height', value: '11 ft' }, { label: 'Orientation', value: 'North-East' }],
  'dining-area': [{ label: 'Seating', value: '10 Cover' }, { label: 'Area', value: '620 sq.ft' }, { label: 'Lighting Circuits', value: '4 Zones' }],
  'dry-kitchen': [{ label: 'Area', value: '980 sq.ft' }, { label: 'Storage Runs', value: '3 Modules' }, { label: 'Ventilation', value: 'Concealed Duct' }],
  'wet-kitchen': [{ label: 'Area', value: '410 sq.ft' }, { label: 'Exhaust Capacity', value: '1400 m3/h' }, { label: 'Finish', value: 'Anti-slip Vitrified' }],
  'master-bedroom': [{ label: 'Area', value: '1,600 sq.ft' }, { label: 'Acoustic Rating', value: 'STC 52' }, { label: 'Daylight Factor', value: '2.4%' }],
  'bedroom-suites': [{ label: 'Suites', value: '4 Units' }, { label: 'Avg. Area', value: '1,250 sq.ft' }, { label: 'Finish Tolerance', value: '+/-2mm' }],
  'luxury-bathroom': [{ label: 'Area', value: '210 sq.ft' }, { label: 'Waterproofing', value: '2-Coat Membrane' }, { label: 'Fixtures', value: 'Sensor-based' }],
  'walk-in-wardrobe': [{ label: 'Area', value: '180 sq.ft' }, { label: 'Storage Volume', value: '9.2 m3' }, { label: 'Hardware', value: 'Soft-close' }],
  'family-entertainment': [{ label: 'Area', value: '2,100 sq.ft' }, { label: 'Acoustic Isolation', value: 'STC 58' }, { label: 'AV Points', value: '14 Concealed' }],
  'home-office': [{ label: 'Area', value: '540 sq.ft' }, { label: 'Cable Points', value: '12 Structured' }, { label: 'Noise Floor', value: '< 32 dB' }],
  landscape: [{ label: 'Green Cover', value: '62%' }, { label: 'Irrigation', value: 'Drip-automated' }, { label: 'Native Species', value: '24 Types' }],
  'swimming-pool': [{ label: 'Volume', value: '180,000 L' }, { label: 'Filtration', value: 'Sand + UV' }, { label: 'Depth', value: '1.2m - 2.1m' }],
  'fitness-area': [{ label: 'Area', value: '1,100 sq.ft' }, { label: 'Flooring', value: 'Shock-absorb Rubber' }, { label: 'Ventilation', value: '6 ACH' }],
  'construction-progress': [{ label: 'Duration', value: '34 Months' }, { label: 'Concrete Poured', value: '18,400 m3' }, { label: 'Peak Workforce', value: '640' }],
  'project-walkthrough': [{ label: 'Runtime', value: '6:40 min' }, { label: 'Rooms Covered', value: '16' }, { label: 'Capture', value: 'Drone + Steadicam' }]
};

const MATERIALS_BY_ID = {
  exterior: ['Precast Concrete Facade', 'Structural Glazing', 'Anodized Aluminium'],
  'living-room': ['Italian Marble', 'Brushed Brass', 'Oak Veneer'],
  'dining-area': ['Engineered Wood Flooring', 'Handblown Glass Fixtures'],
  'dry-kitchen': ['Quartz Countertop', 'Matte Laminate'],
  'wet-kitchen': ['Granite Countertop', 'Stainless Steel', 'Vitrified Tile'],
  'master-bedroom': ['Engineered Wood Flooring', 'Linen Textiles', 'Walnut Veneer'],
  'bedroom-suites': ['Engineered Wood Flooring', 'Cotton Textiles'],
  'luxury-bathroom': ['Book-matched Marble', 'Matte Black Fittings'],
  'walk-in-wardrobe': ['Soft-close Hardware', 'Matte Laminate', 'LED Strip Lighting'],
  'family-entertainment': ['Acoustic Panelling', 'Blackout Fabric', 'LED Coving'],
  'home-office': ['Acoustic Ceiling Tile', 'Walnut Veneer'],
  landscape: ['Natural Stone Paving', 'Weathering Steel Edging'],
  'swimming-pool': ['Non-slip Mosaic Tile', 'Stainless Steel Handrail'],
  'fitness-area': ['Shock-absorbent Rubber Flooring', 'Mirror Wall Panels'],
  'construction-progress': ['M40 Grade Concrete', 'TMT Reinforcement Steel'],
  'project-walkthrough': ['-']
};

const TESTIMONIALS_BY_ID = {
  'living-room': { quote: 'The lounge is the first thing every guest comments on, it never feels staged, just calm.', author: 'Resident, Tower B' },
  'master-bedroom': { quote: "It's the quietest room I've ever slept in, in a city this dense.", author: 'Resident, Tower A' },
  'luxury-bathroom': { quote: 'It genuinely feels like a hotel spa, every single morning.', author: 'Resident, Tower B' },
  'project-walkthrough': { quote: 'Watching the walkthrough before possession made the handover feel like no surprise at all.', author: 'Resident, Tower C' }
};

/* Longer editorial copy per zone — replaces a single tagline with a real
   paragraph, so each room reads like it was actually visited and written
   about, not templated. */
const DESCRIPTION_BY_ID = {
  exterior: 'The facade was drawn before a single beam was poured — every reveal line and shadow gap is load-bearing logic on the outside, not applied decoration. What you see from the street is the structure explaining itself.',
  'living-room': 'North-east light was the starting constraint, so the lounge is organised around it: low furniture near the window wall, denser textures toward the core. Nothing in the room fights the light.',
  'dining-area': 'Four separate lighting zones let the same table serve a quiet breakfast and a ten-cover dinner without ever feeling like two different rooms trying to share one address.',
  'dry-kitchen': 'Concealed ducting keeps the everyday kitchen visually silent — the storage runs do the heavy lifting so the counters stay clear for the five minutes a day that actually matter.',
  'wet-kitchen': 'This is the kitchen built to be used hard: anti-slip vitrified underfoot, stainless surfaces that take heat and knives without complaint, and exhaust sized for real Indian cooking, not a showroom demo.',
  'master-bedroom': 'STC 52 acoustic separation and a daylight factor tuned to 2.4% were both design targets before they were finishes — the quiet here is engineered, not incidental.',
  'bedroom-suites': 'Four suites, one standard. Finish tolerance was held to plus-or-minus two millimetres across every unit so no suite in the tower feels like the "other" one.',
  'luxury-bathroom': 'Book-matched marble panels are set in mirrored pairs across the vanity wall, so the veining reads as one continuous pattern rather than four cut slabs.',
  'walk-in-wardrobe': 'Every run was measured against real wardrobes, not catalogue averages — the storage volume here is sized for a family that actually uses all of it.',
  'family-entertainment': 'STC 58 isolation means the loudest movie night in this room is inaudible two doors down. Fourteen concealed AV points mean the equipment never has to be seen to be heard.',
  'home-office': 'A noise floor under 32 decibels was the brief, delivered through an acoustic ceiling and a door seal most people mistake for a soundproof booth.',
  landscape: '62% green cover and twenty-four native species were chosen specifically to survive Hyderabad\'s dry months without turning the irrigation bill into a second mortgage.',
  'swimming-pool': 'Sand-and-UV filtration keeps the water chemistry gentle enough for daily laps, while the depth gradient from 1.2 to 2.1 metres serves both children and lap swimmers in the same volume.',
  'fitness-area': 'Six air changes an hour and shock-absorbent flooring turn a spare room into a space that can actually take a barbell drop without complaint from the floor below.',
  'construction-progress': '18,400 cubic metres of concrete and thirty-four months of sequencing sit behind every finish in this gallery — drag the slider to see the structure before the surfaces arrived.',
  'project-walkthrough': 'Captured in a single continuous pass with drone and steadicam, this is the tower the way you would actually walk it, floor by floor, room by room.'
};

const HIGHLIGHTS_BY_ID = {
  exterior: ['Precast panels cast off-site for tolerance', 'Structural glazing with no visible frame', 'Facade lighting on independent circuit'],
  'living-room': ['Full-height glazing to the north-east', 'Zero visible service ducting', 'Integrated AV without wall clutter'],
  'dining-area': ['Four independently dimmable zones', 'Sightline kept clear to the kitchen pass', 'Acoustic ceiling above the table'],
  'dry-kitchen': ['Soft-close storage on every run', 'Induction-ready electrical loop', 'Concealed extraction ducting'],
  'wet-kitchen': ['1400 m3/h commercial-grade exhaust', 'Anti-slip vitrified underfoot', 'Wash zone isolated from dry storage'],
  'master-bedroom': ['STC 52 acoustic separation', 'Daylight factor tuned to 2.4%', 'Dedicated dressing alcove'],
  'bedroom-suites': ['Identical finish spec across all 4 suites', '+/-2mm tolerance on every joint', 'Independent AC zoning per suite'],
  'luxury-bathroom': ['Book-matched marble vanity wall', 'Sensor-based fixtures throughout', 'Underfloor heating loop'],
  'walk-in-wardrobe': ['9.2 m3 of usable storage volume', 'Soft-close hardware on every drawer', 'LED strip lighting on motion sensor'],
  'family-entertainment': ['STC 58 room-to-room isolation', '14 concealed AV connection points', 'Blackout-rated window treatment'],
  'home-office': ['Noise floor held under 32 dB', '12 structured cable points', 'Acoustic ceiling tile throughout'],
  landscape: ['62% green cover across the plot', 'Fully automated drip irrigation', '24 native, low-water species'],
  'swimming-pool': ['Sand + UV filtration, no heavy chlorine', 'Graduated 1.2m to 2.1m depth', 'Stainless steel handrail entry'],
  'fitness-area': ['Shock-absorbent rubber flooring', '6 air changes per hour', 'Full mirror wall for form-checking'],
  'construction-progress': ['18,400 m3 of M40 concrete poured', '640 workers at peak workforce', '34-month build sequence'],
  'project-walkthrough': ['Single continuous take', 'Drone + steadicam capture', 'All 16 zones covered']
};

/* Before/after drag-comparisons — the zones where "structure vs finish"
   is the most compelling story to tell. Swap in real progress photography;
   the placeholder paths follow the same /images/gallery/<id>/ convention
   as the rest of the gallery. */
const BEFORE_AFTER_BY_ID = {
  exterior: { before: placeholderImage('exterior-structure', 1, 1200, 700), after: placeholderImage('exterior-hero', 1, 1200, 700), beforeLabel: 'Structure', afterLabel: 'Completed Facade' },
  'construction-progress': { before: placeholderImage('construction-foundation', 1, 1200, 700), after: placeholderImage('construction-handover', 1, 1200, 700), beforeLabel: 'Foundation Stage', afterLabel: 'Handover Stage' },
  'swimming-pool': { before: placeholderImage('pool-shell', 1, 1200, 700), after: placeholderImage('pool-hero', 1, 1200, 700), beforeLabel: 'Pool Shell', afterLabel: 'Finished Pool' }
};

/* Master, whole-project showreel — surfaced everywhere via a persistent
   floating action button rather than buried in the last section. */
const MASTER_WALKTHROUGH = {
  title: 'The Complete Walkthrough',
  subtitle: 'All 16 zones, one continuous take',
  duration: '6:40',
  poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
  videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
};

const TIMELINE_STEPS = [
  { label: 'Design', icon: Layers },
  { label: 'Construction', icon: HardHat },
  { label: 'Completion', icon: Building2 },
  { label: 'Walkthrough', icon: Video }
];

const ORIENTATIONS = ['wide', 'normal', 'tall', 'normal', 'wide', 'normal'];

/* =========================================================================
   DUMMY MEDIA
   Real, publicly-hosted placeholder assets so the gallery actually plays
   video and loads photos out of the box — nothing broken to look at while
   you swap in real site photography and drone/steadicam footage later.

   - Photos: Picsum's seeded placeholder service (deterministic per room,
     so the same "photo" reappears consistently across renders).
   - Video: Google's public sample-media bucket, the same clips used
     everywhere as web-standard dummy test video (Big Buck Bunny, Sintel,
     etc.), each with its own real poster frame.

   Swap `placeholderImage()` / `VIDEO_POOL` for your real asset paths
   (or point REAL_MEDIA_BY_ID at real files) whenever real media is ready —
   nothing else in the file needs to change.
========================================================================= */
function placeholderImage(seed, index = 0, w = 900, h = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}-${index}/${w}/${h}`;
}

const VIDEO_POOL = [
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg' }
];
function pickVideo(seedIndex) {
  return VIDEO_POOL[Math.abs(seedIndex) % VIDEO_POOL.length];
}

/* Your actual room photography, mapped onto the closest matching zone.
   Real estate images organized by category for luxury apartment showcase. */
const REAL_MEDIA_BY_ID = {
  'exterior': [
    { img: '/images/gallery/1.jpg', caption: 'Grand Facade View' },
    { img: '/images/gallery/2.jpg', caption: 'Modern Architecture' }
  ],
  'living-room': [
    { img: '/images/gallery/3.jpg', caption: 'Luxury Living Room' },
    { img: '/images/gallery/4.jpg', caption: 'Premium Lounge Space' }
  ],
  'dining-area': [
    { img: '/images/gallery/5.jpg', caption: 'Elegant Dining Zone' }
  ],
  'dry-kitchen': [
    { img: '/images/gallery/7.jpg', caption: 'Modular Dry Kitchen' },
    { img: '/images/gallery/03.jpg', caption: 'Premium Storage Solutions' }
  ],
  'master-bedroom': [
    { img: '/images/gallery/8.jpg', caption: 'Luxurious Master Bedroom' }
  ],
  'family-entertainment': [
    { img: '/images/gallery/9.jpg', caption: 'Entertainment Lounge' }
  ],
  'luxury-bathroom': [
    { img: '/images/gallery/2.jpg', caption: 'Spa-Grade Bathroom' }
  ],
  'bedroom-suites': [
    { img: '/images/gallery/3.jpg', caption: 'Guest Bedroom Suite' },
    { img: '/images/gallery/4.jpg', caption: 'Secondary Bedroom' }
  ],
  'landscape': [
    { img: '/images/gallery/1.jpg', caption: 'Landscaped Gardens' }
  ],
  'swimming-pool': [
    { img: '/images/gallery/5.jpg', caption: 'Resort-Style Pool' }
  ],
  'fitness-area': [
    { img: '/images/gallery/7.jpg', caption: 'State-of-Art Fitness Center' }
  ],
  'construction-progress': [
    { img: '/images/gallery/8.jpg', caption: 'Premium Construction Quality' },
    { img: '/images/gallery/9.jpg', caption: 'Structural Excellence' }
  ]
};

/* Minimum media items per zone. Real photography (above) is used first,
   then padded out with dummy photo + video slots — including at least
   one guaranteed walkthrough clip per zone — up to this count. */
const MIN_MEDIA_PER_SECTION = 6;

function buildSections() {
  return CATEGORY_META.map((meta, sIdx) => {
    const realMedia = REAL_MEDIA_BY_ID[meta.id] || [];
    const media = realMedia.map((asset, i) => ({
      id: `${meta.id}-real-${i}`,
      type: 'image',
      orientation: ORIENTATIONS[i % ORIENTATIONS.length],
      img: asset.img,
      caption: asset.caption
    }));

    const placeholderCount = Math.max(MIN_MEDIA_PER_SECTION - realMedia.length, 4);
    for (let i = 0; i < placeholderCount; i++) {
      const slot = realMedia.length + i;
      // Guarantee at least one flythrough clip and one timelapse clip per zone.
      const isVideo = i === 1 || i === 4;
      const clip = isVideo ? pickVideo(sIdx * 7 + i) : null;
      media.push({
        id: `${meta.id}-${slot}`,
        type: isVideo ? 'video' : 'image',
        orientation: ORIENTATIONS[slot % ORIENTATIONS.length],
        img: isVideo ? clip.poster : placeholderImage(meta.id, slot + 1),
        videoSrc: isVideo ? clip.src : undefined,
        caption: isVideo
          ? `${meta.title} — ${i === 1 ? 'walkthrough clip' : 'time-lapse'}`
          : `${meta.title} — detail ${slot + 1}`
      });
    }

    const heroClip = pickVideo(sIdx);
    const hero = realMedia.length
      ? { type: 'image', img: realMedia[0].img }
      : sIdx % 5 === 0
        ? { type: 'video', img: heroClip.poster, videoSrc: heroClip.src }
        : { type: 'image', img: placeholderImage(meta.id, 0, 1600, 1000) };

    return {
      ...meta,
      location: 'Aparna Sarovar Towers, Hyderabad',
      hero,
      description: DESCRIPTION_BY_ID[meta.id],
      highlights: HIGHLIGHTS_BY_ID[meta.id],
      stats: STATS_BY_ID[meta.id],
      materials: MATERIALS_BY_ID[meta.id],
      testimonial: TESTIMONIALS_BY_ID[meta.id],
      beforeAfter: BEFORE_AFTER_BY_ID[meta.id],
      media
    };
  });
}

const SECTIONS = buildSections();

/* =========================================================================
   HOOKS
========================================================================= */
function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const max = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
        setProgress(max > 0 ? Math.min(scrollTop / max, 1) : 0);
        setPastHero(scrollTop > 640);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { progress, pastHero };
}

/* =========================================================================
   BACKGROUND
========================================================================= */
const CinematicBackground = () => (
  <div aria-hidden="true" style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div className="blueprint-grid" />
    <div className="aurora aurora-blue" />
    <div className="aurora aurora-gold" />
    <div className="light-rays" />
    <div className="noise-layer" />
    {Array.from({ length: 16 }).map((_, i) => (
      <span
        key={i}
        className="particle"
        style={{
          left: `${(i * 121.5) % 100}%`,
          animationDuration: `${16 + (i % 6) * 3}s`,
          animationDelay: `${(i % 7) * -2.6}s`,
          background: i % 4 === 0 ? GOLD : 'rgba(56,189,248,0.85)'
        }}
      />
    ))}
  </div>
);

/* =========================================================================
   SCROLL PROGRESS BAR — thin gradient rail across the very top of the
   viewport, reflecting overall read/scroll progress through the tour.
========================================================================= */
const ScrollProgressBar = ({ progress }) => (
  <div className="scroll-progress-track" aria-hidden="true">
    <motion.div
      className="scroll-progress-fill"
      style={{ scaleX: progress }}
      transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
    />
  </div>
);

/* =========================================================================
   FLOATING LEFT NAVIGATION
========================================================================= */
const NavButton = memo(({ item, isActive, mediaCount, onClick, setRef }) => {
  const btnRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMove = (e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleEnter = () => setIsHovered(true);
  const handleLeave = () => { 
    if (btnRef.current) btnRef.current.style.transform = 'translate(0,0)'; 
    setIsHovered(false);
  };

  // Luxury theme colors
  const bgColor = (isActive || isHovered) ? '#000000' : 'transparent';
  const textColor = (isActive || isHovered) ? '#FFFFFF' : '#000000';
  const iconBg = isActive ? '#38BDF8' : (isHovered ? '#FFFFFF' : '#f1f5f9');
  const iconColor = isActive ? '#FFFFFF' : (isHovered ? '#000000' : '#64748b');
  const countColor = (isActive || isHovered) ? '#FFFFFF' : '#64748b';
  const countBg = (isActive || isHovered) ? 'rgba(255,255,255,0.2)' : '#f1f5f9';

  return (
    <button
      ref={(el) => { btnRef.current = el; setRef(item.id, el); }}
      onClick={() => onClick(item.id)}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="nav-item"
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
        background: bgColor,
        border: isActive ? '1px solid #000000' : '1px solid transparent', 
        borderRadius: '8px', padding: '0.65rem 0.85rem', cursor: 'pointer',
        color: textColor, 
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font-display)', textAlign: 'left',
        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px',
        borderRadius: '6px', flexShrink: 0, 
        background: iconBg,
        color: iconColor,
        transition: 'all 0.3s ease'
      }}>
        <item.icon size={14} color="currentColor" />
      </span>
      <span className="nav-label" style={{ fontSize: '0.82rem', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap', flex: 1 }}>
        {item.title}
      </span>
      {typeof mediaCount === 'number' && (
        <span className="nav-count" style={{
          fontSize: '0.65rem', fontWeight: 600, color: countColor,
          background: countBg, borderRadius: '4px', padding: '0.15rem 0.45rem', flexShrink: 0,
          transition: 'all 0.3s ease'
        }}>
          {mediaCount}
        </span>
      )}
    </button>
  );
});
NavButton.displayName = 'NavButton';

const FloatingNav = ({ activeId, onNavigate }) => {
  const btnRefs = useRef({});
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const listRef = useRef(null);

  const setRef = useCallback((id, el) => { btnRefs.current[id] = el; }, []);

  useLayoutEffect(() => {
    const el = btnRefs.current[activeId];
    const list = listRef.current;
    if (el && list) {
      const elRect = el.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      setIndicator({ top: elRect.top - listRect.top, height: elRect.height });
    }
  }, [activeId]);

  return (
    <nav className="floating-nav" style={{
      position: 'fixed', left: '2rem', top: '55%', transform: 'translateY(-50%)', zIndex: 40,
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px',
      padding: '1.5rem 1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05)',
      maxHeight: '85vh', display: 'flex', flexDirection: 'column', width: '260px'
    }}>
      <div style={{ padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' }}>
        <div 
          style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', cursor: 'default', transition: 'color 0.2s' }}
        >
          Gallery Index
        </div>
      </div>
      <div style={{ position: 'relative', overflowY: 'auto' }} ref={listRef} className="nav-scroll">
        <motion.div
          className="nav-indicator"
          animate={{ top: indicator.top, height: indicator.height }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'absolute', left: 0, width: '3px', borderRadius: '3px', background: `linear-gradient(${GOLD}, ${BLUE})` }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '8px' }}>
          {SECTIONS.map((item) => (
            <NavButton key={item.id} item={item} isActive={activeId === item.id} mediaCount={item.media.length} onClick={onNavigate} setRef={setRef} />
          ))}
        </div>
      </div>
    </nav>
  );
};

/* =========================================================================
   ANIMATED STAT
========================================================================= */
const AnimatedStat = ({ label, value }) => {
  const [display, setDisplay] = useState(null);
  const match = typeof value === 'string' ? value.match(/^([\d,]+)(.*)$/) : null;

  const handleEnter = () => {
    if (!match || display !== null) return;
    const target = parseInt(match[1].replace(/,/g, ''), 10);
    const suffix = match[2];
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(target * eased);
      setDisplay(current.toLocaleString() + suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      onViewportEnter={handleEnter}
      style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: '12px' }}
    >
      <div style={{ color: 'rgba(15, 23, 42, 0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ color: '#0f172a', fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-olivera)' }}>
        {display ?? (match ? '0' + match[2] : value)}
      </div>
    </motion.div>
  );
};

/* =========================================================================
   HERO BLOCK - cinematic, mouse-reactive, glass info card
========================================================================= */
const HeroBlock = ({ section, onScrollToMedia }) => {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const handleMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const media = el.querySelector('.hero-media');
    if (media) media.style.transform = `scale(1.08) translate(${(px - 0.5) * -18}px, ${(py - 0.5) * -18}px)`;
    const glow = el.querySelector('.hero-glow');
    if (glow) glow.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(56,189,248,0.22), transparent 60%)`;
  };
  const handleLeave = () => {
    const media = heroRef.current?.querySelector('.hero-media');
    if (media) media.style.transform = 'scale(1) translate(0,0)';
  };

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative', width: '100%', height: '86vh', minHeight: '520px', borderRadius: '28px',
        overflow: 'hidden', border: '1px solid rgba(56,189,248,0.2)', boxShadow: '0 30px 70px rgba(0,0,0,0.15)'
      }}
    >
      {section.hero.type === 'video' ? (
        <video
          ref={videoRef}
          className="hero-media"
          src={section.hero.videoSrc}
          poster={section.hero.img}
          muted autoPlay loop playsInline preload="none"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
        />
      ) : (
        <img
          className="hero-media"
          src={section.hero.img}
          alt={section.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
        />
      )}
      <div className="hero-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.25) 55%, rgba(5,5,8,0.15) 100%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }}
        style={{
          position: 'absolute', bottom: '2.5rem', left: '2.5rem', right: '2.5rem', maxWidth: '780px',
          background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(56,189,248,0.25)', backdropFilter: 'blur(14px)',
          borderRadius: '22px', padding: '1.75rem 2rem'
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: GOLD, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>
          <MapPin size={12} /> {section.location}
        </span>
        <h2 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-olivera)', fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', fontWeight: 600, color: '#0f172a', letterSpacing: '0.04em' }}>
          {section.title}
        </h2>
        <p style={{ margin: 0, color: 'rgba(15, 23, 42, 0.7)', fontSize: '0.95rem', maxWidth: '560px', lineHeight: 1.6 }}>
          {section.tagline}
        </p>
        <button
          onClick={onScrollToMedia}
          style={{
            marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'whitesmoke', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: '30px',
            padding: '0.55rem 1.2rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-olivera)'
          }}
        >
          Explore the space <ArrowDown size={13} />
        </button>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   BEFORE / AFTER SLIDER — drag to compare structure vs. finished space.
   Pointer-events based so it works with mouse, pen and touch alike.
========================================================================= */
const BeforeAfterSlider = ({ data }) => {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(98, Math.max(2, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    };
    const onUp = () => { draggingRef.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [updateFromClientX]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: EASE }}
      style={{ margin: '2.5rem 0' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: GOLD, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
        <SlidersHorizontal size={12} /> Drag to compare
      </div>
      <div
        ref={wrapRef}
        className="before-after-wrap"
        onMouseDown={(e) => { draggingRef.current = true; updateFromClientX(e.clientX); }}
        onTouchStart={(e) => { draggingRef.current = true; updateFromClientX(e.touches[0].clientX); }}
        style={{
          position: 'relative', width: '100%', aspectRatio: '16 / 8', borderRadius: '20px', overflow: 'hidden',
          border: '1px solid rgba(56,189,248,0.25)', cursor: 'ew-resize', userSelect: 'none',
          boxShadow: '0 20px 45px rgba(0,0,0,0.15)'
        }}
      >
        <img src={data.after} alt={data.afterLabel} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={data.before} alt={data.beforeLabel} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(56,189,248,0.3)', color: '#0f172a', fontSize: '0.68rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          {data.beforeLabel}
        </span>
        <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.85)', border: `1px solid ${GOLD}`, color: GOLD, fontSize: '0.68rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          {data.afterLabel}
        </span>

        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: '2px', background: GOLD, boxShadow: '0 0 12px rgba(212,175,55,0.7)', pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${pos}%`, transform: 'translate(-50%, -50%)',
          width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: `1px solid ${GOLD}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', pointerEvents: 'none'
        }}>
          <ChevronLeft size={12} color={GOLD} />
          <ChevronRight size={12} color={GOLD} />
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================================
   MEDIA FILTER TABS — All / Photos / Videos, scoped to a single section.
========================================================================= */
const MediaFilterTabs = ({ value, onChange, counts }) => {
  const tabs = [
    { key: 'all', label: 'All', icon: Sparkles, count: counts.all },
    { key: 'image', label: 'Photos', icon: ImageIcon, count: counts.image },
    { key: 'video', label: 'Videos', icon: Film, count: counts.video }
  ];
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter media by type">
      {tabs.map((tab) => {
        if (tab.key !== 'all' && tab.count === 0) return null;
        const active = value === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className="filter-tab"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', border: active ? `1px solid ${GOLD}` : '1px solid rgba(255,255,255,0.12)',
              background: active ? GOLD_SOFT : 'rgba(255,255,255,0.03)', color: active ? GOLD : 'rgba(255,255,255,0.6)',
              borderRadius: '20px', padding: '0.4rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            <tab.icon size={12} /> {tab.label} <span style={{ opacity: 0.7 }}>{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
};

/* =========================================================================
   3D MEDIA CARD
========================================================================= */
const SPAN_MAP = { wide: { col: 'span 2', row: 'span 1' }, tall: { col: 'span 1', row: 'span 2' }, normal: { col: 'span 1', row: 'span 1' } };

const MediaCard = memo(({ item, index, onOpen }) => {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const isVideo = item.type === 'video';
  const span = SPAN_MAP[item.orientation] || SPAN_MAP.normal;
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    card.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 12}deg) rotateY(${(px - 0.5) * 12}deg) translateZ(8px) scale(1.025)`;
    const glow = card.querySelector('.card-cursor-light');
    if (glow) glow.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(56,189,248,0.25), transparent 55%)`;
    const shine = card.querySelector('.card-shine');
    if (shine) shine.style.transform = `translate(${(px - 0.5) * 50}px, ${(py - 0.5) * 50}px) rotate(35deg)`;
    const media = card.querySelector('.card-media');
    if (media) media.style.transform = `scale(1.08) translate(${(px - 0.5) * -8}px, ${(py - 0.5) * -8}px)`;
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    card.style.borderColor = 'rgba(255,255,255,0.07)';
    card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.45)';
    const media = card.querySelector('.card-media');
    if (media) media.style.transform = 'scale(1) translate(0,0)';
    if (isVideo && videoRef.current) videoRef.current.pause();
  };
  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.borderColor = GOLD;
    card.style.boxShadow = `0 0 0 1px ${GOLD_SOFT}, 0 20px 45px rgba(0,0,0,0.55)`;
    if (isVideo && videoRef.current) videoRef.current.play().catch(() => {});
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 36, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: EASE, delay: (index % 5) * 0.05 }}
      style={{ gridColumn: span.col, gridRow: span.row }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onOpen()}
        style={{
          position: 'relative', width: '100%', height: '100%', minHeight: span.row === 'span 2' ? '420px' : '220px',
          borderRadius: '20px', overflow: 'hidden', cursor: 'zoom-in', border: '1px solid rgba(0,0,0,0.15)',
          background: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease',
          transformStyle: 'preserve-3d', willChange: 'transform'
        }}
      >
        {!loaded && <div className="media-skeleton" />}
        {isVideo ? (
          <video ref={videoRef} className="card-media" src={item.videoSrc} poster={item.img} muted loop playsInline preload="none"
            onLoadedData={() => setLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)', opacity: loaded ? 1 : 0 }} />
        ) : (
          <img className="card-media" src={item.img} alt={item.caption} loading="lazy"
            onLoad={() => setLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)', opacity: loaded ? 1 : 0 }} />
        )}
        <div className="card-cursor-light" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen' }} />
        <div className="card-shine" style={{ position: 'absolute', top: '-50%', left: '-50%', width: '60%', height: '200%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)', transition: 'transform 0.3s ease-out', pointerEvents: 'none' }} />
        {isVideo && (
          <div style={{ position: 'absolute', top: '0.8rem', left: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.85)', border: `1px solid ${GOLD}`, borderRadius: '20px', padding: '0.25rem 0.65rem', fontSize: '0.6rem', fontWeight: 700, color: GOLD, textTransform: 'uppercase' }}>
            <Play size={10} fill={GOLD} /> Motion
          </div>
        )}
        <button
          className="fav-heart"
          onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
          aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
          style={{
            position: 'absolute', top: '0.8rem', right: '0.8rem', width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(7,7,9,0.55)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', zIndex: 2
          }}
        >
          <Heart size={13} color={saved ? GOLD : 'white'} fill={saved ? GOLD : 'none'} />
        </button>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.9rem', background: 'linear-gradient(to top, rgba(5,5,8,0.85), transparent)' }}>
          <span style={{ color: 'black', fontSize: '0.75rem', fontWeight: 600 }}>{item.caption}</span>
        </div>
      </div>
    </motion.div>
  );
});
MediaCard.displayName = 'MediaCard';

/* =========================================================================
   STORY TIMELINE STRIP
========================================================================= */
const TimelineStrip = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2.5rem 0', overflowX: 'auto' }}>
    {TIMELINE_STEPS.map((step, i) => (
      <React.Fragment key={step.label}>
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
        >
          <span style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${GOLD}`, background: GOLD_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <step.icon size={14} color={GOLD} />
          </span>
          <span style={{ fontSize: '0.78rem', color: 'black', fontWeight: 600, whiteSpace: 'nowrap' }}>{step.label}</span>
        </motion.div>
        {i < TIMELINE_STEPS.length - 1 && <span style={{ flex: 1, minWidth: '20px', height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.5), rgba(56,189,248,0.2))' }} />}
      </React.Fragment>
    ))}
  </div>
);

/* =========================================================================
   SECTION BLOCK
========================================================================= */
const SectionBlock = forwardRef(({ section, onOpenViewer }, ref) => {
  const mediaRef = useRef(null);
  const scrollToMedia = () => mediaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const [filter, setFilter] = useState('all');

  const counts = useMemo(() => ({
    all: section.media.length,
    image: section.media.filter((m) => m.type === 'image').length,
    video: section.media.filter((m) => m.type === 'video').length
  }), [section.media]);

  const visibleMedia = useMemo(
    () => (filter === 'all' ? section.media : section.media.filter((m) => m.type === filter)),
    [section.media, filter]
  );

  return (
    <section id={section.id} ref={ref} style={{ position: 'relative', zIndex: 1, padding: '3.5rem 0', scrollMarginTop: '2rem' }}>
      <HeroBlock section={section} onScrollToMedia={scrollToMedia} />

      {section.description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          style={{ color: 'black', fontSize: '1rem', lineHeight: 1.75, maxWidth: '760px', margin: '2rem 0 0 0' }}
        >
          {section.description}
        </motion.p>
      )}

      {section.highlights && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '1.25rem 0 0 0' }}>
          {section.highlights.map((h) => (
            <span key={h} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'black',
              background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '0.4rem 0.9rem'
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: BLUE, flexShrink: 0 }} />
              {h}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', margin: '2.5rem 0' }}>
        {section.stats.map((s) => <AnimatedStat key={s.label} label={s.label} value={s.value} />)}
      </div>

      <TimelineStrip />

      {section.beforeAfter && <BeforeAfterSlider data={section.beforeAfter} />}

      <div ref={mediaRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', scrollMarginTop: '2rem', marginBottom: '1.25rem' }}>
        <MediaFilterTabs value={filter} onChange={setFilter} counts={counts} />
      </div>

      <motion.div layout className="media-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gridAutoRows: '220px', gap: '1.25rem'
      }}>
        <AnimatePresence>
          {visibleMedia.map((item) => (
            <MediaCard key={item.id} item={item} index={section.media.indexOf(item)} onOpen={() => onOpenViewer(section.id, section.media.indexOf(item))} />
          ))}
        </AnimatePresence>
      </motion.div>

      {section.materials && section.materials[0] !== '-' && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: GOLD, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>
            <Layers size={12} /> Materials
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {section.materials.map((m) => (
              <span key={m} style={{ fontSize: '0.78rem', color: 'black', background: 'rgba(15, 23, 42, 0.05)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '20px', padding: '0.35rem 0.85rem' }}>{m}</span>
            ))}
          </div>
        </div>
      )}

      {section.testimonial && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}
          style={{ marginTop: '2.5rem', padding: '1.75rem 2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(56,189,248,0.2)', maxWidth: '640px' }}
        >
          <Quote size={20} color={GOLD} style={{ marginBottom: '0.75rem' }} />
          <p style={{ color: 'black', fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 0.75rem 0' }}>
            &ldquo;{section.testimonial.quote}&rdquo;
          </p>
          <span style={{ color: 'rgba(15, 23, 42, 0.5)', fontSize: '0.8rem', fontWeight: 600 }}>{section.testimonial.author}</span>
        </motion.div>
      )}
    </section>
  );
});
SectionBlock.displayName = 'SectionBlock';

/* =========================================================================
   FULLSCREEN VIEWER
========================================================================= */
const ProjectViewer = ({ section, index, onClose, onPrev, onNext }) => {
  const item = section.media[index];
  const touchStartX = useRef(null);
  const lastTapRef = useRef(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');

  useEffect(() => { setIsZoomed(false); }, [index]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  const handleMediaClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
    setIsZoomed((z) => !z);
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) { setIsZoomed((z) => !z); }
    lastTapRef.current = now;
    if (touchStartX.current === null || isZoomed) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 60) onPrev();
    else if (delta < -60) onNext();
    touchStartX.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      onClick={onClose} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
      style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'whitesmoke', backdropFilter: 'blur(18px)', display: 'flex', overflowY: 'auto' }}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '4%', zIndex: 420, background: 'white', border: '1px solid rgba(56,189,248,0.3)', color: '#000000', cursor: 'pointer', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={18} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} style={navArrowStyle('left')}><ChevronLeft size={22} /></button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} style={navArrowStyle('right')}><ChevronRight size={22} /></button>

      <div onClick={(e) => e.stopPropagation()} style={{ margin: 'auto', width: '92%', maxWidth: '1180px', padding: '5rem 0 3rem', display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(220px,1fr)', gap: '2.5rem' }} className="viewer-grid">
        <div>
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${GOLD_SOFT}`, boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <AnimatePresence mode="wait">
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                {item.type === 'video' ? (
                  <video src={item.videoSrc} poster={item.img} controls autoPlay muted loop playsInline style={{ width: '100%', maxHeight: '68vh', display: 'block', background: '#000' }} />
                ) : (
                  <div onClick={handleMediaClick} style={{ overflow: 'hidden', cursor: isZoomed ? 'zoom-out' : 'zoom-in', background: '#000' }}>
                    <img
                      src={item.img} alt={item.caption}
                      style={{
                        width: '100%', maxHeight: '68vh', objectFit: 'contain', display: 'block',
                        transform: isZoomed ? 'scale(2.1)' : 'scale(1)', transformOrigin: zoomOrigin,
                        transition: 'transform 0.35s ease'
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {item.type !== 'video' && (
              <div style={{ position: 'absolute', bottom: '0.8rem', right: '0.8rem', background: 'rgba(7,7,9,0.6)', borderRadius: '20px', padding: '0.35rem 0.7rem', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: 'rgba(15, 23, 42, 0.7)' }}>
                <ZoomIn size={11} /> Click to zoom
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {section.media.map((thumb, i) => (
              <button key={thumb.id} onClick={(e) => { e.stopPropagation(); i > index ? onNext() : i < index ? onPrev() : null; }}
                style={{ flexShrink: 0, width: '76px', height: '52px', borderRadius: '10px', overflow: 'hidden', border: i === index ? `2px solid ${GOLD}` : '1px solid rgba(255,255,255,0.12)', padding: 0, cursor: 'pointer', opacity: i === index ? 1 : 0.55, position: 'relative' }}>
                <img src={thumb.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {thumb.type === 'video' && (
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
                    <Play size={11} color="white" fill="white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{section.title}</span>
          <h2 style={{ margin: '6px 0 1rem', fontFamily: 'var(--font-olivera)', fontSize: '1.6rem', fontWeight: 600, color: '#0f172a' }}>{item.caption}</h2>
          <p style={{ color: 'black', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{section.description || section.tagline}</p>

          <div style={{ marginBottom: '1.2rem' }}>
            <div style={chipGroupLabel}>Construction Specifications</div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {section.stats.map((s) => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'rgba(15, 23, 42, 0.5)' }}>{s.label}</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {section.materials && section.materials[0] !== '-' && (
            <div>
              <div style={chipGroupLabel}>Materials</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {section.materials.map((m) => <span key={m} style={tagChip}>{m}</span>)}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', color: 'rgba(15, 23, 42, 0.35)', fontSize: '0.75rem' }}>{index + 1} / {section.media.length}</div>
        </div>
      </div>
    </motion.div>
  );
};

const navArrowStyle = (side) => ({
  position: 'absolute', [side]: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 420,
  background: 'white', border: '1px solid rgba(56,189,248,0.25)', color: '#0f172a',
  cursor: 'pointer', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center'
});
const chipGroupLabel = { color: GOLD, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' };
const tagChip = { fontSize: '0.75rem', color: 'black', background: 'transparent', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '20px', padding: '0.3rem 0.75rem' };

/* =========================================================================
   MASTER WALKTHROUGH — persistent floating action button + fullscreen
   modal for the single, whole-project showreel video.
========================================================================= */
const WalkthroughFAB = ({ onOpen, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.button
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={onOpen}
        className="walkthrough-fab"
      >
        <span className="walkthrough-fab-icon"><Play size={14} fill="#050608" /></span>
        <span className="walkthrough-fab-text">
          <strong>Watch Full Walkthrough</strong>
          <em>{MASTER_WALKTHROUGH.duration} · all 16 zones</em>
        </span>
      </motion.button>
    )}
  </AnimatePresence>
);

const WalkthroughModal = ({ onClose }) => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(2,2,4,0.96)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5vh 4%' }}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '4%', zIndex: 520, background: 'white', border: '1px solid rgba(56,189,248,0.3)', color: '#000000', cursor: 'pointer', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={18} />
      </button>
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '1100px' }}
      >
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <span style={{ color: GOLD, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{MASTER_WALKTHROUGH.subtitle}</span>
          <h2 style={{ margin: '0.4rem 0 0', color: '#0f172a', fontFamily: 'var(--font-olivera)', fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', fontWeight: 600 }}>{MASTER_WALKTHROUGH.title}</h2>
        </div>
        <div style={{ position: 'relative', borderRadius: '22px', overflow: 'hidden', border: `1px solid ${GOLD_SOFT}`, boxShadow: '0 30px 80px rgba(0,0,0,0.85)' }}>
          <video
            ref={videoRef}
            src={MASTER_WALKTHROUGH.videoSrc}
            poster={MASTER_WALKTHROUGH.poster}
            autoPlay muted={muted} loop playsInline controls
            style={{ width: '100%', maxHeight: '72vh', display: 'block', background: '#000' }}
          />
          <button
            onClick={() => setMuted((m) => !m)}
            style={{
              position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(7,7,9,0.7)', border: '1px solid rgba(56,189,248,0.3)',
              color: '#0f172a', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* =========================================================================
   SCROLL TO TOP
========================================================================= */
const ScrollTopButton = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.25 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className="scroll-top-btn"
      >
        <ArrowUp size={16} />
      </motion.button>
    )}
  </AnimatePresence>
);

/* =========================================================================
   MAIN GALLERY - the walk-through experience
========================================================================= */
const Gallery = () => {
  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), []);
  const activeId = useScrollSpy(sectionIds);
  const { progress, pastHero } = useScrollProgress();
  const [viewer, setViewer] = useState(null); // { sectionId, index }
  const [showreelOpen, setShowreelOpen] = useState(false);
  const sectionRefs = useRef({});

  const handleNavigate = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openViewer = useCallback((sectionId, index) => setViewer({ sectionId, index }), []);
  const closeViewer = useCallback(() => setViewer(null), []);

  const activeSection = viewer ? SECTIONS.find((s) => s.id === viewer.sectionId) : null;

  const stepViewer = useCallback((dir) => {
    setViewer((prev) => {
      if (!prev) return prev;
      const section = SECTIONS.find((s) => s.id === prev.sectionId);
      const len = section.media.length;
      const nextIndex = (prev.index + dir + len) % len;
      return { ...prev, index: nextIndex };
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      style={{ position: 'relative', paddingTop: '90px', minHeight: '100vh', background: 'whitesmoke', color: '#0f172a', paddingBottom: '4rem', overflowX: 'hidden' }}
    >
      <style>{GALLERY_STYLES}</style>
      {/* CinematicBackground removed */}
      <ScrollProgressBar progress={progress} />
      <FloatingNav activeId={activeId} onNavigate={handleNavigate} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 4% 2rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: GOLD, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          <span style={{ width: '24px', height: '1px', background: GOLD }} /> Walk Through The Building <span style={{ width: '24px', height: '1px', background: GOLD }} />
        </span>
        <h1 style={{ fontFamily: 'var(--font-olivera)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, margin: '0 0 0.5rem 0', letterSpacing: '0.04em' }}>
          The Project Experience
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto' }}>
          From the facade to the final walkthrough, explore Aparna Sarovar Towers room by room, the way you'd tour it in person.
        </p>
      </div>

      <div className="sections-wrap" style={{ position: 'relative', zIndex: 1, paddingLeft: '6%', paddingRight: '4%' }}>
        {SECTIONS.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            ref={(el) => { sectionRefs.current[section.id] = el; }}
            onOpenViewer={openViewer}
          />
        ))}
      </div>

      <WalkthroughFAB visible={pastHero && !viewer} onOpen={() => setShowreelOpen(true)} />
      <ScrollTopButton visible={pastHero} />

      <AnimatePresence>
        {viewer && activeSection && (
          <ProjectViewer section={activeSection} index={viewer.index} onClose={closeViewer} onPrev={() => stepViewer(-1)} onNext={() => stepViewer(1)} />
        )}
        {showreelOpen && <WalkthroughModal onClose={() => setShowreelOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

/* =========================================================================
   KEYFRAMES + RESPONSIVE
========================================================================= */
const GALLERY_STYLES = `
  .blueprint-grid { position: absolute; inset: -1px; background-image: linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px); background-size: 48px 48px; mask-image: radial-gradient(ellipse 80% 60% at 50% 10%, black 30%, transparent 85%); animation: gridPulse 8s ease-in-out infinite; }
  @keyframes gridPulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
  .aurora { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3; }
  .aurora-blue { width: 560px; height: 560px; top: -200px; left: -140px; background: radial-gradient(circle, rgba(56,189,248,0.55), transparent 70%); animation: drift1 24s ease-in-out infinite; }
  .aurora-gold { width: 460px; height: 460px; bottom: -180px; right: -120px; background: radial-gradient(circle, rgba(212,175,55,0.4), transparent 70%); animation: drift2 28s ease-in-out infinite; }
  @keyframes drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(70px,50px) scale(1.15); } }
  @keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-60px,-40px) scale(1.1); } }
  .light-rays { position: absolute; top: -10%; left: 30%; width: 40%; height: 120%; background: conic-gradient(from 200deg at 50% 0%, transparent 0deg, rgba(56,189,248,0.06) 8deg, transparent 16deg, transparent 40deg, rgba(212,175,55,0.05) 48deg, transparent 56deg); opacity: 0.7; }
  .noise-layer { position: absolute; inset: 0; opacity: 0.03; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  .particle { position: absolute; top: 100%; width: 2px; height: 2px; border-radius: 50%; animation-name: floatUp; animation-timing-function: linear; animation-iteration-count: infinite; opacity: 0.7; }
  @keyframes floatUp { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.4; } 100% { transform: translateY(-110vh); opacity: 0; } }

  .scroll-progress-track { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 300; background: rgba(255,255,255,0.05); }
  .scroll-progress-fill { height: 100%; width: 100%; transform-origin: 0 50%; background: linear-gradient(90deg, ${GOLD}, ${BLUE}); box-shadow: 0 0 10px rgba(56,189,248,0.6); }

  .nav-scroll::-webkit-scrollbar { width: 4px; }
  .nav-scroll::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 4px; }
  .nav-item:hover { color: white !important; }

  .media-skeleton { position: absolute; inset: 0; background: linear-gradient(100deg, #101014 30%, #17171d 50%, #101014 70%); background-size: 200% 100%; animation: shimmer 1.6s ease-in-out infinite; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .fav-heart { transition: transform 0.2s ease, background 0.2s ease; }
  .fav-heart:hover { transform: scale(1.12); background: rgba(7,7,9,0.8) !important; }

  .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-tab:hover { border-color: ${GOLD} !important; color: ${GOLD} !important; }

  .before-after-wrap:active { cursor: grabbing; }

  .walkthrough-fab {
    position: fixed; right: 1.75rem; bottom: 1.75rem; z-index: 60;
    display: flex; align-items: center; gap: 12px; padding: 0.65rem 1.1rem 0.65rem 0.65rem;
    background: linear-gradient(135deg, ${GOLD}, #f0d97a); border: none; border-radius: 50px;
    box-shadow: 0 15px 40px rgba(212,175,55,0.35), 0 0 0 1px rgba(255,255,255,0.15) inset;
    cursor: pointer; font-family: var(--font-olivera); text-align: left;
  }
  .walkthrough-fab-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(5,5,8,0.9); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .walkthrough-fab-text { display: flex; flex-direction: column; line-height: 1.25; }
  .walkthrough-fab-text strong { color: #101014; font-size: 0.82rem; font-weight: 800; }
  .walkthrough-fab-text em { color: rgba(16,16,20,0.65); font-size: 0.66rem; font-style: normal; }

  .scroll-top-btn {
    position: fixed; left: 1.75rem; bottom: 1.75rem; z-index: 60; width: 44px; height: 44px; border-radius: 50%;
    background: rgba(7,7,10,0.7); border: 1px solid rgba(255,255,255,0.15); color: white; display: flex;
    align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(10px);
  }
  .scroll-top-btn:hover { border-color: ${GOLD}; color: ${GOLD}; }

  .sections-wrap { margin-left: 92px; }
  /* reduce left nav width and ensure content doesn't get overlapped */
  .floating-nav { width: 200px; }
  .nav-label { overflow: hidden; text-overflow: ellipsis; }
  .sections-wrap { margin-left: 220px; }

  /* Fixed-width floating nav to avoid shifting and overlap; reduce width slightly */
  .floating-nav { width: 180px; }
  .nav-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Ensure main content has enough left margin matching nav width + left offset */
  .sections-wrap { margin-left: 212px; }

  @media (max-width: 900px) {
    .floating-nav { left: 0.5rem; padding: 0.6rem 0.35rem; border-radius: 16px; }
    .nav-label, .nav-count { display: none; }
    .sections-wrap { margin-left: 56px; padding-left: 4% !important; }
    .viewer-grid { grid-template-columns: 1fr !important; }
    .walkthrough-fab-text { display: none; }
    .walkthrough-fab { padding: 0.65rem; right: 1rem; bottom: 1rem; }
    .scroll-top-btn { left: 1rem; bottom: 1rem; width: 40px; height: 40px; }
  }

  /* Small screens: remove left offset and stack content to avoid overlap
     with the floating left nav. Also tighten media grid for narrow viewports. */
  @media (max-width: 700px) {
    .floating-nav { display: none !important; }
    .sections-wrap { margin-left: 0 !important; padding-left: 4% !important; }
    .media-grid { grid-template-columns: repeat(auto-fill, minmax(140px,1fr)) !important; grid-auto-rows: 160px !important; gap: 10px !important; }
    .media-grid > * { position: relative; z-index: 1; }
    .hero-glow { display: none; }
  }

  /* Extra-small screens: ensure hero, viewer and media grid stack cleanly, reduce paddings and font sizes */
  @media (max-width: 480px) {
    .sections-wrap { padding-left: 4% !important; padding-right: 4% !important; }
    .hero-media { object-position: center top !important; }
    .hero-glow { display: none !important; }
    .sections-wrap > section { padding: 2rem 0 !important; }
    .media-grid { grid-template-columns: repeat(auto-fill, minmax(120px,1fr)) !important; grid-auto-rows: 140px !important; gap: 8px !important; }
    .viewer-grid { grid-template-columns: 1fr !important; padding: 1rem !important; gap: 1rem !important; }
    .viewer-grid > div { width: 100% !important; }
    .viewer-grid img, .viewer-grid video { max-height: none !important; height: auto !important; }
    .walkthrough-fab { right: 0.75rem !important; bottom: 0.75rem !important; }
    .scroll-top-btn { left: 0.75rem !important; bottom: 0.75rem !important; }
    .floating-nav { display: none !important; }
    .filter-tabs { justify-content: flex-start; gap: 6px; }
    /* Reduce hero popup card padding and font sizes */
    .hero-block, .hero-block * { font-size: 0.95rem !important; }
    /* Ensure any absolute side cards become positioned static to avoid overlap */
    .viewer-grid > div:nth-child(2) { position: static !important; }
    .media-grid > * { overflow: hidden; border-radius: 12px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .blueprint-grid, .aurora-blue, .aurora-gold, .particle { animation: none !important; }
  }
`;

export default Gallery;



