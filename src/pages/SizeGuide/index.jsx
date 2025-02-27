import React from "react";
import SizeGuide from "./SizeGuide";
import useTitle from "~/hooks/useTitle";
import Breadcrumb from "~/components/Breadcrumb";
export default function Index() {
    useTitle("Size Guide");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Size Guide", url: "/pages/size-guide" },
    ];
    return (
        <>
            <main className="main2">
                <Breadcrumb title="Size Guide" items={breadcrumbItems} style={{ alignItems: "flex-start" }} />
                <SizeGuide />
            </main>
        </>
    );
}
