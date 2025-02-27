import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "~/styles/notFound.css";
// Library aos
import "aos/dist/aos.css"; // Import file CSS của AOS
import AOS from "aos";

export default function NotFound() {
    useEffect(() => {
        AOS.init({
            duration: 1200,
            anchorPlacement: "top-bottom",
            once: true,
        });
    }, []);
    return (
        <>
            <section className="notfound">
                <img data-aos="fade-down" src={`${process.env.REACT_APP_BASE_URL}/assets/imgs/404.png`} alt="404 error" className="notfound__img" />
                <h1 className="notfound__title">Oops! Page not found</h1>
                <p className="notfound__desc">The page you requested does not exist.</p>
                <Link to="/categories" className="btn notfound__link">
                    Continue Shopping
                </Link>
            </section>
        </>
    );
}
