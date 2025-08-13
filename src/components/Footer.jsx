import "../styling/Footer.css";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-top">
        <div className="footer-left">
          <img src="/footer-logo.svg" alt="Footer Logo" className="logo" />
        </div>
        <div className="footer-right">
          <a href="https://twitter.com/Protegrity" target="_blank" rel="noopener noreferrer" aria-label="Protegrity Twitter">
            <img src="/X.png" alt="X" className="socials" />
          </a>
          <a href="https://www.linkedin.com/company/protegrity/" target="_blank" rel="noopener noreferrer" aria-label="Protegrity LinkedIn">
            <img src="/Linkedin.webp" alt="Ln" className="socials" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} Protegrity</div>
      </div>
    </footer>
  );
}
