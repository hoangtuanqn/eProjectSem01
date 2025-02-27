import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "~/styles/hero.css";
import clsx from "clsx";

export default function Hero() {
    const slides = [
        {
            image: "/assets/imgs/background-1.jpg",
            title: "The Largest School Uniform Supplier in the Country",
            description: "We prioritize user experience and provide the best uniform solutions for students.",
        },
        {
            image: "/assets/imgs/background-2.jpg",
            title: "Explore Our Latest Collection",
            description: "Stylish and comfortable uniforms designed for students.",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    return (
        <section className="hero">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="hero-slide">
                        <div
                            className="hero__bg"
                            style={{
                                background: `url('${process.env.REACT_APP_BASE_URL}${slide.image}') top center / cover no-repeat`,
                            }}
                        ></div>
                        <div className="container">
                            <div className="hero__inner">
                                <motion.h1
                                    className={clsx("hero__heading", {
                                        "line-clamp": window.innerWidth > 750,
                                    })}
                                    style={{
                                        "--line-clamp": 3,
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {slide.title}
                                </motion.h1>

                                <motion.p
                                    className="hero__desc"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    {slide.description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link to="/categories" className="btn hero__btn">
                                        Shop Now
                                        <ArrowUpRight size={20} />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}
