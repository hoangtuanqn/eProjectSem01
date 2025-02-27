import React from "react";
import Breadcrumb from "./Breadcrumb";
export default function index({ title, items, style = {} }) {
    return <Breadcrumb title={title} items={items} style={style} />;
}
