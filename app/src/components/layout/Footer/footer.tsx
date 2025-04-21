import React from "react"
import { Link } from "react-router"
import { Input } from "~/src/components/imported/input"
import { Button } from "~/src/components/imported/button"
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react'
import { cn } from "~/src/lib/utils"

interface FooterLinkProps {
  href: string
  label: string
}

interface FooterSectionProps {
  title: string
  links: FooterLinkProps[]
}

interface SocialLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

interface FooterProps {
  logo?: React.ReactNode
  brandName?: string
  sections?: FooterSectionProps[]
  socialLinks?: SocialLinkProps[]
  showNewsletter?: boolean
  copyrightText?: string
  className?: string
}

const FooterLink = ({ href, label }: FooterLinkProps) => (
  <li>
    <Link 
      to={href} 
      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      {label}
    </Link>
  </li>
)

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <FooterLink key={link.href} href={link.href} label={link.label} />
      ))}
    </ul>
  </div>
)

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <Link 
    to={href} 
    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
    aria-label={label}
  >
    {icon}
  </Link>
)

export default function Footer({
  logo,
  brandName = "Brand",
  sections = [
    {
      title: "Shop",
      links: [
        { href: "/products", label: "All Products" },
        { href: "/new-arrivals", label: "New Arrivals" },
        { href: "/bestsellers", label: "Bestsellers" },
        { href: "/sale", label: "Sale" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/stores", label: "Our Stores" },
        { href: "/careers", label: "Careers" },
        { href: "/sustainability", label: "Sustainability" },
      ],
    },
    {
      title: "Help",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/faq", label: "FAQ" },
        { href: "/shipping", label: "Shipping & Returns" },
        { href: "/size-guide", label: "Size Guide" },
      ],
    },
  ],
  socialLinks = [
    { href: "https://instagram.com", icon: <Instagram size={20} />, label: "Instagram" },
    { href: "https://facebook.com", icon: <Facebook size={20} />, label: "Facebook" },
    { href: "https://twitter.com", icon: <Twitter size={20} />, label: "Twitter" },
    { href: "https://youtube.com", icon: <Youtube size={20} />, label: "YouTube" },
  ],
  showNewsletter = true,
  copyrightText = `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`,
  className,
}: FooterProps) {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription logic here
  }

  return (
    <footer className={cn("w-full border-t bg-background py-12", className)}>
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {logo || (
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {brandName.charAt(0)}
                </div>
              )}
              <span className="text-lg font-medium">{brandName}</span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-4">
              {socialLinks.map((link, index) => (
                <SocialLink key={index} {...link} />
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <FooterSection key={index} {...section} />
          ))}

          {/* Newsletter */}
          {showNewsletter && (
            <div className="space-y-3 lg:col-span-1">
              <h3 className="text-sm font-medium">Subscribe to our newsletter</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Your email" 
                    required 
                    className="h-9"
                  />
                  <Button type="submit" size="sm" className="h-9">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Subscribe</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  By subscribing you agree to our{" "}
                  <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">{copyrightText}</p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
