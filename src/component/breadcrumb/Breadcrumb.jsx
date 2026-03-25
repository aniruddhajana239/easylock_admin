// Breadcrumb.js
import React from "react";
import { Link } from "react-router-dom"; // If you're using React Router

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-xs space-x-2 text-gray-700">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <Link to={item.path} className="text-gray-700 ">
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <span>
              <div className="flex items-center text-gray-400">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </div>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
