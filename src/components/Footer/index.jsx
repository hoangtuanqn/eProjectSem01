import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
    Mail,
    Phone,
    FileText,
    MapPin,
    HelpCircle,
    BriefcaseBusiness,
    Map,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Inbox,
} from "lucide-react";
import "~/styles/footer.css";
import NewsLetter from "./NewsLetter";
import { initTicker } from "./ticker";
import { initScrollToTop } from "~/utils/scrollToTop";
import stores from "~/data/stores.json";
import { Link } from "react-router-dom";
export default function Footer() {
    useEffect(() => {
        initTicker();
        const cleanupScrollToTop = initScrollToTop();

        return () => {
            if (typeof cleanupScrollToTop === "function") {
                cleanupScrollToTop();
            }
        };
    }, []);
    return (
        <>
            {/* Gọi Toaster 1 file để hiển thị cho toàn bộ */}
            <Toaster />
            <footer className="footer">
                <div className="container">
                    <div className="footer__inner">
                        {/* Company Information */}
                        <div className="footer__column">
                            <h3 className="footer__heading">Company Information</h3>
                            {stores.map((store, index) => (
                                <address className="footer__address" key={store.id}>
                                    <MapPin size={18} style={{ marginRight: "8px" }} />
                                    <a
                                        href={`https://maps.google.com/?q=${store.coordinates.lat},${store.coordinates.lng}`}
                                        className="footer__address-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {store.address}
                                    </a>
                                </address>
                            ))}

                            <p className="footer__link-wrap">
                                <Mail size={18} />
                                Email:
                                <a href={`mailto:${process.env.REACT_APP_BRAND_EMAIL}`} className="footer__link">
                                    {process.env.REACT_APP_BRAND_EMAIL}
                                </a>
                            </p>

                            <p className="footer__link-wrap">
                                <Phone size={18} />
                                Phone:
                                <a href={`tel:${process.env.REACT_APP_BRAND_PHONE}`} className="footer__link">
                                    {process.env.REACT_APP_BRAND_PHONE}
                                </a>
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="footer__column">
                            <h3 className="footer__heading">Quick Links</h3>
                            <ul className="footer__list">
                                <li>
                                    <Link to="/pages/policies" className="footer__link">
                                        <FileText size={20} strokeWidth={1.5} />
                                        <span>Policies</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/faq" className="footer__link">
                                        <HelpCircle size={18} /> FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/careers" className="footer__link">
                                        <BriefcaseBusiness size={18} /> Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/sitemap" className="footer__link">
                                        <Map size={18} /> Sitemap
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/partners" className="footer__link">
                                        <Inbox size={18} /> Partners
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/contact" className="footer__link">
                                        <Phone size={18} /> Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/*Social Media */}
                        <div className="footer__column">
                            <h3 className="footer__heading">Social Media</h3>
                            <ul className="footer__list footer__social-list">
                                <li>
                                    <a
                                        href="https://www.facebook.com/TheFashionWorldVN/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer__social-link facebook"
                                    >
                                        <Facebook size={24} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.instagram.com/modeblogg/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer__social-link instagram"
                                    >
                                        <Instagram size={24} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://x.com/fashion?mx=2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer__social-link twitter"
                                    >
                                        <Twitter size={24} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#!"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer__social-link linkedin"
                                    >
                                        <Linkedin size={24} />
                                    </a>
                                </li>
                            </ul>
                            <ul className="footer__list footer__social-list">
                                <li>
                                    <iframe
                                        title="Facebook Page Timeline"
                                        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F100063156842633&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                                        width="340"
                                        height="200"
                                        style={{
                                            border: "none",
                                            overflow: "hidden",
                                        }}
                                        loading="lazy"
                                        allowFullScreen={true}
                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    ></iframe>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <NewsLetter />
                    </div>

                    {/* Footer Bottom */}
                    <div className="footer__bottom">
                        <p className="footer__copyright">
                            &copy; {new Date().getFullYear()}, Team 02 FPT Aptech Vietnam
                        </p>
                        <div className="footer__payment">
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/assets/icon/visa.svg`}
                                alt="Visa"
                                className="footer__payment-img"
                            />
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/assets/icon/mastercard.svg`}
                                alt="Mastercard"
                                className="footer__payment-img"
                            />
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/assets/icon/amex.svg`}
                                alt="American Express"
                                className="footer__payment-img"
                            />
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/assets/icon/paypal.svg`}
                                alt="PayPal"
                                className="footer__payment-img"
                            />
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/assets/icon/diners.svg`}
                                alt="Diners Club"
                                className="dinersclub-img"
                            />
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/assets/icon/discover.svg`}
                                alt="Discover"
                                className="footer__payment-img"
                            />
                        </div>
                    </div>

                    {/* Scoll top button */}
                    <button className="scrollToTopBtn" id="scrollToTopBtn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4l-8 8h5v8h6v-8h5z" />
                        </svg>
                    </button>
                </div>
            </footer>
            {/* Ticker */}
            <div className="footer__ticker-container">
                <div className="footer__ticker">
                    <span id="dateTime"></span>
                    <span id="location"></span>
                </div>
            </div>
        </>
    );
}
