import React from "react";
import Policies from "./Policies";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";
export default function Index() {
    useTitle("Shipping & Returns Policy");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Policies", url: "/pages/policies" },
    ];
    return (
        <>
            <main className="main2">
                <Breadcrumb title="Shipping & Returns Policy" items={breadcrumbItems} />
                <Policies />
            </main>
        </>
    );
}
