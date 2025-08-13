import "../styling/Navbar.css"

export default function Header({ onLogoClick }) {
  return (
    <nav className="header">
      <div className="header-left">
        <div>
          <a href="/" onClick={onLogoClick}>
            <img src="/protegrity-logo.svg" alt="Protegrity Logo" className="logo" />
          </a>
        </div>
        <a href="/" onClick={onLogoClick}>Protegrity Feed</a>
      </div>
      <button className="button">
        <a href="https://www.protegrity.com/" target="_blank" rel="noreferrer noopener">
          Visit Protegrity.com
        </a>
      </button>
    </nav>
  );
}
