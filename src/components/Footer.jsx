import "../styling/Footer.css";

/**
 * Footer component displaying company logo, social links, and copyright
 * - Uses semantic HTML5 footer tag for accessibility
 * - Includes social media links with proper accessibility attributes
 * - Dynamically displays current year for copyright
 */
export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      {/* Top section with logo and social links */}
      <div className="footer-top">
        <div className="footer-left">
          {/* Company logo that matches Protegrity branding */}
          <img src="/footer-logo.svg" alt="Footer Logo" className="logo" />
        </div>
        <div className="footer-right">
          {/* Twitter/X link with accessible attributes */}
          <a 
            href="https://twitter.com/Protegrity" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Protegrity Twitter"
          >
            <img src="/X.png" alt="X" className="socials" />
          </a>
          {/* LinkedIn link with accessible attributes */}
          <a 
            href="https://www.linkedin.com/company/protegrity/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Protegrity LinkedIn"
          >
            <img src="/Linkedin.webp" alt="Ln" className="socials" />
          </a>
        </div>
      </div>
      
      {/* Bottom section with copyright */}
      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} Protegrity</div>
      </div>
    </footer>
  );
}