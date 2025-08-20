import type { FC } from "react";
import { Link, Outlet } from "react-router";

const Layout: FC = () => {
  return (
    <div className="mx-auto pt-4">
      <nav>
        <ol className="flex flex-col gap-8 md:flex-row md:items-center md:justify-center">
          <Link to="/start" className="underline-offset-2 hover:underline">
            Start
          </Link>
          <Link to="/memo-only" className="underline-offset-2 hover:underline">
            Memo-Only
          </Link>
          <Link to="/defer-only" className="underline-offset-2 hover:underline">
            Deferred-Only
          </Link>
          <Link
            to="/defer-and-memo"
            className="underline-offset-2 hover:underline"
          >
            Defer with Memo
          </Link>
        </ol>
      </nav>

      <Outlet />
    </div>
  );
};

export default Layout;
