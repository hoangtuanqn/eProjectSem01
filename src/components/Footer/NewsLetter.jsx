import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { isValidEmail } from "~/utils/helpers";
// Component này sử dụng CSS chung với Footer
export default function NewsLetter() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const emailInputRef = useRef(null);

    const checkEmailExists = async (email) => {
        try {
            const { data } = await axios.get("https://679c74f887618946e65240bb.mockapi.io/api/v1/subscribers");
            return data.some((entry) => entry.email === email);
        } catch (error) {
            setMessage({ text: "Error checking email", type: "error" });
            throw error;
        }
    };

    const subscribeEmail = async (email) => {
        try {
            const { data } = await axios.post("https://679c74f887618946e65240bb.mockapi.io/api/v1/subscribers", {
                email,
            });
            return data;
        } catch (error) {
            console.error("Error subscribing email:", error);
            return false;
        }
    };

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setMessage({ text: "", type: "" });
            emailInputRef.current.classList.remove("error");

            if (!isValidEmail(email)) {
                setMessage({ text: "Invalid email format", type: "error" });
                emailInputRef.current.classList.add("error");
                emailInputRef.current.focus();
                return;
            }

            setLoading(true);

            try {
                const emailExists = await checkEmailExists(email);

                if (emailExists) {
                    setMessage({ text: "This email is already subscribed.", type: "error" });
                    emailInputRef.current.classList.add("error");
                    emailInputRef.current.focus();
                } else {
                    const success = await subscribeEmail(email);

                    if (success) {
                        setMessage({ text: "You have successfully subscribed to our newsletter!", type: "success" });
                        setEmail("");
                        emailInputRef.current.classList.remove("error");
                    } else {
                        setMessage({ text: "Subscription failed. Please try again", type: "error" });
                        emailInputRef.current.classList.add("error");
                        emailInputRef.current.focus();
                    }
                }
            } catch (error) {
                setMessage({ text: "An error occurred. Please try again", type: "error" });
                emailInputRef.current.classList.add("error");
                emailInputRef.current.focus();
            } finally {
                setLoading(false);
            }
        },
        [email],
    );

    const handleInputChange = useCallback((e) => {
        setEmail(e.target.value);
        setMessage({ text: "", type: "" }); // Clear message when user starts typing
        emailInputRef.current.classList.remove("error"); // Reset border
    }, []);

    return (
        <>
            <div className="footer__column">
                <h3 className="footer__heading">Sign Up for Email</h3>
                <p className="footer__desc">Subscribe to our newsletter to receive news on update.</p>
                <form className="footer__form" onSubmit={handleSubmit}>
                    <div className="footer__form-group">
                        <div className="footer__input-wrapper">
                            <input
                                type="email"
                                placeholder=" "
                                className="footer__input"
                                value={email}
                                onChange={handleInputChange}
                                required
                                ref={emailInputRef}
                            />
                            <label className="footer__label">Enter your email</label>
                        </div>
                        <button type="submit" className="btn footer__submit" disabled={loading}>
                            {loading ? (
                                <img
                                    src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                    alt="Loading..."
                                    className="loading-spinner"
                                />
                            ) : (
                                "SUBSCRIBE"
                            )}
                        </button>
                    </div>
                    {message.text && <p className={`footer__message ${message.type}`}>{message.text}</p>}
                </form>
            </div>
        </>
    );
}
