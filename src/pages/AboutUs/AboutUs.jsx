import { Check, Truck, Gift, Crown, ArrowUpRight } from "lucide-react";
import "~/styles/aboutUs.css";
import Team from "~/components/Team"; // Không trỏ vào file index vì nó có BreadCumb
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const features = [
    { id: 1, text: "Latest Technology" },
    { id: 2, text: "Quick Servicing" },
    { id: 3, text: "Best R&D Team" },
    { id: 4, text: "Expert Team" },
];

const benefits = [
    {
        id: 1,
        icon: <Truck className="about-us__benefit-icon" />,
        title: "FREE SHIPPING",
        description: "On all orders over $75.00",
    },
    {
        id: 2,
        icon: <Gift className="about-us__benefit-icon" />,
        title: "FREE SHIPPING",
        description: "On all orders over $75.00",
    },
    {
        id: 3,
        icon: <Crown className="about-us__benefit-icon" />,
        title: "MONEY BACK",
        description: "30 days money back guarantee",
    },
];

export default function AboutUs() {
    return (
        <>
            <motion.section
                className="about-us"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container">
                    {/* Hero Section */}
                    <motion.div
                        className="about-us__hero"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            className="about-us__hero-image"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/assets/imgs/about-1.webp`}
                                alt="Team working together"
                                className="about-us__image"
                            />
                            <div className="about-us__image-overlay"></div>
                        </motion.div>
                        <motion.div
                            className="about-us__hero-content"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h1 className="about-us__title">Our Dream is to be a Global Fashion Brand</h1>
                            <p className="about-us__description">
                                At <strong>Maverick Dresses</strong>, we specialize in providing high-quality school
                                uniforms that combine comfort, durability, and style. Our mission is to create uniforms
                                that inspire pride and unity among students, while meeting the practical needs of
                                everyday school life. We believe that every student deserves to feel confident and
                                comfortable in their uniform. That's why we focus on premium materials, thoughtful
                                designs, and exceptional customer service to ensure the best experience for schools and
                                families. Join us in making school uniforms a symbol of pride and belonging for every
                                student.
                            </p>
                            <motion.div
                                className="about-us__features"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.id}
                                        className="about-us__feature"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Check className="about-us__feature-icon" size={20} />
                                        <span>{feature.text}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                            <Link to="/categories">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn hero__btn about-us__cta"
                                >
                                    Shop Now
                                    <ArrowUpRight size={20} />
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Benefits Section */}
                    <motion.div
                        className="about-us__benefits"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.id}
                                className="about-us__benefit"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                {benefit.icon}
                                <h3 className="about-us__benefit-title">{benefit.title}</h3>
                                <p className="about-us__benefit-description">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Story Section */}
                    <motion.div
                        className="about-us__story"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >
                        <motion.div
                            className="about-us__story-content"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                        >
                            <h2 className="about-us__story-title">Our Story and How We Grew</h2>
                            <p className="about-us__story-text">
                                At <strong>Maverick Dresses</strong>, our journey began with a simple goal: to provide
                                high-quality school uniforms that inspire pride and unity among students. Over the
                                years, we have grown into a trusted name in the industry, thanks to our commitment to
                                quality, innovation, and customer satisfaction.
                            </p>

                            <motion.div
                                className="about-us__story-section"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 1.6 }}
                            >
                                <h3 className="about-us__story-subtitle">Our Mission</h3>
                                <p className="about-us__story-text">
                                    Our mission is to create school uniforms that are not only stylish and comfortable
                                    but also durable and functional. We aim to support schools and families by offering
                                    uniforms that reflect the values and traditions of their institutions while meeting
                                    the practical needs of everyday school life.
                                </p>
                            </motion.div>

                            <motion.div
                                className="about-us__story-section"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 1.8 }}
                            >
                                <h3 className="about-us__story-subtitle">Our Vision</h3>
                                <p className="about-us__story-text">
                                    We envision a future where every student feels confident and proud in their uniform.
                                    By continuously improving our designs and services, we strive to be the leading
                                    provider of school uniforms, helping to foster a sense of belonging and identity in
                                    students everywhere.
                                </p>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="about-us__story-image"
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <img src={`${process.env.REACT_APP_BASE_URL}/assets/imgs/aboutus-2.jpg`} alt="Fashion models" className="about-us__image" />
                            <div className="about-us__image-overlay"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <Team />
        </>
    );
}
