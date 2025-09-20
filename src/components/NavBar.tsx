import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const paths = [
  { path: "/dinner-box", label: "Dinner Box" },
  { path: "/recipe-tree", label: "Recipe Tree" },
];

export function NavBar() {
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location]);

  return (
    <nav className='bg-gray-800 text-white flex'>
      {paths.map(({ path, label }) => (
        <CustomLink
          key={path}
          path={path}
          label={label}
          active={currentPage === path}
        />
      ))}
    </nav>
  );
}

interface CustomLinkProps {
  path: string;
  label: string;
  active: boolean;
}
function CustomLink({ path, label, active }: CustomLinkProps) {
  const baseClass = "py-4 px-4";
  const activeClass = "font-bold bg-gray-900 rounded";

  return (
    <Link to={path} className={`${baseClass} ${active ? activeClass : ""}`}>
      {label}
    </Link>
  );
}
