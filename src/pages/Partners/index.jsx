import React from "react";
import Partners from "./Partners";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";
export default function Index() {
    useTitle("Partners");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Partners", url: "/pages/partners" },
    ];
    return (
        <>
            <main className="main">
                <Breadcrumb title="" items={breadcrumbItems} style={{ alignItems: "flex-start" }} />
                <Partners />
            </main>
        </>
    );
}
