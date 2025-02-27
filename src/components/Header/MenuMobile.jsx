import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { useGlobalState } from "~/context/GlobalContext";
import Counter from "./Counter";
import clsx from "clsx";

const MenuMobile = ({ toggleSubmenu }) => {
    const { pathname } = useLocation();
    const { cartQuantity, wishlistQuantity } = useGlobalState();

    const handleSubmenuClick = (e) => {
        const menu = document.querySelector(".mobile-menu.active");
        if (menu) {
            menu.classList.add("closing");
            setTimeout(() => {
                menu.classList.remove("active", "closing");
                document.body.style.overflow = "";
            }, 500);
        }
    };

    useEffect(() => {
        handleSubmenuClick();
    }, [pathname]);

    return (
        <div className="mobile-menu">
            <div className="mobile-menu__overlay"></div>

            <div className="mobile-menu__content">
                <div className="mobile-menu__header">
                    <h2>
                        <Link to="/" className="mobile-menu__title">
                            Maverick Dresses
                        </Link>
                    </h2>

                    {/* Button close Menu */}
                    <button className="mobile-menu__close" aria-label="Close menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
                <nav className="mobile-menu__nav">
                    <ul className="mobile-menu__list">
                        <li className="mobile-menu__item">
                            <Link
                                to="/"
                                className={clsx("mobile-menu__link", {
                                    active: pathname === "/",
                                })}
                                onClick={() => {
                                    pathname === "/" && window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                <span>Home</span>
                            </Link>
                        </li>
                        <li className="mobile-menu__item">
                            <button
                                className={clsx("mobile-menu__link", {
                                    active: pathname.includes("/category/"),
                                })}
                                data-submenu="products"
                                onClick={(e) => toggleSubmenu(e)}
                            >
                                <span>Products</span>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 1v10M1 6h10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                            <ul className="mobile-submenu">
                                <li>
                                    <button className="mobile-submenu__link" onClick={(e) => toggleSubmenu(e)}>
                                        <span>School Uniforms</span>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6 1v10M1 6h10"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                    <ul className="mobile-submenu__child">
                                        <li>
                                            <Link
                                                to="/category/shirts"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/shirts",
                                                })}
                                            >
                                                Shirts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/category/skirts"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/skirts",
                                                })}
                                            >
                                                Skirts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/category/frocks"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/frocks",
                                                })}
                                            >
                                                Frocks
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <button className="mobile-submenu__link" onClick={(e) => toggleSubmenu(e)}>
                                        <span>Sport Uniforms</span>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6 1v10M1 6h10"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                    <ul className="mobile-submenu__child">
                                        <li>
                                            <Link
                                                to="/category/pttshirts"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/pttshirts",
                                                })}
                                            >
                                                P.T T-shirts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/category/ptshorts"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/ptshorts",
                                                })}
                                            >
                                                P.T. Shorts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/category/pttrackpants"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/pttrackpants",
                                                })}
                                            >
                                                P.T. track pants
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <button className="mobile-submenu__link" onClick={(e) => toggleSubmenu(e)}>
                                        <span>Accessories</span>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6 1v10M1 6h10"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                    <ul className="mobile-submenu__child">
                                        <li>
                                            <Link
                                                to="/category/belts"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/belts",
                                                })}
                                            >
                                                Belts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/category/ties"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/ties",
                                                })}
                                            >
                                                Ties
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/category/logos"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/logos",
                                                })}
                                            >
                                                Logos
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/category/socks"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/category/socks",
                                                })}
                                            >
                                                Socks
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="mobile-menu__item">
                            <button
                                className={clsx("mobile-menu__link", {
                                    active: pathname.includes("/pages/about"),
                                })}
                                data-submenu="about"
                                onClick={(e) => toggleSubmenu(e)}
                            >
                                <span>About</span>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 1v10M1 6h10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                            <ul className="mobile-submenu">
                                <li>
                                    <Link
                                        to="/pages/about"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/about",
                                        })}
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/careers"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/careers",
                                        })}
                                    >
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/partners"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/partners",
                                        })}
                                    >
                                        Partners
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/customer-growth-chart"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/customer-growth-chart",
                                        })}
                                    >
                                        Growth & Achievement
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/awards"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/awards",
                                        })}
                                    >
                                        Awards & Recognition
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="mobile-menu__item">
                            <button
                                className={clsx("mobile-menu__link", {
                                    active:
                                        pathname.includes("/pages/support") ||
                                        pathname.includes("/pages/faq") ||
                                        pathname.includes("/pages/contact"),
                                })}
                                data-submenu="support"
                                onClick={(e) => toggleSubmenu(e)}
                            >
                                <span>Support</span>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 1v10M1 6h10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                            <ul className="mobile-submenu">
                                <li>
                                    <Link
                                        to="/pages/faq"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/faq",
                                        })}
                                    >
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/policies"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/policies",
                                        })}
                                    >
                                        Policies
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/contact"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/contact",
                                        })}
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/size-guide"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/size-guide",
                                        })}
                                    >
                                        Size Guide
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/order-tracking"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/order-tracking",
                                        })}
                                    >
                                        Order Tracking
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="mobile-menu__item">
                            <button
                                className={clsx("mobile-menu__link", {
                                    active: pathname.includes("/pages/gallery") || pathname.includes("/blog"),
                                })}
                                data-submenu="media"
                                onClick={(e) => toggleSubmenu(e)}
                            >
                                <span>Media</span>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 1v10M1 6h10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                            <ul className="mobile-submenu">
                                <li>
                                    <button className="mobile-submenu__link" onClick={(e) => toggleSubmenu(e)}>
                                        <span>Gallery</span>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6 1v10M1 6h10"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                    <ul className="mobile-submenu__child">
                                        <li>
                                            <Link
                                                to="/pages/gallery/product-photos"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/pages/gallery/product-photos",
                                                })}
                                            >
                                                Product Photos
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/pages/gallery/school-events"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/pages/gallery/school-events",
                                                })}
                                            >
                                                School Events
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/pages/gallery/sports-events"
                                                className={clsx("mobile-submenu__link", {
                                                    active: pathname === "/pages/gallery/sports-events",
                                                })}
                                            >
                                                Sports Events
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link
                                        to="/blog/news"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/blog/news",
                                        })}
                                    >
                                        News
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="mobile-menu__item">
                            <button
                                className={clsx("mobile-menu__link", {
                                    active:
                                        pathname.includes("/pages/wishlist") ||
                                        pathname.includes("/pages/coupons") ||
                                        pathname.includes("/pages/recently-products"),
                                })}
                                data-submenu="activities"
                                onClick={(e) => toggleSubmenu(e)}
                            >
                                <span>Activities</span>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 1v10M1 6h10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                            <ul className="mobile-submenu">
                                <li>
                                    <Link
                                        to="/pages/wishlist"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/wishlist",
                                        })}
                                    >
                                        Wishlist
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/coupons"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/coupons",
                                        })}
                                    >
                                        Coupons
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/recently-products"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/recently-products",
                                        })}
                                    >
                                        Recently Products
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pages/order-tracking"
                                        className={clsx("mobile-submenu__link", {
                                            active: pathname === "/pages/order-tracking",
                                        })}
                                    >
                                        Order Tracking
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                {/* Add icons before login link */}
                <div className="mobile-menu__bottom">
                    <div className="mobile-menu__icons">
                        <Link to="/pages/search" className="mobile-menu__icon-btn" aria-label="Search">
                            <Search size={20} />
                        </Link>
                        <Link to="/pages/wishlist" className="mobile-menu__icon-btn" aria-label="Wishlist">
                            <Heart size={20} />
                            <span className="cart-badge">{wishlistQuantity}</span>
                        </Link>
                        <Link to="/cart" className="mobile-menu__icon-btn" aria-label="Cart">
                            <ShoppingCart size={20} />
                            <span className="cart-badge">{cartQuantity}</span>
                        </Link>
                    </div>
                    {/* <a href="#!" className="mobile-menu__visited">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.667 17.5v-1.667a3.333 3.333 0 00-3.334-3.333H6.667a3.333 3.333 0 00-3.334 3.333V17.5M10 9.167A3.333 3.333 0 1010 2.5a3.333 3.333 0 000 6.667z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Log in
                    </a> */}
                    <Counter />
                </div>
            </div>
        </div>
    );
};

export default MenuMobile;
