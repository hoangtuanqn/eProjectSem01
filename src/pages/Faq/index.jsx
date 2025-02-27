import React from "react";
import Faq from "./Faq";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";
export default function Index() {
    useTitle("FAQ");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "FAQ", url: "/pages/faq" },
    ];
    return (
        <>
            <main className="main">
                <Breadcrumb title="FAQ" items={breadcrumbItems} />
                <Faq />
            </main>
        </>
    );
}
