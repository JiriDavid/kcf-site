export default function BackgroundGradient() {
  return (
    <div className="aurora -z-10" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,173,141,0.2),transparent_32%),radial-gradient(circle_at_75%_10%,rgba(17,100,180,0.24),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(141,216,204,0.12),transparent_35%)]" />
      <div className="aurora__layer animate-slow-spin left-[-20%] top-[-20%] h-[60vmax] w-[60vmax] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(13,173,141,0.38),rgba(17,100,180,0.32),transparent)]" />
      <div className="aurora__layer animate-float-slow right-[-10%] top-[10%] h-[55vmax] w-[55vmax] bg-[conic-gradient(from_45deg_at_50%_50%,rgba(48,191,191,0.32),rgba(17,100,180,0.2),transparent)]" />
      <div className="aurora__layer animate-slow-spin bottom-[-25%] left-[5%] h-[65vmax] w-[65vmax] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(141,216,204,0.16),rgba(12,152,186,0.16),transparent)]" />
    </div>
  );
}
