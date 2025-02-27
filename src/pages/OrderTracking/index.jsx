import React from "react";
import InvoiceTracking from "./OrderTracking";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";

const breadcrumbItems = [
    { label: "Home", url: "/" },
    { label: "Invoice Tracking", url: "/pages/invoice-tracking" },
];

export default function Index() {
    useTitle("Invoice Tracking");
    return (
        <>
            <main className="main" style={{ minHeight: "50vh" }}>
                <Breadcrumb title="" items={breadcrumbItems} style={{ alignItems: "flex-start" }} />

                <InvoiceTracking />
            </main>
        </>
    );
}
