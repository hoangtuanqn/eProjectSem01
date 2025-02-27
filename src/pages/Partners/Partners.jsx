import { useRef } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "~/styles/partners.css";
import partners from "~/data/brand.json";

export default function Partners() {
    const [hoveredPartner, setHoveredPartner] = useState(null);
    const gridRef = useRef(null);
    const ctaRef = useRef(null);
    const isGridInView = useInView(gridRef, { once: true, margin: "-100px" });
    const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });
    const navigate = useNavigate();

    return (
        <section className="partners">
            <div className="container">
                <header className="partners__header">
                    <motion.h1
                        className="partners__title"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.7,
                            type: "spring",
                            bounce: 0.4,
                        }}
                    >
                        Our Collaborative Partners
                    </motion.h1>
                    <motion.p
                        className="partners__subtitle"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        We partner with leading schools, manufacturers, and suppliers to deliver high-quality school
                        uniforms that meet the needs of students and educators alike. Together, we strive to create
                        uniforms that inspire pride, comfort, and confidence.
                    </motion.p>
                </header>
                <motion.div
                    ref={gridRef}
                    className="partners__grid"
                    initial={{ opacity: 0, y: 100 }}
                    animate={isGridInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    {partners.map((partner, index) => (
                        <motion.div
                            key={partner.id}
                            className="partners__item"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={isGridInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                type: "spring",
                                bounce: 0.4,
                            }}
                            whileHover={{
                                scale: 1.05,
                                rotate: [0, -2, 2, 0],
                                transition: {
                                    rotate: {
                                        duration: 0.3,
                                        repeat: 0,
                                    },
                                },
                            }}
                            onHoverStart={() => setHoveredPartner(partner.id)}
                            onHoverEnd={() => setHoveredPartner(null)}
                        >
                            <motion.img
                                src={partner.image}
                                alt={partner.name}
                                className="partners__logo"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                            />
                            {hoveredPartner === partner.id && (
                                <motion.div
                                    className="partners__info"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3>{partner.name}</h3>
                                    <p>Trusted partner since 2020</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div
                    ref={ctaRef}
                    className="partners__cta"
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                        isCtaInView
                            ? {
                                  opacity: 1,
                                  y: 0,
                                  transition: {
                                      duration: 0.7,
                                      type: "spring",
                                      bounce: 0.4,
                                  },
                              }
                            : {}
                    }
                >
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        animate={isCtaInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Interested in becoming a partner?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: 50 }}
                        animate={isCtaInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        Join our network of industry-leading companies and grow your business with us.
                    </motion.p>
                    <Link to="/pages/contact" state={{ type: "PARTNERSHIP" }}>
                        <motion.button className="btn partners__cta-button" whileTap={{ scale: 0.95 }}>
                            Apply Now
                            <ArrowUpRight size={20} />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
