import React from "react";
import RecentlyProducts from "./RecentlyProducts";
import useTitle from "~/hooks/useTitle";
import Breadcrumb from "~/components/Breadcrumb";
export default function Index() {
    useTitle("Recently Products");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Recently Products", url: "/pages/recently-products" },
    ];
    return (
        <>
            <main className="main2">
                <Breadcrumb title="Recently Products" items={breadcrumbItems} style={{ alignItems: "flex-start" }} />
                <RecentlyProducts />
            </main>
        </>
    );
}
