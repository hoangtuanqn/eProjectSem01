import React from "react";
import Awards from "./Awards";
import Breadcrumb from "~/components/Breadcrumb/Breadcrumb";
import useTitle from "~/hooks/useTitle";

export default function Index() {
    useTitle("Awards");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Awards", url: "/awards" },
    ];

    return (
        <>
            <main className="main">
                <Breadcrumb items={breadcrumbItems} style={{ alignItems: "flex-start" }} />

                <Awards />
            </main>
        </>
    );
}
