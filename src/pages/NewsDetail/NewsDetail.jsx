import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Share2, Facebook, Twitter, MoreHorizontal, Heart } from "lucide-react";
import PinterestIcon from "@mui/icons-material/Pinterest";
import "~/styles/NewsDetail.css";
import { Tooltip } from "@mui/material";
import { toast } from "react-hot-toast";
import { Avatar } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet-async";

export default function BlogDetail({ article }) {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("Guest User");
    const [loadingSendApi, setLoadingSendApi] = useState(false);
    const [loadingReplyApi, setLoadingReplyApi] = useState(false);
    const [likedComments, setLikedComments] = useState(() => {
        const saved = localStorage.getItem("likedComments");
        return saved ? JSON.parse(saved) : [];
    });
    const [likedReplies, setLikedReplies] = useState(() => {
        const saved = localStorage.getItem("likedReplies");
        return saved ? JSON.parse(saved) : [];
    });

    const defaultAvatar = "/assets/imgs/anonymous.jpg";

    // Comment validation schema
    const CommentSchema = Yup.object().shape({
        userName: Yup.string()
            .required("Name is required")
            .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name is too long")
            .trim(),
        comment: Yup.string()
            .min(10, "Comment must be at least 10 characters")
            .max(500, "Comment must not exceed 500 characters")
            .required("Please enter your comment"),
    });

    // Reply validation schema
    const ReplySchema = Yup.object().shape({
        userName: Yup.string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name is too long")
            .required("Please enter your name")
            .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
        reply: Yup.string()
            .min(10, "Reply must be at least 10 characters")
            .max(300, "Reply must not exceed 300 characters")
            .required("Please enter your reply"),
    });

    // Fetch comments and replies
    useLayoutEffect(() => {
        const fetchCommentsAndReplies = async () => {
            try {
                setIsLoading(true);
                // Fetch comments
                const commentsResponse = await fetch("https://67b74d1b2bddacfb270e82bb.mockapi.io/api/v1/comments");
                const commentsData = await commentsResponse.json();

                // Fetch all replies
                const repliesResponse = await fetch("https://67b74d1b2bddacfb270e82bb.mockapi.io/api/v1/reply");
                const repliesData = await repliesResponse.json();

                // Sort comments by timestamp, newest first
                const sortedComments = commentsData
                    .filter((comment) => comment.articleId === article.id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setComments(sortedComments);
                setReplies(repliesData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load comments");
            } finally {
                setIsLoading(false);
            }
        };

        if (article?.id) {
            fetchCommentsAndReplies();
        }
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [article?.id]);

    if (!article) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const handleSocialShare = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out this article: ${article.name}`);

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}&media=${encodeURIComponent(
                article.thumbnail,
            )}`,
        };

        window.open(shareUrls[platform], "_blank", "width=600,height=400");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: article.name,
                    text: `Check out this article: ${article.name}`,
                    url: window.location.href,
                })
                .catch((error) => {
                    console.error("Error sharing:", error);
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    const handleCommentSubmit = async (values, { resetForm }) => {
        try {
            setLoadingSendApi(true);
            const commentData = {
                content: values.comment,
                articleId: article.id,
                author: values.userName,
                avatar: defaultAvatar,
                createdAt: new Date().toISOString(),
                likes: 0,
            };

            const response = await fetch("https://67b74d1b2bddacfb270e82bb.mockapi.io/api/v1/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commentData),
            });

            const newCommentData = await response.json();
            setComments((prevComments) => [newCommentData, ...prevComments]);
            setUserName(values.userName); // Save username for future use
            resetForm();
            toast.success("Comment posted successfully!");
            setLoadingSendApi(false);
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error("Failed to post comment");
            setLoadingSendApi(false);
        }
    };

    const handleReplySubmit = async (values, { resetForm }) => {
        try {
            setLoadingReplyApi(true);
            const replyData = {
                content: values.reply,
                parentId: replyingTo,
                author: values.userName,
                avatar: defaultAvatar,
                createdAt: new Date().toISOString(),
                likes: 0, // Thêm giá trị mặc định cho likes
            };

            const response = await fetch("https://67b74d1b2bddacfb270e82bb.mockapi.io/api/v1/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(replyData),
            });

            const newReplyData = await response.json();
            setReplies((prevReplies) => [newReplyData, ...prevReplies]);
            setUserName(values.userName); // Save username for future use
            setReplyingTo(null);
            resetForm();
            toast.success("Reply posted successfully!");
            setLoadingReplyApi(false);
        } catch (error) {
            console.error("Error posting reply:", error);
            toast.error("Failed to post reply");
            setLoadingReplyApi(false);
        }
    };

    // Helper function to get replies for a comment
    const getCommentReplies = (commentId) => {
        return replies
            .filter((reply) => reply.parentId === commentId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const isCommentLiked = (commentId) => {
        return likedComments.includes(commentId);
    };

    const handleLikeComment = async (commentId, currentLikes) => {
        try {
            const isLiked = isCommentLiked(commentId);
            const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

            const response = await fetch(`https://67b74d1b2bddacfb270e82bb.mockapi.io/api/v1/comments/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    likes: newLikes,
                }),
            });

            if (response.ok) {
                // Cập nhật state comments
                setComments(
                    comments.map((comment) => (comment.id === commentId ? { ...comment, likes: newLikes } : comment)),
                );

                // Cập nhật localStorage
                let newLikedComments;
                if (isLiked) {
                    newLikedComments = likedComments.filter((id) => id !== commentId);
                    toast.success("Unliked!");
                } else {
                    newLikedComments = [...likedComments, commentId];
                    toast.success("Liked!");
                }
                setLikedComments(newLikedComments);
                localStorage.setItem("likedComments", JSON.stringify(newLikedComments));
            }
        } catch (error) {
            console.error("Error updating like:", error);
            toast.error("Failed to update like");
        }
    };

    const isReplyLiked = (replyId) => {
        return likedReplies.includes(replyId);
    };

    const handleLikeReply = async (replyId, currentLikes) => {
        try {
            const isLiked = isReplyLiked(replyId);
            const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

            const response = await fetch(`https://67b74d1b2bddacfb270e82bb.mockapi.io/api/v1/reply/${replyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    likes: newLikes,
                }),
            });

            if (response.ok) {
                // Cập nhật state replies
                setReplies(replies.map((reply) => (reply.id === replyId ? { ...reply, likes: newLikes } : reply)));

                // Cập nhật localStorage
                let newLikedReplies;
                if (isLiked) {
                    newLikedReplies = likedReplies.filter((id) => id !== replyId);
                    toast.success("Unliked reply!");
                } else {
                    newLikedReplies = [...likedReplies, replyId];
                    toast.success("Liked reply!");
                }
                setLikedReplies(newLikedReplies);
                localStorage.setItem("likedReplies", JSON.stringify(newLikedReplies));
            }
        } catch (error) {
            console.error("Error updating reply like:", error);
            toast.error("Failed to update reply like");
        }
    };

    // Chuẩn bị meta description từ content
    const getMetaDescription = (content) => {
        // Loại bỏ HTML tags và lấy 160 ký tự đầu tiên
        const strippedContent = content.replace(/<[^>]+>/g, "");
        return strippedContent.length > 160 ? `${strippedContent.substring(0, 157)}...` : strippedContent;
    };

    return (
        <>
            <Helmet>
                {/* Tiêu đề cơ bản */}
                <title>{article.name}</title>
                <meta name="description" content={getMetaDescription(article.content)} />

                {/* Open Graph tags cho Facebook */}
                <meta property="og:title" content={article.name} />
                <meta property="og:description" content={getMetaDescription(article.content)} />
                <meta property="og:image" content={article.thumbnail} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="article" />

                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.name} />
                <meta name="twitter:description" content={getMetaDescription(article.content)} />
                <meta name="twitter:image" content={article.thumbnail} />

                {/* Thẻ meta bổ sung cho SEO */}
                <meta name="author" content={article.author} />
                <meta name="publisher" content="Your Website Name" />
                <meta name="keywords" content={`${article.name}, news, article`} />

                {/* Canonical URL */}
                <link rel="canonical" href={window.location.href} />

                {/* Article specific meta tags */}
                <meta property="article:published_time" content={article.published_date} />
                <meta property="article:author" content={article.author} />
                <meta property="article:section" content="News" />

                {/* Schema.org markup for Google */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        headline: article.name,
                        image: [article.thumbnail],
                        datePublished: article.published_date,
                        dateModified: article.published_date,
                        author: [
                            {
                                "@type": "Person",
                                name: article.author,
                            },
                        ],
                        publisher: {
                            "@type": "Organization",
                            name: "Your Website Name",
                            logo: {
                                "@type": "ImageObject",
                                url: "/assets/imgs/logo.png", // Thay thế bằng logo của bạn
                            },
                        },
                        description: getMetaDescription(article.content),
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": window.location.href,
                        },
                    })}
                </script>
            </Helmet>

            <article className="news-detail">
                <div className="container">
                    <motion.header
                        className="news-detail__header"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="news-detail__title">{article.name}</h1>
                        <div className="news-detail__meta">
                            <div className="news-detail__meta-item">
                                <Calendar size={20} />
                                <span>{formatDate(article.published_date)}</span>
                            </div>
                            <div className="news-detail__meta-item">
                                <User size={20} />
                                <span>{article.author}</span>
                            </div>
                        </div>
                    </motion.header>

                    <motion.img
                        src={article.thumbnail}
                        alt={article.name}
                        className="news-detail__featured-image"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />

                    <motion.div
                        className="news-detail__content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />

                        <div className="news-detail__share">
                            <div className="news-detail__share-container">
                                <Tooltip content="Share">
                                    <motion.button
                                        className="btn btn--secondary news-detail__share-btn"
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Share2 size={20} />
                                    </motion.button>
                                </Tooltip>

                                {showShareMenu && (
                                    <div className="news-detail__share-menu">
                                        <button onClick={() => handleSocialShare("facebook")}>
                                            <Facebook size={20} /> Facebook
                                        </button>
                                        <button onClick={() => handleSocialShare("twitter")}>
                                            <Twitter size={20} /> Twitter
                                        </button>
                                        <button onClick={() => handleSocialShare("pinterest")}>
                                            <PinterestIcon sx={{ fontSize: 20 }} /> Pinterest
                                        </button>
                                        <button onClick={handleShare} className="hiddenMobile">
                                            <MoreHorizontal size={20} /> More
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments section */}
                        <div className="news-detail__comments">
                            <h3>Comments</h3>

                            <Formik
                                initialValues={{
                                    userName: userName,
                                    comment: "",
                                }}
                                validationSchema={CommentSchema}
                                onSubmit={handleCommentSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form className="comment-form">
                                        <Avatar src={defaultAvatar} alt="User" />
                                        <div className="comment-input-container">
                                            <div className="form-group">
                                                <Field
                                                    name="userName"
                                                    type="text"
                                                    placeholder="Your name"
                                                    className={`form-control ${
                                                        errors.userName && touched.userName ? "error" : ""
                                                    }`}
                                                />
                                                {errors.userName && touched.userName && (
                                                    <div className="error-message">{errors.userName}</div>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <Field
                                                    name="comment"
                                                    as="textarea"
                                                    placeholder="Write a comment..."
                                                    rows="3"
                                                    className={`form-control ${
                                                        errors.comment && touched.comment ? "error" : ""
                                                    }`}
                                                />
                                                {errors.comment && touched.comment && (
                                                    <div className="error-message">{errors.comment}</div>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn--primary"
                                                disabled={loadingSendApi}
                                            >
                                                {loadingSendApi ? (
                                                    <img
                                                        src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                        alt="Loading..."
                                                        className="loading-spinner"
                                                    />
                                                ) : (
                                                    "Comment"
                                                )}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>

                            <div className="comments-list">
                                {isLoading ? (
                                    <div className="loading-spinner">Loading comments...</div>
                                ) : comments.length === 0 ? (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-header">
                                                <Avatar src={comment.avatar} alt={comment.author} />
                                                <div className="comment-info">
                                                    <h4>{comment.author}</h4>
                                                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <p className="comment-content">{comment.content}</p>
                                            <div className="comment-actions">
                                                <button
                                                    className={`like-button ${
                                                        isCommentLiked(comment.id) ? "liked" : ""
                                                    }`}
                                                    onClick={() => handleLikeComment(comment.id, comment.likes || 0)}
                                                >
                                                    <Heart
                                                        size={16}
                                                        className={`heart-icon ${
                                                            isCommentLiked(comment.id) ? "liked" : ""
                                                        }`}
                                                        fill={isCommentLiked(comment.id) ? "#ff4757" : "none"}
                                                    />
                                                    <span>{comment.likes || 0}</span>
                                                </button>
                                                <button
                                                    className="reply-button"
                                                    onClick={() => setReplyingTo(comment.id)}
                                                >
                                                    Reply
                                                </button>
                                            </div>

                                            {replyingTo === comment.id && (
                                                <Formik
                                                    initialValues={{
                                                        userName: userName,
                                                        reply: "",
                                                    }}
                                                    validationSchema={ReplySchema}
                                                    onSubmit={handleReplySubmit}
                                                >
                                                    {({ errors, touched }) => (
                                                        <Form className="reply-form">
                                                            <Avatar src={defaultAvatar} alt="User" />
                                                            <div className="comment-input-container">
                                                                <div className="form-group">
                                                                    <Field
                                                                        name="userName"
                                                                        type="text"
                                                                        placeholder="Your name"
                                                                        className={`form-control ${
                                                                            errors.userName && touched.userName
                                                                                ? "error"
                                                                                : ""
                                                                        }`}
                                                                    />
                                                                    {errors.userName && touched.userName && (
                                                                        <div className="error-message">
                                                                            {errors.userName}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="form-group">
                                                                    <Field
                                                                        name="reply"
                                                                        as="textarea"
                                                                        placeholder="Write a reply..."
                                                                        rows="2"
                                                                        className={`form-control ${
                                                                            errors.reply && touched.reply ? "error" : ""
                                                                        }`}
                                                                    />
                                                                    {errors.reply && touched.reply && (
                                                                        <div className="error-message">
                                                                            {errors.reply}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="reply-actions">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn--primary"
                                                                        disabled={loadingReplyApi}
                                                                    >
                                                                        {loadingReplyApi ? (
                                                                            <img
                                                                                src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                                                alt="Loading..."
                                                                                className="loading-spinner"
                                                                            />
                                                                        ) : (
                                                                            "Reply"
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="reply-button"
                                                                        onClick={() => setReplyingTo(null)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            )}

                                            {getCommentReplies(comment.id).length > 0 && (
                                                <div className="replies">
                                                    {getCommentReplies(comment.id).map((reply) => (
                                                        <div key={reply.id} className="reply">
                                                            <div className="comment-header">
                                                                <Avatar src={reply.avatar} alt={reply.author} />
                                                                <div className="comment-info">
                                                                    <h4>{reply.author}</h4>
                                                                    <span>
                                                                        {new Date(reply.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="comment-content">{reply.content}</p>
                                                            <div className="comment-actions">
                                                                <button
                                                                    className={`like-button ${
                                                                        isReplyLiked(reply.id) ? "liked" : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        handleLikeReply(reply.id, reply.likes || 0)
                                                                    }
                                                                >
                                                                    <Heart
                                                                        size={16}
                                                                        className={`heart-icon ${
                                                                            isReplyLiked(reply.id) ? "liked" : ""
                                                                        }`}
                                                                        fill={
                                                                            isReplyLiked(reply.id) ? "#ff4757" : "none"
                                                                        }
                                                                    />
                                                                    <span>{reply.likes || 0}</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </article>
        </>
    );
}
