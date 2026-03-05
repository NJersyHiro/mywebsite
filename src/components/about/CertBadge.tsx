interface CertBadgeProps {
  readonly name: string;
}

export default function CertBadge({ name }: CertBadgeProps) {
  return (
    <span className="px-3 py-2 rounded-lg bg-card-bg border border-white/10 text-sm text-text-sub hover:border-neon-blue/30 hover:text-neon-blue transition-all duration-300">
      {name}
    </span>
  );
}
