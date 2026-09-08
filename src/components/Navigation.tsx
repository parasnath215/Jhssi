"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, Shield, ChevronDown } from "lucide-react";

export default function Navigation() {
  const { data: session } = useSession();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<{ [key: string]: boolean }>({});

  // Close mobile menu on resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setMobileDropdowns({});
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      href: "/",
      label: "Home",
      submenu: null,
    },
    {
      href: "/about",
      label: "About",
      submenu: [
        { href: "/about/about-the-journal", label: "About the Journal" },
        { href: "/about/disclaimer", label: "Disclaimer" },
        { href: "/about/submission", label: "Submission Guidelines" },
      ],
    },
    {
      href: "/editorial",
      label: "Editorial Board",
      submenu: null,
    },
    {
      href: "/current",
      label: "Current Issue",
      submenu: null,
    },
    {
      href: "/archives",
      label: "Archives",
      submenu: null,
    },
    {
      href: "/authors",
      label: "For Authors",
      submenu: [
        { href: "/author/dashboard", label: "Author Dashboard & Submissions" },
        { href: "/authors/author-guidelines", label: "Author Guidelines" },
        { href: "/authors/publication-ethics", label: "Publication Ethics" },
        { href: "/authors/copyright", label: "Copyright Form" },
      ],
    },
    {
      href: "/policies",
      label: "Policies",
      submenu: [
        { href: "/policies/anti-plagiarism-policy", label: "Anti-Plagiarism Policy" },
        { href: "/policies/advertisements-policy", label: "Advertisements Policy" },
        { href: "/policies/open-access-policy", label: "Open Access Policy" },
      ],
    },
    {
      href: "/reviewers",
      label: "For Reviewers",
      submenu: [
        { href: "/reviewer/dashboard", label: "Reviewer Workspace (Blind Review)" },
        { href: "/reviewers/editorial-peer-review-process", label: "Editorial Peer Review Process" },
      ],
    },
    {
      href: "/contact",
      label: "Contact",
      submenu: null,
    },
  ];

  const handleDropdownEnter = (href: string) => {
    if (navLinks.find((l) => l.href === href)?.submenu) {
      setIsAnimating(true);
      setActiveDropdown(href);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const toggleMobileDropdown = (href: string) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdowns({});
  };

  // Helper for Role Dashboard Link
  const getDashboardLink = () => {
    if (!session?.user) return "/login";
    if (session.user.role === "SUPER_ADMIN") return "/super-admin/dashboard";
    if (session.user.role === "ADMIN") return "/admin/dashboard";
    if (session.user.role === "REVIEWER") return "/reviewer/dashboard";
    return "/author/dashboard";
  };

  const getDashboardLabel = () => {
    if (!session?.user) return "Dashboard";
    if (session.user.role === "SUPER_ADMIN") return "Super Admin Console";
    if (session.user.role === "ADMIN") return "Admin Desk";
    if (session.user.role === "REVIEWER") return "Reviewer Desk";
    return "Author Desk";
  };

  return (
    <>
      <nav className="w-full bg-white border-b border-[#E6DDCF] px-4 md:px-8 py-3 md:py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-11 h-11 relative rounded-full bg-[#F6F1E8] border border-[#E6DDCF] flex items-center justify-center text-[#6B4A2E] font-serif font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
              J
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-base font-bold text-[#3F2A1D] tracking-wider">
                JHSSI
              </span>
              <span className="font-serif text-xs text-[#6B4A2E]">
                Journal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(link.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`
                    px-3 py-2 text-sm text-[#4A4036] hover:text-[#6B4A2E] transition-colors relative flex items-center gap-1 font-medium
                    ${activeDropdown === link.href ? "text-[#6B4A2E] font-semibold" : ""}
                  `}
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === link.href ? "rotate-180 text-[#C8A45D]" : "text-gray-400"
                      }`}
                    />
                  )}
                </Link>

                {/* Desktop Submenu */}
                {link.submenu && (
                  <div
                    className={`
                      absolute top-full left-0 pt-2 transition-all duration-300 z-50
                      ${
                        activeDropdown === link.href
                          ? "opacity-100 translate-y-0 pointer-events-auto visible"
                          : "opacity-0 -translate-y-2 pointer-events-none invisible"
                      }
                    `}
                  >
                    <div className="w-64 bg-white rounded-2xl shadow-xl border border-[#E6DDCF] overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-[#C8A45D] to-[#6B4A2E]" />
                      <div className="py-2">
                        {link.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-5 py-2.5 text-xs text-[#4A4036] hover:text-[#6B4A2E] hover:bg-[#F6F1E8] transition-colors font-medium border-l-2 border-transparent hover:border-[#C8A45D]"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right Section: Auth & Dashboard Controls */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {session?.user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href={getDashboardLink()}
                  className="px-4 py-2 bg-[#6B4A2E] hover:bg-[#523720] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{getDashboardLabel()}</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign Out"
                  className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2 text-xs font-semibold text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-full transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-[#6B4A2E] text-white text-xs font-semibold rounded-full hover:bg-[#5A3D26] shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#F6F1E8] transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-[#3F2A1D] transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[#3F2A1D] transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-[#3F2A1D] transition-transform duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E6DDCF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F6F1E8] flex items-center justify-center font-bold text-[#6B4A2E]">
              J
            </div>
            <span className="font-serif font-bold text-sm text-[#3F2A1D]">JHSSI Journal</span>
          </div>
          <button onClick={closeMobileMenu} className="p-1.5 text-gray-500 hover:text-gray-900">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {session?.user && (
            <div className="mb-4 p-3 bg-[#F6F1E8] rounded-xl border border-[#E6DDCF]">
              <p className="text-xs font-bold text-[#3F2A1D]">{session.user.name}</p>
              <p className="text-[10px] text-[#6B4A2E]">{session.user.role} Account</p>
              <Link
                href={getDashboardLink()}
                onClick={closeMobileMenu}
                className="mt-2 block w-full py-1.5 bg-[#6B4A2E] text-white text-center rounded-lg text-xs font-semibold"
              >
                Go to {getDashboardLabel()}
              </Link>
            </div>
          )}

          {navLinks.map((link) => (
            <div key={link.href} className="border-b border-[#E6DDCF]/50 py-1">
              {link.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMobileDropdown(link.href)}
                    className="w-full flex items-center justify-between py-2 text-sm text-[#4A4036] font-medium"
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileDropdowns[link.href] ? "rotate-180 text-[#C8A45D]" : ""
                      }`}
                    />
                  </button>
                  {mobileDropdowns[link.href] && (
                    <div className="pl-4 pb-2 space-y-1.5">
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={closeMobileMenu}
                          className="block text-xs text-[#6B4A2E] py-1 hover:underline"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block py-2 text-sm text-[#4A4036] font-medium hover:text-[#6B4A2E]"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Auth Bottom */}
        <div className="p-4 border-t border-[#E6DDCF]">
          {session?.user ? (
            <button
              onClick={() => {
                closeMobileMenu();
                signOut({ callbackUrl: "/" });
              }}
              className="w-full py-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200 text-center"
            >
              Sign Out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="py-2.5 bg-gray-100 text-[#3F2A1D] text-xs font-semibold rounded-xl text-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="py-2.5 bg-[#6B4A2E] text-white text-xs font-semibold rounded-xl text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}