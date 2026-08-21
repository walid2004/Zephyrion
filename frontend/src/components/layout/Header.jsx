import Menu from './Menu.jsx';
import ThemeSwitcher from './ThemeSwitcher.jsx';
export default function Header() {
  return (
    <header className="digga2">
      <Menu />
      <div id="digga">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
