// components/Icon.jsx
import * as Icons from 'lucide-react';

export default function Icon({ name, ...props }) {
  const LucideIcon = Icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
}
