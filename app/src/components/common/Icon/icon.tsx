import {
    User,
    Car,
    MapPin,
    Settings,
    LogOut,
    Plus,
    Trash2,
    Edit2,
    Star,
    BadgeCheck,
    Lock,
    Unlock,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Check,
    X,
    AlertCircle,
    Info,
    Eye,
    EyeOff,
    Heart,
    Search,
    Filter,
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Home,
    Phone,
    Mail,
    Menu,
    MoreVertical,
    Share2,
    Download,
    Upload,
    Image,
    Video,
    File,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowDown,
    Circle,
    Square,
    Triangle,
    type Icon as LucideIcon,
  } from "lucide-react"
  
  export type Icon = LucideIcon
  
  export const Icons = {
    user: User,
    car: Car,
    mapPin: MapPin,
    settings: Settings,
    logout: LogOut,
    plus: Plus,
    trash: Trash2,
    edit: Edit2,
    star: Star,
    badgeCheck: BadgeCheck,
    lock: Lock,
    unlock: Unlock,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp,
    check: Check,
    close: X,
    warning: AlertCircle,
    info: Info,
    eye: Eye,
    eyeOff: EyeOff,
    heart: Heart,
    search: Search,
    filter: Filter,
    calendar: Calendar,
    clock: Clock,
    creditCard: CreditCard,
    dollarSign: DollarSign,
    home: Home,
    phone: Phone,
    mail: Mail,
    menu: Menu,
    moreVertical: MoreVertical,
    share: Share2,
    download: Download,
    upload: Upload,
    image: Image,
    video: Video,
    file: File,
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
    circle: Circle,
    square: Square,
    triangle: Triangle,
    // Ícones personalizados podem ser adicionados aqui
    spinner: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    ),
    logo: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    carFront: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M21 8h-8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8" />
        <path d="M19 12h2" />
        <rect width="6" height="4" x="3" y="12" rx="1" />
        <path d="M7 12v-2a2 2 0 0 1 2-2h2" />
      </svg>
    ),
    carProfile: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </svg>
    ),
    // Adicione mais ícones personalizados conforme necessário
  }