import React from "react";
import { Link } from "react-router-dom";
import "~/styles/breadcrumb.css";

export default function Breadcrumb({ title, items, style = {} }) {
    return (
        <section className="breadcrumb">
            <div className="container">
                <div className="beardcumb__inner" style={style}>
                    {title && <h1 className="breadcrumb__title">{title}</h1>}
                    {/* Style tùy chỉnh bên ngoài nếu có */}
                    <div className="breadcrumb__list">
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                <div>
                                    {index === items.length - 1 ? (
                                        <span className="breadcrumb__item line-clamp" style={{ "--line-clamp": 1 }}>
                                            {item.label}
                                        </span>
                                    ) : (
                                        <Link
                                            to={item.url}
                                            className="breadcrumb__link line-clamp"
                                            style={{ "--line-clamp": 1 }}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                                {index < items.length - 1 && <span className="breadcrumb__separator">/</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
