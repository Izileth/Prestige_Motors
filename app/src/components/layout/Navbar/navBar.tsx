import React from 'react';
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Search, 
  User, 
  Heart, 
  ChevronDown,
  Settings,
  LogOut,
  UserPlus,
  LogIn,
  History,
  Bookmark,
  Home
} from "lucide-react"
import { cn } from "~/src/lib/utils"

// Componentes do shadcn/ui
import { Button } from "~/src/components/imported/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/src/components/imported/sheet"
import { Badge } from "~/src/components/imported/badge"
import { Input } from "~/src/components/imported/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "~/src/components/imported/dropdown-menu"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "~/src/components/imported/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "~/src/components/imported/avatar"
import { Separator } from "~/src/components/imported/separator"

// Configurações de animação - você pode ajustar conforme necessário
const ANIMATION_DURATION = 150; // ms

interface NavLinkProps {
  href: string
  label: string
  className?: string
  icon?: React.ReactNode
  onClick?: () => void
  subMenu?: { href: string; label: string }[]
}

const NavLink = ({ href, label, className, icon, onClick, subMenu }: NavLinkProps) => {
  const location = useLocation()
  const isActive = location.pathname === href
 
  
  return (
    <div className="relative group">
      {subMenu?.length ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="link" 
              className={cn(
                "flex items-center gap-2 font-medium p-0 h-auto hover:no-underline",
                isActive && "text-primary font-semibold",
                className
              )}
            >
              {icon && <span className="text-muted-foreground">{icon}</span>}
              {label}
              <ChevronDown size={14} className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={12} className="w-48">
            {subMenu.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  to={item.href}
                  className="cursor-pointer w-full"
                  onClick={onClick}
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link 
          to={href} 
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
            isActive && "text-primary font-semibold",
            className
          )}
          onClick={onClick}
        >
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {label}
        </Link>
      )}
    </div>
  )
}

interface NavBarProps {
  logo?: React.ReactNode
  brandName?: string
  links?: { 
    href: string
    label: string
    icon?: React.ReactNode
    subMenu?: { href: string; label: string }[]
  }[]
  className?: string
  cartItemCount?: number
  onSearchSubmit?: (query: string) => void
  userLoggedIn?: boolean
  userAvatar?: string
  userName?: string
  onUserClick?: () => void
  onCartClick?: () => void
  onWishlistClick?: () => void
  onLogin?: () => void
  onRegister?: () => void
  onLogout?: () => void
  onProfileClick?: () => void
  onOrdersClick?: () => void
  onSettingsClick?: () => void
}

