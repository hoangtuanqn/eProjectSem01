import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import "~/styles/cartHover.css";
import { useGlobalState } from "~/context/GlobalContext";
import products from "~/data/products.json";

export default function CartHover() {
    const { cartQuantity } = useGlobalState();
    const [uniqueCartItems, setUniqueCartItems] = useState([]);

    useEffect(() => {
        const cartStorage = JSON.parse(localStorage.getItem("cart")) || [];
        // Get unique items based on product ID
        const uniqueIds = [...new Set(cartStorage.map((item) => item.id))];

        // Map unique IDs to full product details
        const cartWithDetails = uniqueIds
            .map((id) => {
                const productDetails = products.find((p) => p.id === id);
                return productDetails
                    ? {
                          ...productDetails,
                          quantity: cartStorage.filter((item) => item.id === id).length,
                      }
                    : null;
            })
            .filter((item) => item)
            .slice(0, 3); // Only show first 3 unique items

        setUniqueCartItems(cartWithDetails);
    }, [cartQuantity]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="cart-hover" onClick={(e) => e.stopPropagation()}>
            <div className="cart-hover__header">
                <ShoppingBag size={18} />
                <span>{cartQuantity} items</span>
            </div>

            <div className="cart-hover__items">
                {uniqueCartItems.map((item) => (
                    <div key={item.id} className="cart-hover__item">
                        <img src={`${process.env.REACT_APP_BASE_URL}/${item.thumbnail}`} alt={item.name} className="cart-hover__item-img" />
                        <div className="cart-hover__item-info">
                            <h4>{item.name}</h4>
                            <p>{formatCurrency(item.price)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {uniqueCartItems.length > 0 ? (
                <div className="cart-hover__footer">
                    <Link to="/cart" className="cart-hover__button">
                        View Cart
                    </Link>
                </div>
            ) : (
                <div className="cart-hover__empty">
                    <p>Your cart is empty</p>
                </div>
            )}
        </div>
    );
}
