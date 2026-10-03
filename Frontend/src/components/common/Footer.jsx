import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand"><Link to="/">Crave<span>Cart</span></Link><p>Simple ordering for everyday cravings.</p></div>
        <div className="footer-links"><Link to="/">Home</Link><Link to="/foods">Menu</Link><Link to="/cart">Cart</Link></div>
        <p className="footer-copy">© {new Date().getFullYear()} CraveCart</p>
      </div>
    </footer>
  );
}
export default Footer;
