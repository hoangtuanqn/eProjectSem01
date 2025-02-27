import React from "react";
import Careers from "./Careers";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";

export default function Index() {
    useTitle("Careers");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Careers", url: "/careers" },
    ];
    return (
        <>
            <main className="main2">
                <Breadcrumb title="" items={breadcrumbItems} style={{ alignItems: "flex-start" }} />
                <Careers />
            </main>
        </>
    );
}
