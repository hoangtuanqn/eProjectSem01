import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import clsx from "clsx";
import { closeWithAnimation, handleClickOutside } from "~/utils/menuHelpers";
import { useCartActions, handleCheckQuantity } from "~/utils/handleCart";
import { useGlobalState } from "~/context/GlobalContext";
import categories from "~/data/categories.json";
import products from "~/data/products.json";
import "~/styles/menuCart.css";

const MenuCart = forwardRef(({ isOpen, onClose }, ref) => {
    const {
        cartQuantity,
        setCartQuantity,
        cartQuantityTemp,
        setCartQuantityTemp,
        wishlistQuantity,
        setWishlistQuantity,
    } = useGlobalState();
    const [cartItems, setCartItems] = useState([]);
    const [deletingItemId, setDeletingItemId] = useState(null);
    const navigate = useNavigate();
    const { handleCartAction, getUpdatedCartItems } = useCartActions();
    const { pathname } = useLocation();
    // Load cart items from localStorage and match with product data
    useEffect(() => {
        const cartStorage = JSON.parse(localStorage.getItem("cart")) || [];
        const cartWithDetails = cartStorage
            .map((item) => {
                const productDetails = products.find((p) => p.id === item.id);
                return productDetails
                    ? {
                          ...productDetails,
                          size: item.size,
                          color: item.color,
                          quantity: item.quantity, // Default quantity
                      }
                    : null;
            })
            .filter((item) => item); // Remove any null items

        setCartItems(cartWithDetails);
    }, [cartQuantity, cartQuantityTemp]);

    useLayoutEffect(() => {
        setCartQuantity(cartItems.length);
    }, [cartItems, setCartQuantity]);

    // Update wishlist quantity trước khi render
    useLayoutEffect(() => {
        setWishlistQuantity(JSON.parse(localStorage.getItem("wishlist") ?? "[]").length || 0);
    }, [wishlistQuantity, setWishlistQuantity]);

    // Update cart quantity trước khi render
    useLayoutEffect(() => {
        setCartQuantity(JSON.parse(localStorage.getItem("cart") ?? "[]").length || 0);
    }, [cartQuantity, setCartQuantity]);

    const handleClose = useCallback(() => {
        closeWithAnimation(ref);
        onClose();
    }, [ref, onClose]);

    useEffect(() => {
        const menu = document.querySelector(".cart.active");
        if (menu) {
            menu.classList.add("closing");
            setTimeout(() => {
                menu.classList.remove("active", "closing");
            }, 500);
        }
    }, [pathname]);

    const handleQuantityInput = (id, maxQuantity, value) => {
        value = parseInt(value);
        // if (!handleCheckQuantity(maxQuantity, value)) return;
        const newQuantity = Math.max(1, parseInt(value) || 1);
        // Update state

        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }),
        );
        setCartQuantityTemp((prev) => !prev);

        // Update localStorage
        const cartStorage = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = cartStorage.map((item) => {
            if (item.id === id) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleRemoveItem = async (id) => {
        setDeletingItemId(id);
        // Lấy thông tin đầy đủ của sản phẩm từ cartItems
        const itemToRemove = cartItems.find((item) => item.id === id);
        const updatedCart = await handleCartAction(itemToRemove, true);
        if (updatedCart) {
            setCartItems(getUpdatedCartItems(updatedCart));
        }
        setDeletingItemId(null);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    const numberTotal = calculateSubtotal();
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div
            ref={ref}
            className={clsx("cart", { active: isOpen })}
            onClick={(e) => handleClickOutside(e, ref, onClose)}
        >
            <div className="cart__list">
                <div className="cart__header">
                    <h2 className="cart__title">Newly Added Products</h2>
                    <button className="cart__close" onClick={handleClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart__items-container">
                    <AnimatePresence mode="popLayout">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => {
                                const categoryProduct = categories.find((c) => c.name === item.category);
                                const itemProductOrigin = products.find((p) => p.id === item.id);
                                return (
                                    <motion.article
                                        key={`${item.id}-${item.size}-${item.color}`}
                                        className="cart-item"
                                        layout
                                        initial={{ opacity: 1 }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                            marginBottom: 0,
                                            marginLeft: -200,
                                            transition: {
                                                opacity: { duration: 0.2 },
                                                height: { duration: 0.3, delay: 0.1 },
                                            },
                                        }}
                                    >
                                        <div className="cart-item__top">
                                            <Link to={`/product/${item.slug}`}>
                                                <img
                                                    src={`${process.env.REACT_APP_BASE_URL}${item.thumbnail}`}
                                                    alt={item.name}
                                                    className="cart-item__img"
                                                />
                                            </Link>
                                            <div className="cart-item__info">
                                                <Link
                                                    className="cart-item__category"
                                                    to={`/category/${categoryProduct?.slug ?? ""}`}
                                                >
                                                    {item.category}
                                                </Link>
                                                <h3>
                                                    <Link to={`/product/${item.slug}`} className="cart-item__name">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <div className="cart-item__details">
                                                    <div className="cart-item__detail">
                                                        <span className="cart-item__label">Size:</span>
                                                        <span className="cart-item__value">{item.size}</span>
                                                    </div>
                                                    <div className="cart-item__detail">
                                                        <span className="cart-item__label">Color:</span>
                                                        <span className="cart-item__value">{item.color}</span>
                                                    </div>
                                                </div>
                                                <div className="cart-item__price">
                                                    <span
                                                        className="cart-item__current-price line-clamp"
                                                        style={{ "--line-clamp": 4 }}
                                                    >
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="cart-item__actions">
                                            <div className="product__quantity-input">
                                                <button
                                                    className={clsx(
                                                        "product__quantity-button",
                                                        item.quantity <= 1 && "disabled",
                                                    )}
                                                    onClick={() => {
                                                        if (
                                                            handleCheckQuantity(
                                                                itemProductOrigin.quantity,
                                                                item.quantity - 1,
                                                            )
                                                        ) {
                                                            handleQuantityInput(
                                                                item.id,
                                                                itemProductOrigin.quantity,
                                                                item.quantity - 1,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    className={clsx(
                                                        "product__quantity-number",
                                                        itemProductOrigin.quantity <= 0 && "disabled",
                                                    )}
                                                    onChange={(e) => {
                                                        if (
                                                            handleCheckQuantity(
                                                                itemProductOrigin.quantity,
                                                                e.target.value,
                                                            )
                                                        ) {
                                                            handleQuantityInput(
                                                                item.id,
                                                                itemProductOrigin.quantity,
                                                                e.target.value,
                                                            );
                                                        }
                                                    }}
                                                    min="1"
                                                    max={itemProductOrigin.quantity}
                                                />
                                                <button
                                                    className={clsx(
                                                        "product__quantity-button",
                                                        itemProductOrigin.quantity <= 0 && "disabled",
                                                    )}
                                                    onClick={() => {
                                                        if (
                                                            handleCheckQuantity(
                                                                itemProductOrigin.quantity,
                                                                item.quantity + 1,
                                                            )
                                                        ) {
                                                            handleQuantityInput(
                                                                item.id,
                                                                itemProductOrigin.quantity,
                                                                item.quantity + 1,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className={clsx(
                                                    "cart-page__remove-btn",
                                                    itemProductOrigin.quantity <= 0 && "disabled",
                                                )}
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={deletingItemId === item.id}
                                            >
                                                {deletingItemId === item.id ? (
                                                    <img
                                                        src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                        alt="Loading..."
                                                        className="loading-spinner"
                                                    />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </motion.article>
                                );
                            })
                        ) : (
                            <div className="cart__empty">
                                <img
                                    src={`${process.env.REACT_APP_BASE_URL}/assets/imgs/cart_empty.png`}
                                    alt="Empty cart"
                                    className="cart__empty-img"
                                />

                                <p className="cart__empty-text">Your cart is empty</p>
                                <button
                                    className="btn cart__empty-button"
                                    onClick={() => {
                                        handleClose();
                                        navigate("/categories");
                                    }}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="cart__footer">
                    <div className="cart__subtotal">
                        <span className="cart__subtotal-label">Subtotal</span>
                        <span className="cart__subtotal-amount">{formatCurrency(numberTotal)}</span>
                    </div>

                    <div className="cart__buttons">
                        <Link to="/cart" onClick={handleClose} className="cart__button cart__button--filled">
                            View Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MenuCart;
