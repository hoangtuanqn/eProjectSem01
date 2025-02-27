import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "~/styles/categories.css";
import data from "~/data/categories.json";
import product from "~/data/products.json";

export default function Categories() {
    const [counter, setCounter] = useState(() => {
        const objectCounter = {};
        product.forEach((item) => {
            objectCounter[item.category] = objectCounter[item.category] ? ++objectCounter[item.category] : 1;
        });
        return objectCounter;
    });

    return (
        <motion.section
            className="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <div className="categories__grid">
                    {data.map((category, index) => (
                        <motion.div
                            className="categories__column"
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <figure className="categories__imgs">
                                <Link to={`/category/${category.slug}`}>
                                    <img
                                        src={`${process.env.REACT_APP_BASE_URL}${category.image}`}
                                        alt={category.name}
                                        className="categories__img"
                                    />
                                </Link>
                            </figure>
                            <div className="categories__info">
                                <h3>
                                    <Link className="categories__title" to={`/category/${category.slug}`}>
                                        {category.name}
                                    </Link>
                                </h3>
                                <span className="categories__counter">{counter[category.name] ?? 0} item</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
