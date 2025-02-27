import React from "react";
import "~/styles/brandLogos.css"; // Import CSS Module
import brand from "~/data/brand.json";
export default function BrandLogos() {
    return (
        <>
            {/* Brand Logo */}
            <section className="brand-logos">
                <ul className="brand-logos__list">
                    {brand.map((item) => (
                        <li className="brand-logos__item" key={item.id}>
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}${item.image}`}
                                alt={item.name}
                                className="brand-logos__image"
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}
