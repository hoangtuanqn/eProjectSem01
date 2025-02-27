import React from "react";
import Contact from "./Contact";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";

export default function Index() {
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Contact", url: "/pages/contact" },
    ];
    useTitle("Contact");
    return (
        <>
            <main className="main">
                <Breadcrumb title="Contact" items={breadcrumbItems} />

                <Contact />
            </main>
        </>
    );
}
