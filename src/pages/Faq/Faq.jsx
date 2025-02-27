import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import "~/styles/faq.css";
import faqData from "~/data/faq.json";

export default function Faq() {
    const [openQuestion, setOpenQuestion] = useState(1);

    const toggleQuestion = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <motion.section
            className="faq"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container">
                <motion.div
                    className="faq__grid"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="faq__content">
                        <motion.h1
                            className="faq__title"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            Shipping information
                        </motion.h1>
                        <div className="faq__questions">
                            {faqData.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="faq__item"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                >
                                    <button
                                        className={`faq__question ${openQuestion === item.id ? "active" : ""}`}
                                        onClick={() => toggleQuestion(item.id)}
                                    >
                                        <span>{item.question}</span>
                                        {openQuestion === item.id ? (
                                            <Minus className="faq__icon" />
                                        ) : (
                                            <Plus className="faq__icon" />
                                        )}
                                    </button>
                                    <div className={`faq__answer ${openQuestion === item.id ? "active" : ""}`}>
                                        {item.answer.map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <motion.div
                        className="faq__image"
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <img
                            src={`${process.env.REACT_APP_BASE_URL}/assets/imgs/faq.webp`}
                            alt="Customer Service Representative"
                            width={600}
                            height={800}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}
