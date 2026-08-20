export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-logo">
          <span style={{color: '#C94E0A'}}>GUN</span>FITS
        </div>
        <ul className="footer-links">
          <li><a href="https://www.instagram.com/gun_fits?igsh=MWJ0emw4ZncwY2FqOA==" target="_blank" rel="noreferrer">Instagram</a></li>
          <li><a href="https://www.tiktok.com/@gunfits" target="_blank" rel="noreferrer">TikTok</a></li>
          <li><a href="/collections">Shop</a></li>
          <li><a href="mailto:hello@gunfits.co">Contact</a></li>
          <li><a href="mailto:hello@gunfits.co?subject=Return%20Query">Returns</a></li>
        </ul>
        <p className="footer-copy">EST 2021.</p>
      </div>
    </footer>
  );
}