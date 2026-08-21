import { Link } from 'react-router-dom';
export default function Navbar({ onNavigate }) {
  return (
    <div className="navbar">
      <ul>
        <li><Link to="/" onClick={onNavigate}>Home</Link></li>
        <li><Link to="/about" onClick={onNavigate}>About</Link></li>
        <li><Link to="/contact" onClick={onNavigate}>Contact</Link></li>
        <li><Link to="/documentation" onClick={onNavigate}>Documentation</Link></li>
      </ul>
    </div>
  );
}
