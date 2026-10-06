import {
  Anchor,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Baby,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Heart,
  House,
  Info,
  Languages,
  Lightbulb,
  Link2,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Quote,
  Route,
  ScrollText,
  Search,
  Share2,
  ShieldCheck,
  Split,
  Sprout,
  Star,
  TreeDeciduous,
  TriangleAlert,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * Lista fechada de ícones. Proibidos por regra de marca: balança, martelo, aperto de mão,
 * dinheiro e qualquer símbolo de ostentação. Não adicionar `Scale`, `Gavel`, `Handshake`.
 */
const icons = {
  anchor: Anchor,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  "book-open": BookOpen,
  baby: Baby,
  calendar: Calendar,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  clock: Clock,
  compass: Compass,
  copy: Copy,
  "external-link": ExternalLink,
  eye: Eye,
  globe: Globe,
  heart: Heart,
  house: House,
  info: Info,
  languages: Languages,
  lightbulb: Lightbulb,
  link: Link2,
  lock: Lock,
  mail: Mail,
  "map-pin": MapPin,
  menu: Menu,
  "message-circle": MessageCircle,
  phone: Phone,
  play: Play,
  quote: Quote,
  route: Route,
  "scroll-text": ScrollText,
  search: Search,
  share: Share2,
  "shield-check": ShieldCheck,
  split: Split,
  sprout: Sprout,
  star: Star,
  "tree-deciduous": TreeDeciduous,
  warning: TriangleAlert,
  users: Users,
  video: Video,
  x: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

/** Ícones que o CMS pode oferecer para "Nossos Valores". */
export const valueIconNames = [
  "heart",
  "shield-check",
  "eye",
  "message-circle",
  "users",
  "lock",
  "book-open",
  "compass",
  "lightbulb",
  "sprout",
  "clock",
  "languages",
  "globe",
  "house",
  "route",
  "anchor",
] as const satisfies readonly IconName[];

export type ValueIconName = (typeof valueIconNames)[number];

export function isIconName(name: string): name is IconName {
  return name in icons;
}

type IconProps = { name: IconName; className?: string; size?: number; strokeWidth?: number };

/** Ícones aqui são sempre decorativos: o significado vem do texto ao lado. */
export function Icon({ name, className, size = 24, strokeWidth = 1.75 }: IconProps) {
  const Cmp = icons[name];
  return <Cmp aria-hidden="true" focusable="false" className={className} size={size} strokeWidth={strokeWidth} />;
}
