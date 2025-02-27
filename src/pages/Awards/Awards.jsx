import React from "react";
import { motion } from "framer-motion";
import awardsData from "~/data/awards.json";
import "~/styles/awards.css";

export default function Awards() {
    return (
        <section className="awards">
            <div className="container">
                <motion.div
                    className="awards__intro"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="section-top">
                        <h2 className="section-title">Awards for Excellence</h2>
                        <p className="section-subtitle awards__desc">
                            We are proud to provide high-quality school uniforms nationwide, recognized through various
                            prestigious awards.
                        </p>
                    </div>
                </motion.div>

                <div className="awards__grid">
                    {awardsData.awards.map((award, index) => (
                        <motion.div
                            key={award.id}
                            className="awards__item"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div className="awards__icon">
                                <motion.img
                                    src={award.icon}
                                    alt={award.alt}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                />
                            </div>
                            <h3 className="awards__title">{award.title}</h3>
                            <p className="awards__year">{award.year}</p>
                            <p className="awards__text">{award.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="awards__testimonial"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="awards__testimonial-content">
                        <blockquote className="awards__quote">
                            "Our success is measured not just by the awards we receive, but by the confidence and
                            satisfaction of our customers."
                        </blockquote>
                        <cite className="awards__cite">- {process.env.REACT_APP_BRAND_NAME} (Team 02 FPT APTECH)</cite>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
