import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomInIcon as Zoom, X } from "lucide-react";
import "~/styles/gallery.css";
import galleryItems from "~/data/gallery.json";
const categories = [
    "All",
    "Preschool Uniforms",
    "Primary School Uniforms",
    "High School Uniforms",
    "University Uniforms",
];

const Gallery = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filteredItems, setFilteredItems] = useState(galleryItems);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setFilteredItems(
            selectedCategory === "All"
                ? galleryItems
                : galleryItems.filter((item) => item.category === selectedCategory),
        );
    }, [selectedCategory]);

    return (
        <section className="gallery">
            <div className="container">
                {/* <h1 className="gallery__title">Our Gallery</h1> */}
                <div className="gallery__categories">
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            className={`gallery__category ${selectedCategory === category ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
                <motion.div
                    className="gallery__grid"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    <AnimatePresence>
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="gallery__item"
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedImage(item)}
                            >
                                <img
                                    src={`${process.env.REACT_APP_BASE_URL}${item.src}`}
                                    alt={item.category}
                                    loading={index > 30 ? "lazy" : "eager"}
                                />
                                <div className="gallery__item-overlay">
                                    <Zoom size={24} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="gallery__modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="gallery__modal-content"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}${selectedImage.src}`}
                                alt={selectedImage.category}
                            />
                            <button className="gallery__modal-close" onClick={() => setSelectedImage(null)}>
                                <X size={24} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
export default memo(Gallery);
