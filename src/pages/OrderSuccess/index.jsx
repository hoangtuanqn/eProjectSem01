import React from "react";
import OrderSuccess from "./OrderSuccess";
// import Breadcrumb from "../../components/Breadcrumb";
import useTitle from "~/hooks/useTitle";

export default function Index() {
    useTitle("Order Success");
    // const breadcrumbItems = [
    //     { label: "Home", url: "/" },
    //     { label: "Partners", url: "/pages/partners" },
    // ];
    return (
        <>
            <main className="main">
                {/* <Breadcrumb title="" items={breadcrumbItems} /> */}
                <OrderSuccess />
            </main>
        </>

    );
}
