import Link from "next/link";

const Header = ({ currentUser }) => {

  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ].filter((linkConfig) => linkConfig)
   .map(({ label, href }) => <li key={href} className="nav-item">
    <Link href={href}>
      {label}
    </Link>
  </li>);

  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        E-Commerce
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
