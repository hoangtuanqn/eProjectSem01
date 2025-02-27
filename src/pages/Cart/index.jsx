import React from "react";
import useTitle from "~/hooks/useTitle";
import Breadcrumb from "~/components/Breadcrumb";
import Cart from "./Cart";

export default function Index() {
    useTitle("Your Shopping Cart");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Cart", url: "/cart" },
    ];
    return (
        <>
            <main className="main2">
                <Breadcrumb title="Shopping Cart" items={breadcrumbItems} />
                <Cart />
            </main>
        </>
    );
}
