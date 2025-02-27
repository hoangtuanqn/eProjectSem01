import React from "react";
import OrderError from "./OrderError";
// import Breadcrumb from "../../components/Breadcrumb";
import useTitle from "~hooks/useTitle";

export default function Index() {
    useTitle("Order Error");

    return (
        <>
            <main className="main">
                <OrderError />
            </main>
        </>
    );
}
