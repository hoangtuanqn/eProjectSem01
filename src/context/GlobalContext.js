import React, { createContext, useState, useContext } from "react";

// 1. Tạo Context
const GlobalContext = createContext();

// 2. Tạo Provider
export const GlobalProvider = ({ children }) => {
    const [cartQuantity, setCartQuantity] = useState(0);
    const [cartQuantityTemp, setCartQuantityTemp] = useState(false);
    const [wishlistQuantity, setWishlistQuantity] = useState(0);

    return (
        <GlobalContext.Provider
            value={{
                cartQuantity,
                setCartQuantity,
                cartQuantityTemp,
                setCartQuantityTemp,
                wishlistQuantity,
                setWishlistQuantity,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

// 3. Custom Hook để dễ sử dụng
export const useGlobalState = () => useContext(GlobalContext);
