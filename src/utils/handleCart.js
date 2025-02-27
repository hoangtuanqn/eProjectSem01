import { useState } from "react";
import toast from "react-hot-toast";
import products from "~/data/products.json";
import { useGlobalState } from "~/context/GlobalContext";

export const useCartActions = () => {
    const { setCartQuantity, setCartQuantityTemp } = useGlobalState();
    const [loadingStates, setLoadingStates] = useState({});
    const [cartItems, setCartItems] = useState([]);

    // Load cart items when component mounts
    // useLayoutEffect(() => {
    //     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    //     setCartItems(savedCart);
    //     setCartQuantity(savedCart.length);
    // }, [cartQuantity]);

    const getUpdatedCartItems = (cart, includeNotes = false) => {
        return cart
            .map((item) => {
                const productDetails = products.find((p) => p.id === item.id);
                return productDetails
                    ? {
                          ...productDetails,
                          size: item.size,
                          color: item.color,
                          quantity: item.quantity || 1,
                          ...(includeNotes && { note: item.note || "" }),
                      }
                    : null;
            })
            .filter((item) => item);
    };

    const handleCartAction = async (product, remove = false, buynow = false) => {
        const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Kiểm tra sản phẩm trong giỏ hàng với cùng id, size và color
        const existingItemIndex = currentCart.findIndex(
            (item) => item.id === product.id && item.size === product.size && item.color === product.color,
        );

        const isInCart = existingItemIndex !== -1;
        setLoadingStates((prev) => ({ ...prev, [product.id]: true }));

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            let newCart;

            if (isInCart) {
                if (!remove) {
                    let success = true;
                    // Nếu sản phẩm đã tồn tại và remove=false, tăng số lượng
                    newCart = currentCart.map((item, index) => {
                        if (index === existingItemIndex) {
                            const productDetails = products.find((p) => p.id === item.id);

                            const quantity = (item.quantity || 1) + (product.quantity || 1);
                            if (quantity <= productDetails.quantity) {
                                return {
                                    ...item,
                                    quantity: quantity,
                                    selected: item.selected || product.selected,
                                };
                            } else {
                                success = false;
                                toast.error("The quantity in your cart is about to exceed the available stock!");
                            }
                        }

                        return item;
                    });
                    if (success) {
                        setCartQuantityTemp((prev) => !prev);

                        !buynow && toast.success("Updated quantity in cart!");
                    }
                } else {
                    // Nếu remove=true, xóa sản phẩm
                    newCart = currentCart.filter((_, index) => index !== existingItemIndex);
                    toast.success("Removed from cart!");
                }
            } else {
                if (!remove) {
                    // Thêm sản phẩm mới vào giỏ hàng nếu remove=false
                    const newItem = {
                        id: product.id,
                        size: product.size ?? product.sizes[0],
                        color: product.color ?? product.colors[0],
                        quantity: product.quantity || 1,
                        selected: product.selected || false,
                    };
                    newCart = [...currentCart, newItem];
                    !buynow && toast.success("Added to cart!");
                } else {
                    // Nếu remove=true nhưng không tìm thấy sản phẩm
                    return currentCart;
                }
            }
            if (newCart) {
                setCartQuantity(newCart.length);

                localStorage.setItem("cart", JSON.stringify(newCart));
                setCartItems(newCart);
            }
            return newCart;
        } catch (error) {
            console.error("Error handling cart action:", error);

            toast.error("Error occurred!");
            return null;
        } finally {
            setLoadingStates((prev) => ({ ...prev, [product.id]: false }));
        }
    };

    const isProductInCart = (productId) => {
        return cartItems.some((item) => item.id === productId);
    };

    return {
        handleCartAction,
        isProductInCart,
        loadingStates,
        cartItems,
        getUpdatedCartItems,
    };
};
export const handleCheckQuantity = (quantity, value) => {
    if (value) {
        const val = parseInt(value);
        if (value < 1) {
            toast.error("Minimum quantity is 1");
            return false;
        }
        if (val > quantity) {
            toast.error("Currently store only " + quantity + " products left");
            return false;
        }

        if (val > 0 && val <= quantity) {
            return val;
        }
    }
    return true;
};
