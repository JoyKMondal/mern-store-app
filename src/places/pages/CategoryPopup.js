// import React, { useEffect, useState } from "react";
// import "./CategoryPopup.css";
// import { useHttpClient } from "../../shared/hooks/http-hook";
// import { Link } from "react-router-dom";

// const CategoryPopup = ({ onClose }) => {
//   const [loadedPlaces, setLoadedPlaces] = useState();
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const responseData = await sendRequest(
//           `${process.env.REACT_APP_BACKEND_URL}/api/products`
//         );

//         setLoadedPlaces(responseData.products);
//       } catch (err) {}
//     };
//     fetchUsers();
//   }, [sendRequest]);

//   const uniqueCategories = loadedPlaces ? Array.from(new Set(loadedPlaces.map(item => item.category))) : [];

//   return (
//     <div className="popup">
//       <div className="titles">Filter By Category</div>
//       <hr />
//       <ul>
//         {uniqueCategories.map((category, index) => (
//           <Link
//             to={`/shop/category/${category}`}
//             key={index}
//             onClick={() => onClose()}
//           >
//             {category}
//           </Link>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CategoryPopup;


import React, { useEffect, useState, useMemo } from "react";
import "./CategoryPopup.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Link } from "react-router-dom";

const CategoryPopup = ({ onClose }) => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`
        );
        setLoadedPlaces(responseData.products || []);
      } catch (err) {
        // Error handled by http-hook
      }
    };
    fetchProducts();
  }, [sendRequest]);

  // Memoize unique categories to avoid recalculation on every render
  const uniqueCategories = useMemo(() => {
    if (!loadedPlaces?.length) return [];
    return Array.from(new Set(loadedPlaces.map(item => item.category))).filter(Boolean);
  }, [loadedPlaces]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".popup")) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="popup" role="menu" aria-label="Category filter menu">
      <div className="popup__header">
        <h3 className="popup__title">Filter By Category</h3>
        <button
          className="popup__close"
          onClick={onClose}
          aria-label="Close category menu"
        >
          ×
        </button>
      </div>
      <hr className="popup__divider" />

      {isLoading ? (
        <div className="popup__loading">Loading categories...</div>
      ) : uniqueCategories.length === 0 ? (
        <p className="popup__empty">No categories found.</p>
      ) : (
        <ul className="popup__list">
          {uniqueCategories.map((category, index) => (
            <li key={category} className="popup__item">
              <Link
                to={`/shop/category/${encodeURIComponent(category)}`}
                className="popup__link"
                onClick={onClose}
                tabIndex={0}
                role="menuitem"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryPopup;
