import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "~/styles/policies.css";

export default function Policies() {
    // Add this array of policy highlights
    const policyHighlights = [
        "30-day return policy",
        "Free shipping on returns",
        "Secure data protection",
        "No third-party data sharing",
        "Customer rights protection",
    ];

    return (
        <motion.section
            className="policies"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <div className="container">
                <motion.div
                    className="policies__wrapper"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    {/* <h1 className="policies__title">Our Policies</h1> */}

                    <motion.div
                        className="policies__content"
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        <motion.div
                            className="policies__section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        >
                            <h2 className="policies__section-title">Returns & Refunds</h2>
                            <div className="policies__text">
                                <p>
                                    At <span className="policies__highlight">{process.env.REACT_APP_BRAND_NAME}</span>,
                                    we stand behind the quality of our products and want you to be completely satisfied
                                    with your purchase.
                                </p>

                                <h3>Return Policy Overview</h3>
                                <ul>
                                    <li>You have 30 days from the date of delivery to initiate a return.</li>
                                    <li>
                                        Items must be unused, unworn, and in the same condition that you received them.
                                    </li>
                                    <li>All original packaging, tags, and accessories must be included.</li>
                                    <li>You must provide proof of purchase (order number or receipt).</li>
                                </ul>

                                <div className="policies__quote">
                                    We strive to make the return process as simple and straightforward as possible.
                                </div>

                                <h3>How to Initiate a Return</h3>
                                <ol>
                                    <li>Log into your account and go to your order history.</li>
                                    <li>Select the item(s) you wish to return and provide a reason.</li>
                                    <li>Print the prepaid return shipping label.</li>
                                    <li>Pack the item securely and attach the shipping label.</li>
                                    <li>Drop off the package at your nearest post office or schedule a pickup.</li>
                                </ol>

                                <p>
                                    Once we receive and inspect the returned item, we will process your refund. Please
                                    allow 5-10 business days for the refund to appear on your original payment method.
                                </p>

                                {/* <a href="#" className="policies__button">
                                    Initiate a Return
                                </a> */}
                            </div>
                        </motion.div>

                        <motion.div
                            className="policies__section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                        >
                            <h2 className="policies__section-title">Privacy Policy</h2>
                            <div className="policies__text">
                                <p>
                                    Your privacy is important to us at{" "}
                                    <span className="policies__highlight">{process.env.REACT_APP_BRAND_NAME}</span>.
                                    This Privacy Policy outlines how we collect, use, and protect your personal
                                    information.
                                </p>

                                <h3>Information We Collect</h3>
                                <ul>
                                    <li>
                                        Personal identification information (Name, email address, phone number, etc.)
                                    </li>
                                    <li>Billing and shipping address</li>
                                    <li>Payment information (credit card numbers, PayPal email, etc.)</li>
                                    <li>Browsing history and shopping preferences</li>
                                </ul>

                                <h3>How We Use Your Information</h3>
                                <ul>
                                    <li>To process and fulfill your orders</li>
                                    <li>To communicate with you about your orders and provide customer support</li>
                                    <li>To personalize your shopping experience and improve our services</li>
                                    <li>To send you marketing communications (with your consent)</li>
                                </ul>

                                <div className="policies__quote">
                                    We are committed to protecting your personal information and will never sell it to
                                    third parties.
                                </div>

                                <h3>Your Rights</h3>
                                <p>You have the right to:</p>
                                <ul>
                                    <li>Access and receive a copy of your personal data</li>
                                    <li>Request the correction of inaccurate personal data</li>
                                    <li>Request the deletion of your personal data</li>
                                    <li>Object to the processing of your personal data</li>
                                    <li>Request the restriction of processing your personal data</li>
                                </ul>

                                <p>
                                    If you have any questions about our Privacy Policy or wish to exercise your rights,
                                    please contact our Data Protection Officer at{" "}
                                    <a
                                        href={`mailto:${process.env.REACT_APP_BRAND_EMAIL}`}
                                        className="policies__highlight"
                                    >
                                        {process.env.REACT_APP_BRAND_EMAIL}
                                    </a>
                                    .
                                </p>

                                <Link to="/pages/contact" className="policies__button">
                                    Contact Us
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="policies__summary"
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1 }}
                    >
                        <h3 className="policies__summary-title">Policy Highlights</h3>
                        <ul className="policies__summary-list">
                            {policyHighlights.map((highlight, index) => (
                                <motion.li
                                    key={index}
                                    className="policies__summary-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                                >
                                    {highlight}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}
