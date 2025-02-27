import React from "react";
import { Link } from "react-router-dom";
import "~/styles/categoryHighlights.css";
export default function CategoryHighlights() {
    return (
        <>
            {/* Category Highlights Section */}
            <section className="category-highlights">
                <div className="category-highlights__list">
                    <Link to="/categories">
                        <article className="category-highlights__item">
                            <div
                                className="category-highlights__background"
                                style={{ background: `url('${process.env.REACT_APP_BASE_URL}/assets/imgs/banner-1.png') center/cover no-repeat` }}
                            ></div>
                            <div className="category-highlights__content">
                                <p className="category-highlights__subtitle">TOP COLLECTIONS</p>
                                <h2 className="category-highlights__title">Top Trends Style</h2>
                                <span className="category-highlights__link">Shop Now</span>
                            </div>
                        </article>
                    </Link>

                    <Link to="/categories">
                        <article className="category-highlights__item">
                            <div
                                className="category-highlights__background"
                                style={{ background: `url('${process.env.REACT_APP_BASE_URL}/assets/imgs/banner-2.png') center/cover no-repeat` }}
                            ></div>
                            <div className="category-highlights__content">
                                <p className="category-highlights__subtitle">PREMIUM STYLE</p>
                                <h2 className="category-highlights__title">Here Your Look</h2>
                                <span className="category-highlights__link">Shop Now</span>
                            </div>
                        </article>
                    </Link>

                    <Link to="/categories">
                        <article className="category-highlights__item">
                            <div
                                className="category-highlights__background"
                                style={{ background: `url('${process.env.REACT_APP_BASE_URL}/assets/imgs/banner-3.png') center/cover no-repeat` }}
                            ></div>
                            <div className="category-highlights__content">
                                <p className="category-highlights__subtitle">EXCLUSIVE SALE</p>
                                <h2 className="category-highlights__title">Up to 50% Off</h2>
                                <span className="category-highlights__link">Shop Now</span>
                            </div>
                        </article>
                    </Link>
                </div>
            </section>
        </>
    );
}
