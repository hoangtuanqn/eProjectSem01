import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "~/styles/sitemap.css";
import sitemapData from "~/data/sitemap.json";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function Sitemap() {
    return (
        <section className="sitemap">
            <div className="container">
                <motion.div
                    className="sitemap__header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="sitemap__title">Sitemap</h1>
                    <p className="sitemap__description">
                        Navigate through our website's complete structure. Find everything you need with ease.
                    </p>
                </motion.div>

                <motion.div className="sitemap__grid" variants={containerVariants} initial="hidden" animate="visible">
                    {Object.entries(sitemapData).map(([key, section]) => (
                        <motion.div key={key} className="sitemap__section" variants={sectionVariants}>
                            <h2 className="sitemap__section-title">{section.title}</h2>
                            <ul className="sitemap__list">
                                {section.items.map((item, index) => (
                                    <li key={index} className="sitemap__item">
                                        <Link to={item.path} className="sitemap__link">
                                            <ChevronRight size={16} />
                                            {item.name}
                                        </Link>
                                        {item.subitems && (
                                            <ul className="sitemap__sublist">
                                                {item.subitems.map((subitem, subIndex) => (
                                                    <li key={subIndex} className="sitemap__subitem">
                                                        <Link to={subitem.path} className="sitemap__sublink">
                                                            <ChevronRight size={14} />
                                                            {subitem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
