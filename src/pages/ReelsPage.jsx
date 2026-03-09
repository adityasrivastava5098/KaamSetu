import { useRef, useState, useEffect, useCallback } from "react";
import { Heart, MessageCircle, Share2, Bookmark, ChevronLeft, Play, Loader2, Volume2, VolumeX } from "lucide-react";

const API_KEY = "AIzaSyDX4st0rcp5_JqTrldpZFrb-axKqPF1iAo";

const SKILLS = [
  { id: "plumbing",   label: "Plumbing",   emoji: "🔧", query: "plumbing repair shorts",          color: "#3b82f6" },
  { id: "electrical", label: "Electrical", emoji: "⚡", query: "electrical wiring tutorial short", color: "#f59e0b" },
  { id: "masonry",    label: "Masonry",    emoji: "🧱", query: "masonry bricklaying short",        color: "#ef4444" },
  { id: "farming",    label: "Farming",    emoji: "🌾", query: "farming techniques short",         color: "#22c55e" },
  { id: "carpentry",  label: "Carpentry",  emoji: "🪵", query: "carpentry woodwork short",         color: "#a78bfa" },
  { id: "welding",    label: "Welding",    emoji: "🔥", query: "welding basics short",             color: "#f97316" },
];

// ── Single Reel Card ──────────────────────────────────────────────────────────
const ReelCard = ({ video, skill, isActive }) => {
  const [playing, setPlaying]   = useState(false);
  const [muted, setMuted]       = useState(true);
  const [liked, setLiked]       = useState(false);
  const [saved, setSaved]       = useState(false);
  const [shared, setShared]     = useState(false);
  const iframeRef               = useRef(null);
  const likes                   = useRef(Math.floor(Math.random() * 9000 + 500)).current;

  const videoId = video.id.videoId;
  const thumb   = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  // When card leaves viewport, reset to thumbnail
  useEffect(() => {
    if (!isActive) {
      setPlaying(false);
      setMuted(true);
    }
  }, [isActive]);

  const handleShare = () => {
    navigator.clipboard?.writeText(`https://youtube.com/shorts/${videoId}`);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const ReelAction = ({ icon: Icon, label, active = false, onClick, color = "#ef4444" }) => {
    const [popped, setPopped] = useState(false);
    return (
      <div
        onClick={() => { setPopped(true); setTimeout(() => setPopped(false), 300); onClick?.(); }}
        className="flex flex-col items-center gap-1.5 cursor-pointer select-none"
        style={{ transform: popped ? "scale(0.72)" : "scale(1)", transition: "transform 0.2s cubic-bezier(.36,.07,.19,.97)" }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: active ? `${color}33` : "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${active ? color + "66" : "rgba(255,255,255,0.12)"}`,
            transition: "all 0.2s",
          }}>
          <Icon size={22} style={{ color: active ? color : "#fff", fill: active ? color : "none", strokeWidth: active ? 0 : 2 }} />
        </div>
        <span className="text-xs font-black text-white drop-shadow">{label}</span>
      </div>
    );
  };

  return (
    <div className="h-full w-full snap-start relative flex flex-col justify-end overflow-hidden" style={{ background: "#000" }}>

      {/* ── Thumbnail (shown before play) ── */}
      {!playing && (
        <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
      )}

      {/* ── YouTube iframe (shown after tap) ── */}
      {playing && (
        <iframe
          ref={iframeRef}
          className="absolute inset-0 w-full h-full"
          style={{ border: "none", zIndex: 5 }}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&playsinline=1&rel=0&modestbranding=1&controls=1&loop=1&playlist=${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* ── Gradient overlay ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: playing
            ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 35%)"
            : "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          zIndex: 6,
        }} />

      {/* ── Tap-to-play (only shown when not playing) ── */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" style={{ zIndex: 7 }}
          onClick={() => setPlaying(true)}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255,255,255,0.35)",
              boxShadow: `0 0 50px ${skill.color}66`,
            }}>
            <Play size={34} fill="#fff" color="#fff" style={{ marginLeft: 4 }} />
          </div>
        </div>
      )}

      {/* ── Mute toggle (shown while playing) ── */}
      {playing && (
        <button
          onClick={() => setMuted(p => !p)}
          className="absolute top-24 right-4 w-11 h-11 rounded-2xl flex items-center justify-center text-white"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", zIndex: 10 }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* ── Bottom content ── */}
      <div className="relative flex items-end justify-between gap-4 px-5 pb-8 pt-24" style={{ zIndex: 8 }}>
        {/* Meta */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest text-white"
            style={{ background: `${skill.color}33`, backdropFilter: "blur(8px)", border: `1px solid ${skill.color}55` }}>
            <span>{skill.emoji}</span>
            <span style={{ color: skill.color }}>{skill.label}</span>
          </div>

          <div className="flex items-center gap-2">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.snippet.channelTitle}`} alt=""
              className="w-9 h-9 rounded-full bg-white/10 p-0.5"
              style={{ border: `2px solid ${skill.color}` }} />
            <span className="text-sm font-black text-white drop-shadow truncate max-w-[130px]">{video.snippet.channelTitle}</span>
            <button className="px-4 py-1 rounded-xl text-xs font-black text-white active:scale-95 transition-all"
              style={{ background: skill.color, boxShadow: `0 4px 14px ${skill.color}55` }}>Follow</button>
          </div>

          <p className="text-white font-bold text-sm leading-snug drop-shadow line-clamp-2">{video.snippet.title}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-5 pb-1 flex-shrink-0">
          <ReelAction icon={Heart}         label={liked ? likes + 1 : likes}    active={liked}  color="#ef4444" onClick={() => setLiked(p => !p)} />
          <ReelAction icon={MessageCircle} label="45"                           active={false}  color="#3b82f6" />
          <ReelAction icon={Bookmark}      label="Save"                         active={saved}  color="#a78bfa" onClick={() => setSaved(p => !p)} />
          <ReelAction icon={Share2}        label={shared ? "Copied!" : "Share"} active={shared} color="#22c55e" onClick={handleShare} />
        </div>
      </div>
    </div>
  );
};

// ── Skill Pill ────────────────────────────────────────────────────────────────
const SkillPill = ({ skill, active, onClick }) => (
  <button onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black whitespace-nowrap active:scale-95 transition-all"
    style={{
      background: active ? skill.color : "rgba(255,255,255,0.08)",
      color: active ? "#fff" : "rgba(255,255,255,0.5)",
      border: `1px solid ${active ? skill.color : "rgba(255,255,255,0.1)"}`,
      backdropFilter: "blur(10px)",
    }}>
    {skill.emoji} {skill.label}
  </button>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RuralSkillReels() {
  const [activeSkill, setActiveSkill] = useState(SKILLS[0]);
  const [videos, setVideos]           = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [activeReel, setActiveReel]   = useState(0);
  const scrollRef = useRef(null);

  const fetchVideos = useCallback(async (skill) => {
    setLoading(true);
    setError(null);
    setVideos([]);
    setActiveReel(0);
    scrollRef.current?.scrollTo({ top: 0 });
    try {
      const res  = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(skill.query)}&type=video&videoDuration=short&maxResults=10&key=${API_KEY}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setVideos(data.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVideos(activeSkill); }, []);

  const handleScroll = (e) => {
    const idx = Math.round(e.target.scrollTop / e.target.clientHeight);
    setActiveReel(idx);
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative flex flex-col">

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-5 pt-5 flex items-center justify-between pointer-events-none">
        <button className="w-11 h-11 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-all pointer-events-auto"
          style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <ChevronLeft size={22} />
        </button>

        <span className="text-lg font-black text-white tracking-wide">
          Skill<span style={{ color: activeSkill.color }}>Reels</span>
        </span>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: activeSkill.color }} />
          <span className="text-xs font-black text-white">{activeReel + 1} / {Math.max(videos.length, 1)}</span>
        </div>
      </header>

      {/* Skill pills */}
      <div className="absolute left-0 right-0 z-50 flex gap-2.5 px-5 overflow-x-auto"
        style={{ top: 72, scrollbarWidth: "none", paddingBottom: 4 }}>
        {SKILLS.map(s => (
          <SkillPill key={s.id} skill={s} active={activeSkill.id === s.id}
            onClick={() => { setActiveSkill(s); fetchVideos(s); }} />
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 size={48} className="animate-spin" style={{ color: activeSkill.color }} />
          <p className="text-white/50 font-black tracking-widest uppercase text-sm">Loading {activeSkill.label}…</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <span className="text-5xl">⚠️</span>
          <p className="text-white font-black text-lg">Couldn't load videos</p>
          <p className="text-white/40 text-sm">{error}</p>
          <button onClick={() => fetchVideos(activeSkill)}
            className="mt-2 px-6 py-2.5 rounded-2xl font-black text-white text-sm active:scale-95 transition-all"
            style={{ background: activeSkill.color }}>Retry</button>
        </div>
      ) : (
        <div ref={scrollRef} onScroll={handleScroll}
          className="flex-1 overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollbarWidth: "none" }}>
          {videos.map((video, idx) => (
            <div key={video.id.videoId} style={{ height: "100dvh" }}>
              <ReelCard video={video} skill={activeSkill} isActive={idx === activeReel} />
            </div>
          ))}
        </div>
      )}

      {/* Progress dots */}
      {videos.length > 0 && !loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5">
          {videos.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300" style={{
              width: 4,
              height: i === activeReel ? 20 : 6,
              background: i === activeReel ? activeSkill.color : "rgba(255,255,255,0.25)",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}