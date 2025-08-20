import type { FC, PropsWithChildren } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { cn } from "./dumping-ground/cn";

type NavLinkProps = Readonly<PropsWithChildren<{ to: string }>>;

const NavLink: FC<NavLinkProps> = ({ to, children }) => {
  const location = useLocation();
  return (
    <Link
      to={to}
      className={cn(
        "rounded-full px-2.5 py-1.5 leading-none transition-colors duration-100 hover:bg-teal-700",
        location.pathname.startsWith(to) && "bg-teal-700"
      )}
    >
      {children}
    </Link>
  );
};

const Layout: FC = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-6">
      <nav>
        <ol className="flex flex-col gap-8 md:flex-row md:items-center md:justify-center">
          <li>
            <NavLink to="/start">Start</NavLink>
          </li>
          <li>
            <NavLink to="/memo-only">Memo-Only</NavLink>
          </li>
          <li>
            <NavLink to="/defer-only">Defer-Only</NavLink>
          </li>
          <li>
            <NavLink to="/defer-and-memo">Defer with Memo</NavLink>
          </li>
        </ol>
      </nav>

      <Outlet />
    </div>
  );
};

export default Layout;
