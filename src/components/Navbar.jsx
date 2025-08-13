import "../styling/Navbar.css"

/**
 * Navigation header with logo and external link button
 * - Includes clickable logo that resets the feed (via onLogoClick prop)
 * - Features a prominent call-to-action button
 * - Uses semantic nav element for better accessibility
 */
export default function Navbar({ onLogoClick }) {
  return (
    <nav className="header">
      {/* Left-aligned logo and title */}
      <div className="header-left">
        <div>
          {/* Clickable logo that resets application state */}
          <a href="/" onClick={onLogoClick}>
            <img 
              src="/protegrity-logo.svg" 
              alt="Protegrity Logo" 
              className="logo" 
            />
          </a>
        </div>
        {/* App title that also resets the feed */}
        <a href="/" onClick={onLogoClick}>Protegrity Feed</a>
      </div>

      {/* External link button to main company site */}
      <button className="button">
        <a 
          href="https://www.protegrity.com/" 
          target="_blank" 
          rel="noreferrer noopener"
        >
          Visit Protegrity.com
        </a>
      </button>
    </nav>
  );
}