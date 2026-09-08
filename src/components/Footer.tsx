import Link from "next/link";

export default function Footer() {
  const resources = [
    { href: "#", label: "Indexing" },
    { href: "/authors/author-guidelines", label: "Author Guidelines" },
    { href: "/authors/publication-ethics", label: "Publication Ethics" },
    { href: "/reviewers", label: "Peer Review Process" },
    ];

  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/archives", label: "Past Issues" },
    { href: "/contact", label: "Contact Us" },
    { href: "/login", label: "Submit Paper" },
  ];

  return (
    <footer className="bg-[#3F2A1D] text-[#F4EFE7] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C8A45D] flex items-center justify-center">
                <span className="font-serif text-lg text-[#3F2A1D] font-bold">J</span>
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold">JHSSI</h4>
                <p className="text-xs text-[#A8B8A0]">Since 2010</p>
              </div>
            </div>
            <p className="text-[#A8B8A0] text-sm leading-relaxed">
              Dedicated to the advancement of knowledge through interdisciplinary 
              research and global collaboration.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-serif text-lg mb-4 text-[#C8A45D]">Resources</h5>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-[#A8B8A0] text-sm hover:text-[#F4EFE7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-serif text-lg mb-4 text-[#C8A45D]">Quick Links</h5>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-[#A8B8A0] text-sm hover:text-[#F4EFE7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-serif text-lg mb-4 text-[#C8A45D]">Contact</h5>
            <div className="space-y-3">
              <p className="text-sm text-[#A8B8A0]">
                <span className="block font-medium text-[#F4EFE7]">Editorial Office:</span>
                <span>sgedlucknow@gmail.com</span>  
              </p>
              
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#5A3D26] text-center">
          <p className="text-[#7A8B6A] text-sm">
            © {new Date().getFullYear()} Journal of Humanities & Social Sciences Invention. 
            All rights reserved.
          </p>
          <p className="text-xs text-[#7A8B6A] mt-2">
            This work is licensed under a Creative Commons Attribution 4.0 International License.
          </p>
        </div>
      </div>
    </footer>
  );
}