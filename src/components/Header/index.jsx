import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCart } from "lucide-react";

import { initMobileMenu } from "~/assets/js/main";
import { openMenu, closeWithAnimation, handleClickOutside, toggleSubmenu } from "~/utils/menuHelpers";
import { useGlobalState } from "~/context/GlobalContext";

import "~/styles/header.css";
import "~/styles/headerSearch.css";
import Gradient from "./Gradient";
import Counter from "./Counter";
import MenuDesktop from "./MenuDesktop";
import MenuMobile from "./MenuMobile";
import Cart from "./MenuCart";
import toast from "react-hot-toast";

export default function Header() {
    const { cartQuantity, wishlistQuantity } = useGlobalState();
    const mobileMenuRef = useRef(null);

    const searchRef = useRef(null);
    const cartRef = useRef(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [valueSearch, setValueSearch] = useState("");

    // Tái sử dụng hàm đóng menu/search/cart
    const closeMenuWithAnimation = () => closeWithAnimation(mobileMenuRef);
    const closeSearchWithAnimation = () => closeWithAnimation(searchRef);
    const closeCartWithAnimation = () => {
        closeWithAnimation(cartRef);
        setIsCartOpen(false);
    };

    useEffect(() => {
        // Xử lý đóng menu/search/cart khi click outside
        const handleMenuOutside = (e) => handleClickOutside(e, mobileMenuRef, closeMenuWithAnimation);
        const handleSearchOutside = (e) => handleClickOutside(e, searchRef, closeSearchWithAnimation);
        const handleCartOutside = (e) => handleClickOutside(e, cartRef, closeCartWithAnimation);

        document.addEventListener("click", handleMenuOutside);
        document.addEventListener("click", handleSearchOutside);
        document.addEventListener("click", handleCartOutside);

        return () => {
            document.removeEventListener("click", handleMenuOutside);
            document.removeEventListener("click", handleSearchOutside);
            document.removeEventListener("click", handleCartOutside);
        };
    }, []);

    useEffect(() => {
        const cleanup = initMobileMenu();
        return () => {
            if (typeof cleanup === "function") {
                cleanup();
            }
        };
    }, []);

    const { pathname } = useLocation(); // lấy url hiện tại
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        if (!valueSearch) {
            toast.error("Please enter a search term");
            return;
        }
        if (valueSearch.trim().length > 255) {
            toast.error("Search term must be less than 255 characters");
            return;
        }
        navigate("/category/all-product", {
            state: { searchTerm: valueSearch.trim() },
        });
        setValueSearch("");
        closeSearchWithAnimation();
    };
    return (
        <>
            {/* Gradient */}

            <Gradient />
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header__inner dfbetween">
                        {/* Mobile Menu Toggle Button */}
                        <button className="mobile-menu-toggle" aria-label="Toggle menu">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 12H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 6H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 18H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {/* Desktop Navigation */}
                        <div className="header__logo-wrap">
                            <Link
                                to="/"
                                rel="noreferrer"
                                onClick={() =>
                                    // Nếu đang ở trang chủ thì kéo lên
                                    // Không phải ở trang chủ thì quay về trang chủ
                                    pathname === "/" ? window.scrollTo({ top: 0, behavior: "smooth" }) : ""
                                }
                            >
                                <img
                                    src={`${process.env.REACT_APP_BASE_URL}/assets/imgs/logo.png`}
                                    alt={process.env.REACT_APP_BRAND_NAME}
                                    className="header__logo"
                                />
                            </Link>

                            <MenuDesktop />
                        </div>
                     
                        {/* Search */}
                        <div className="dfbetween">
                            <button
                                className="header__icon-wrap dfbetween hiddenMobile"
                                onClick={() => openMenu(searchRef)}
                            >
                                <Search className="header__icon" />
                            </button>
                            {/* Wishlist */}
                            <Link to="/pages/wishlist">
                                <button className="header__icon-wrap dfbetween hiddenMobile">
                                    <Heart className="header__icon" />
                                    <span className="cart-badge">{wishlistQuantity}</span>
                                </button>
                            </Link>
                            {/* Cart */}
                            <button
                                className="header__icon-wrap dfbetween hiddenMobile header__icon-cart"
                                onClick={() => openMenu(cartRef)}
                            >
                                <ShoppingCart className="header__icon" />
                                <span className="cart-badge">{cartQuantity}</span>
                                {/* <CartHover /> */}
                            </button>
                            <Counter />
                        </div>

                        {/* Mobile Menu */}
                        <MenuMobile toggleSubmenu={toggleSubmenu} />

                        {/* Search */}
                        <div className="search" ref={searchRef}>
                            <div className="search__content">
                                <form action="" onSubmit={handleSearch}>
                                    <div className="search__group-input">
                                        <input
                                            type="text"
                                            name=""
                                            className="search__input"
                                            value={valueSearch}
                                            onChange={(e) => setValueSearch(e.target.value)}
                                            placeholder="Search our store"
                                            maxLength={255}
                                        />
                                        <button type="submit" className="search__button">
                                            <svg
                                                className="icon icon-search"
                                                aria-hidden="true"
                                                focusable="false"
                                                role="presentation"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M0.833313 9.16659C0.833313 4.56421 4.56427 0.833252 9.16665 0.833252C13.769 0.833252 17.5 4.56421 17.5 9.16659C17.5 11.1677 16.7946 13.004 15.6191 14.4405L19.1666 17.9881L17.9881 19.1666L14.4406 15.619C13.0041 16.7946 11.1677 17.4999 9.16665 17.4999C4.56427 17.4999 0.833313 13.7689 0.833313 9.16659ZM9.16665 2.49992C5.48475 2.49992 2.49998 5.48469 2.49998 9.16659C2.49998 12.8485 5.48475 15.8333 9.16665 15.8333C12.8486 15.8333 15.8333 12.8485 15.8333 9.16659C15.8333 5.48469 12.8486 2.49992 9.16665 2.49992Z"
                                                    fill="currentColor"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                    {/* Tái sử dụng lại class "mobile-menu__close" của menu  */}
                                    <button
                                        type="button"
                                        className="mobile-menu__close"
                                        aria-label="Close menu"
                                        onClick={closeSearchWithAnimation}
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M18 6L6 18M6 6l12 12"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            ></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Cart ref={cartRef} isOpen={isCartOpen} onClose={closeCartWithAnimation} />
        </>
    );
}