export default function NavBar({
  logo,
  brandName = "AutoMart",
  links = [
    { href: "/", label: "Início", icon: <Home size={16} /> },
    { 
      href: "/veiculos", 
      label: "Veículos", 
      subMenu: [
        { href: "/veiculos/hypercars", label: "Hypercars" },
        { href: "/veiculos/sportcars", label: "SportCars" },
        { href: "/veiculos/hot-roads", label: "Hot-Roads" },
      ]
    },
    { href: "/promocoes", label: "Promoções" },
    { href: "/financiamento", label: "Financiamento" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ],
  className,
  cartItemCount = 0,
  onSearchSubmit,
  userLoggedIn = false,
  userAvatar,
  userName,
  onUserClick,
  onCartClick,
  onWishlistClick,
  onLogin, // Adicional Para o componente
  onRegister, // Adicional Para o componente
  onLogout,
  onProfileClick,
  onOrdersClick,
  onSettingsClick,
}: NavBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false)
  
  // Detecta o scroll para mudar o estilo da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery)
      setIsSearchMobileOpen(false)
    }
  }

  const toggleMobileSearch = () => {
    setIsSearchMobileOpen(!isSearchMobileOpen)
  }

  // Obter as iniciais do usuário para o avatar fallback
  const getUserInitials = () => {
    if (!userName) return "U";
    return userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  const navigate = useNavigate()
  
  const handleLogin = () => {
    navigate('/login')
  }

  const handleSignIn = () => {
    navigate('/register')
  }

  return (
    <header 
      className={cn(
        "sticky top-0 w-full border-b bg-background z-40 transition-all duration-200",
        isScrolled && "shadow-md",
        className
      )}
    >
      {/* Barra superior com informações adicionais */}
      <div className="hidden md:block bg-muted/50 py-1">
        <div className="container mx-auto flex justify-between items-center text-xs px-4">
          <div className="flex gap-4">
            <span>Atendimento: (11) 1234-5678</span>
            <span>contato@automart.com.br</span>
          </div>
          <div className="flex gap-4">
            <Link to="/revendedores" className="hover:text-primary transition-colors">Seja um revendedor</Link>
            <Link to="/ajuda" className="hover:text-primary transition-colors">Central de Ajuda</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            {logo || (
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold transition-transform duration-300 hover:scale-105">
                {brandName.charAt(0)}
              </div>
            )}
            <span className="text-lg font-medium">{brandName}</span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex max-w-md w-full mx-6"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Buscar veículos..."
              className="w-full pl-10 pr-4 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <NavLink 
              key={link.href} 
              href={link.href} 
              label={link.label} 
              icon={link.icon} 
              subMenu={link.subMenu}
            />
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <TooltipProvider>
            {/* Favoritos Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      aria-label="Favoritos"
                      className="relative transition-colors hover:bg-muted"
                    >
                      <Heart size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Favoritos</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Itens Favoritos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-auto p-2 flex flex-col gap-2">
                  <div className="text-center text-muted-foreground text-sm py-4">
                    Você não tem favoritos
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/favoritos" className="cursor-pointer justify-center font-medium">
                    Ver todos os favoritos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Carrinho Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="relative transition-colors hover:bg-muted"
                      aria-label="Carrinho"
                    >
                      <ShoppingCart size={20} />
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Carrinho</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Carrinho de Compras</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-auto">
                  {cartItemCount > 0 ? (
                    <div className="p-2">
                      {/* Aqui seria o conteúdo do carrinho */}
                      <div className="text-center">Itens no carrinho</div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground text-sm py-6">
                      Seu carrinho está vazio
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/carrinho" className="cursor-pointer justify-center font-medium">
                    Ver carrinho completo
                  </Link>
                </DropdownMenuItem>
                {cartItemCount > 0 && (
                  <DropdownMenuItem asChild>
                    <Link to="/checkout" className="cursor-pointer justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-md mt-2 py-2">
                      Finalizar Compra
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="relative transition-colors hover:bg-muted rounded-full h-9 w-9"
                      aria-label={userLoggedIn ? "Minha conta" : "Entrar"}
                    >
                      {userLoggedIn ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userAvatar} alt={userName || "Avatar do usuário"} />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <User size={20} />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{userLoggedIn ? "Minha conta" : "Entrar"}</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56">
                {userLoggedIn ? (
                  <>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar} alt={userName || "Avatar do usuário"} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{userName || "Usuário"}</span>
                        <span className="text-xs text-muted-foreground">Bem-vindo(a)!</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onOrdersClick} className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      <span>Meus Pedidos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onWishlistClick} className="cursor-pointer">
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Lista de Desejos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogin}  className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Entrar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignIn} className="cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Cadastrar-se</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-3">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileSearch}
            aria-label="Buscar"
            className="relative"
          >
            <Search size={20} />
          </Button>

          {/* Mobile Cart Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
                onClick={onCartClick}
                aria-label="Carrinho"
              >
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Carrinho de Compras</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-auto">
                {cartItemCount > 0 ? (
                  <div className="p-2">
                    {/* Aqui seria o conteúdo do carrinho */}
                    <div className="text-center">Itens no carrinho</div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-6">
                    Seu carrinho está vazio
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/carrinho" className="cursor-pointer justify-center font-medium">
                  Ver carrinho completo
                </Link>
              </DropdownMenuItem>
              {cartItemCount > 0 && (
                <DropdownMenuItem asChild>
                  <Link to="/checkout" className="cursor-pointer justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-md mt-2 py-2">
                    Finalizar Compra
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile Menu Button - usando Sheet do shadcn/ui */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 overflow-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>{brandName}</SheetTitle>
              </SheetHeader>
              
              {/* User Profile Section */}
              {userLoggedIn ? (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userAvatar} alt={userName || "Avatar do usuário"} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userName || "Usuário"}</p>
                      <p className="text-sm text-muted-foreground">Bem-vindo(a) de volta!</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      onClick={onProfileClick}
                    >
                      Meu Perfil
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      onClick={onLogout}
                    >
                      Sair
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex gap-2">
                  <Button 
                    onClick={onLogin} 
                    className="flex-1"
                  >
                    Entrar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onRegister} 
                    className="flex-1"
                  >
                    Cadastrar
                  </Button>
                </div>
              )}
              
              <Separator className="my-4" />
              
              {/* Mobile Nav Links */}
              <nav className="space-y-1">
                {links.map((link) => (
                  <div key={link.href} className="py-1">
                    {link.subMenu?.length ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start px-2 gap-2 font-normal text-base"
                          >
                            {link.icon && <span>{link.icon}</span>}
                            {link.label}
                            <ChevronDown size={16} className="ml-auto" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-56">
                          {link.subMenu.map((subItem) => (
                            <DropdownMenuItem key={subItem.href} asChild>
                              <Link to={subItem.href} className="cursor-pointer">
                                {subItem.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start px-2 gap-2 font-normal text-base"
                        asChild
                      >
                        <Link to={link.href}>
                          {link.icon && <span>{link.icon}</span>}
                          {link.label}
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </nav>
              
              <Separator className="my-4" />
              
              {/* Actions */}
              <div className="space-y-2">
                {userLoggedIn && (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2"
                      onClick={onOrdersClick}
                    >
                      <History size={16} />
                      Meus Pedidos
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2"
                      onClick={onWishlistClick}
                    >
                      <Heart size={16} />
                      Favoritos
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2"
                      onClick={onSettingsClick}
                    >
                      <Settings size={16} />
                      Configurações
                    </Button>
                  </>
                )}
              </div>
              
              {/* Footer Info */}
              <div className="mt-8 text-sm text-muted-foreground">
                <Separator className="mb-4" />
                <p className="mb-2">Atendimento: (11) 1234-5678</p>
                <p>contato@automart.com.br</p>
                <div className="mt-4 flex gap-2">
                  <Link to="/ajuda" className="text-sm hover:text-primary transition-colors">
                    Ajuda
                  </Link>
                  <Separator orientation="vertical" />
                  <Link to="/revendedores" className="text-sm hover:text-primary transition-colors">
                    Seja um revendedor
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Mobile Search Overlay - aparece quando o botão de busca é clicado */}
      {isSearchMobileOpen && (
        <div className="md:hidden px-4 py-2 border-t bg-background">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar veículos..."
                className="w-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <Button variant="ghost" type="button" size="icon" onClick={toggleMobileSearch}>
              <X size={20} />
            </Button>
          </form>
        </div>
      )}
    </header>
  )
}