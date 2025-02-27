import React from "react";
import "./toolip.css";

const Tooltip = ({ content, children }) => {
    return (
        <div className="tooltip">
            <div className="tooltip-content top">{content}</div>
            {children}
        </div>
    );
};

export default Tooltip;
