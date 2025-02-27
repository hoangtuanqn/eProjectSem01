import React from "react";
import "~/styles/marquee.css"; // Import CSS Module
import marqueeData from "~/data/marquee.json";

const Marquee = () => {
    return (
        <section className="marquee">
            <div className="marquee__track">
                <div className="marquee__list">
                    {marqueeData.map(({ id, text }) => (
                        <div key={id} className="marquee__content">
                            <img src={`${process.env.REACT_APP_BASE_URL}/assets/icon/start.svg`} alt="" className="marquee__icon" />
                            <p className="marquee__desc">{text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Marquee;
