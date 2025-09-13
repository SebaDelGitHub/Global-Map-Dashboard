import './valueBar.css';

function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ');
}

interface ValueBarProps {
  max: number
  colors?: string[]
  className?: string
}

export function ValueBar({
  max,
  colors,
  className,
}: ValueBarProps) {
  const defaultColors = ['#E0F7FA', '#81D4FA', '#2196F3', '#1565C0', '#0D47A1'];
  const segments = 5;
  const useColors = colors && colors.length === segments ? colors : defaultColors;

  // Create labels: 0, max/5, 2*max/5, ..., max
  const labels = Array.from({ length: segments + 1 }, (_, i) => {
    const v = Math.round((i * max) / segments);
    return v;
  });

  return (
    <div className={cn('valuebar-container', className)}>
      <div className="valuebar-track" style={{ height: '32px' }}>
        {useColors.map((color, index) => (
          <div
            key={index}
            className={cn('valuebar-segment')}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="valuebar-ticks">
        <div className="tick-labels">
          {labels.map((label, index) => (
            <span key={index} className="valuebar-small">{label}</span>
          ))}
        </div>

        {labels.map((_, i) => {
          const pct = (i / segments) * 100;
          return (
            <div
              key={i}
              className="tick-mark"
              style={{ left: `${pct}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
