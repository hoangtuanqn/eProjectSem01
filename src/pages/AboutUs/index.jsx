import React from "react";
import Breadcrumb from "~/components/Breadcrumb";
import AboutUs from "./AboutUs";
import useTitle from "~/hooks/useTitle";
export default function Index() {
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "About Us", url: "/pages/about" },
    ];

    useTitle("About Us");

    return (
        <>
            <main className="main">
                <Breadcrumb title="About Us" items={breadcrumbItems} />
                <AboutUs />
            </main>
        </>
    );
}
