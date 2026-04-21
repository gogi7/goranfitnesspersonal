import {
  Home,
  Scale,
  Utensils,
  Clock,
  Activity,
  Camera,
  Map,
  Plus,
  Minus,
  ArrowRight,
  ArrowDown,
  Check,
  Flame,
  Trophy,
  Settings,
  Bell,
  Info,
  ChevronRight,
  X,
  Download,
  Upload,
  Trash2,
  type LucideProps,
} from 'lucide-react';

export type IconComponent = (props: LucideProps) => JSX.Element;

const defaults: LucideProps = {
  strokeWidth: 1.75,
  size: 20,
};

const wrap =
  (C: typeof Home): IconComponent =>
  (props: LucideProps) =>
    <C {...defaults} {...props} />;

export const Icon = {
  home: wrap(Home),
  scale: wrap(Scale),
  food: wrap(Utensils),
  clock: wrap(Clock),
  run: wrap(Activity),
  camera: wrap(Camera),
  map: wrap(Map),
  plus: wrap(Plus),
  minus: wrap(Minus),
  arrow: wrap(ArrowRight),
  arrowDown: wrap(ArrowDown),
  check: wrap(Check),
  flame: wrap(Flame),
  trophy: wrap(Trophy),
  settings: wrap(Settings),
  bell: wrap(Bell),
  info: wrap(Info),
  chevronR: wrap(ChevronRight),
  close: wrap(X),
  download: wrap(Download),
  upload: wrap(Upload),
  trash: wrap(Trash2),
  photo: wrap(Camera),
};
