import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import categories from "~/data/categories.json";
import sizeGuides from "~/data/sizeGuides.json";
import "~/styles/sizeGuide.css";
export default function SizeGuide() {
    const [selectedCategory, setSelectedCategory] = useState("shirts");
    return (
        <section className="size-guide">
            <div className="container">
                <motion.div
                    className="size-guide__intro"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                ></motion.div>
                <div className="gallery__categories">
                    {categories.map((category) => (
                        <motion.button
                            key={category.id}
                            className={`gallery__category ${selectedCategory === category.slug ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category.slug)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category.name}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {sizeGuides[selectedCategory] && (
                        <motion.div
                            key={selectedCategory}
                            className="size-guide__content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h2 className="size-guide__title">{sizeGuides[selectedCategory].title}</h2>
                            <p className="size-guide__description">{sizeGuides[selectedCategory].description}</p>

                            <motion.div
                                className="size-guide__table-wrapper"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <table className="size-guide__table">
                                    <thead>
                                        <tr>
                                            <th>Size</th>
                                            {Object.keys(sizeGuides[selectedCategory].sizes[0])
                                                .filter((key) => key !== "size")
                                                .map((key) => (
                                                    <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)} (cm)</th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeGuides[selectedCategory].sizes.map((size, index) => (
                                            <tr key={index}>
                                                <td>{size.size}</td>
                                                {Object.entries(size)
                                                    .filter(([key]) => key !== "size")
                                                    .map(([key, value]) => (
                                                        <td key={key}>{value}</td>
                                                    ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>

                            <motion.div
                                className="size-guide__tips"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h3>Measurement Tips</h3>
                                <ul>
                                    {sizeGuides[selectedCategory].measurementTips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
