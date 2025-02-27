import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { XCircle, ArrowRight } from "lucide-react";
import "~/styles/order.css";

export default function OrderError() {
    localStorage.removeItem("cartCheckoutPaypal");
    localStorage.removeItem("checkoutFormData");
    return (
        <div className="order-success">
            <div className="container">
                <motion.div
                    className="order-success__header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="order-success__icon" style={{ color: "#dc3545" }}>
                        <XCircle size={40} />
                    </div>
                    <h1>Order Processing Failed</h1>
                    <p>We apologize, but there was an error processing your order.</p>
                </motion.div>

                <motion.div
                    className="order-success__actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ textAlign: "center", marginTop: "2rem" }}
                >
                    <Link to="/cart" className="btn order-error__btn">
                        Return to Cart
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
