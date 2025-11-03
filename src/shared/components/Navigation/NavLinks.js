import React, { Fragment, useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { FaShoppingCart } from "react-icons/fa";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import { FaChevronDown } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";

import Cart from "../cart/Cart";

import "./NavLinks.css";
import CategoryPopup from "../../../places/pages/CategoryPopup";

const NavLinks = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  const auth = useContext(AuthContext);

  return (
    <Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer
        show={drawerIsOpen}
        // onClick={closeDrawerHandler}
        transitionClass="slide-in-right"
        elementClass="side-drawer-cart"
      >
        <Cart onCloseCart={closeDrawerHandler} />
      </SideDrawer>
      <ul className="nav-links">
        <li>
          <button onClick={openDrawerHandler}>
            <FaShoppingCart />
          </button>
          {/* <Cart /> */}
        </li>
        <li>
          <NavLink to="/brands">Brands</NavLink>
        </li>
        <li
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
        >
          <button>
            Category
            {showPopup ? <IoIosArrowUp /> : <FaChevronDown />}
          </button>
          {showPopup && <CategoryPopup onClose={() => setShowPopup(false)} />}
        </li>

        <li>
          <NavLink to="/shop">Shop</NavLink>
        </li>

        <li onClick={() => setShowAuthPopup((prev) => !prev)}>
          <button>
            {!auth.isLoggedIn ? "Authenticate!" : `${auth.userType}`}
            {showAuthPopup ? <IoIosArrowUp /> : <FaChevronDown />}
          </button>
        </li>
        <div className={`auth-popup ${showAuthPopup ? "show" : "hidden"}`}>
          {showAuthPopup && (
            <ul>
              {auth.isLoggedIn && (
                <li onClick={() => setShowAuthPopup(false)}>
                  <NavLink to={`/user-dashboard/${auth.userId}`}>
                    User Dashboard
                  </NavLink>
                </li>
              )}
              {!auth.isLoggedIn && (
                <li onClick={() => setShowAuthPopup(false)}>
                  <NavLink to="/auth">Login</NavLink>
                </li>
              )}
              {!auth.isLoggedIn && (
                <li onClick={() => setShowAuthPopup(false)}>
                  <NavLink to="/auth">Sign Up</NavLink>
                </li>
              )}
              {auth.isLoggedIn && (
                <li onClick={() => setShowAuthPopup(false)}>
                  <button onClick={auth.logout}>Sign Out</button>
                </li>
              )}
              {auth.isLoggedIn && auth.userType === "Admin" && (
                <li onClick={() => setShowAuthPopup(false)}>
                  <NavLink to="/admin-dashboard">Admin Dashboard</NavLink>
                </li>
              )}
            </ul>
          )}
        </div>
      </ul>
    </Fragment>
  );
};

export default NavLinks;
