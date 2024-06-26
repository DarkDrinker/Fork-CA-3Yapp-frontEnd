import styled from "styled-components";
import { useEffect, useState } from "react";
import {
    formatDate,
    postSubmit,
    replySubmit,
    editPost,
    editReply,
    deleteReply,
    deletePost
} from "../services/apiFacade";
import PostItem from "./PostItem";
import NewPostForm from "./NewPostForm";
import { useNavigate } from "react-router-dom";

// Styled components
const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: 20px; /* Optional: add padding to the top */
    padding-bottom: 80px; /* Make space for the fixed form at the bottom */
`;

const PostContainer = styled.div`
    background: var(--basewhite);
    min-height: 20vh;
    padding: 16px;
    margin: 16px;
    width: 33%;
    box-sizing: border-box;
    position: relative;
    border-left: 1rem solid var(--green);
    border-right: 1rem solid var(--green);
    border-bottom: 1rem solid var(--green);
    border-top: 2.5rem solid var(--green); /* Larger top border */
`;

const ReplyContainer = styled.div`
    background: var(--baseWhite);
    min-height: 10vh;
    padding: 12px;
    margin: 8px 16px;
    width: 90%;
    box-sizing: border-box;
    position: relative;
    margin-left: 20px;
    border: 2px var(--green) solid
`;

const DateContainer = styled.p`
    position: absolute;
    top: 8px;
    right: 16px;
    margin: 0;
    font-size: 0.9em;
    color: var(--green);
`;

const TextWithColorWhite = styled.p`
    color: white;
    //position: absolute;
  /*  top: 8px; !* Adjust to be inside the padding and border *!
    left: 8px; !* Adjust to be inside the padding and border *!
    margin: 0; !* Optional: Remove default margin *!*/
    `;

const TextWithColorBlack = styled.p`
    color: black;
    //position: absolute;
  /*  top: 8px; !* Adjust to be inside the padding and border *!
    left: 8px; !* Adjust to be inside the padding and border *!
    margin: 0; !* Optional: Remove default margin *!*/
    `;

const ReplyButton = styled.button`
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
`;

const ToggleRepliesLink = styled.p`
    cursor: pointer;
    color: blue;
    text-decoration: underline;
`;

const FormContainer = styled.div`
    background: var(--green);
    padding: 16px;
    margin: 16px;
    width: 90%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    color: var(--baseWhite);
    @media (max-width: 460px) , (max-height: 533px) {
        width: 100%;
    }
    @media (max-width: 460px) , (max-height: 533px) {
        width: 100%;
    }
    
`;

const TextArea = styled.textarea`
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
    height: 50px; /* Larger default height for post text area */
    box-sizing: border-box;
    resize: none;
`;

const ReplyTextArea = styled.textarea`
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
    height: 50px; /* Larger default height for reply text area */
    box-sizing: border-box;
    resize: none;
`;

const SubmitButton = styled.button`
    padding: 8px 16px;
    cursor: pointer;
`;

const BottomFormContainer = styled(FormContainer)`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 800px;
    background: white; /* Ensure it's visible */
    z-index: 1000; /* Ensure it's above other content */
    margin: 0; /* Remove margin to fit at the bottom */
    border-top: 1px solid #ccc; /* Optional: add a top border for separation */
`;


export default function Post({ posts ,setPosts, threadId, loggedInUser }) {

    // const [posts, setPosts] = useState([]);
    const [currentThreadId, setCurrentThreadId] = useState(null); // threadId is passed as a prop from the parent component [Thread.jsx
    const [loggedInUserData, setLoggedInUserData] = useState(null);
    const [visibleReplies, setVisibleReplies] = useState({});
    const [newPostContent, setNewPostContent] = useState('');
    const [newReplyContent, setNewReplyContent] = useState('');
    const [replyingToPostId, setReplyingToPostId] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUserData(loggedInUser);
        setCurrentThreadId(threadId);
        console.log("threadId: " + threadId + " from post.jsx");
    }, [threadId, loggedInUser]);

    const toggleReplies = (postId) => {
        setVisibleReplies((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleReplyClick = (postId) => {
        setReplyingToPostId(postId);
    };

    const handleEditPostClick = (postId, content) => {
        console.log('handleEditPostClick called with:', postId, content);
        setEditingPostId(postId);
        setEditContent(content);
        setEditingReplyId(null);
    };

    function handleEditReplyClick(replyId, content) {
        setEditingReplyId(replyId);
        setEditContent(content);
        setEditingPostId(null);
    }

    const handleNewPostSubmit = async (event) => {
        event.preventDefault();
        if (newPostContent.trim()) {
            const data = await postSubmit(newPostContent, loggedInUserData.username, currentThreadId);
            console.log(data);
            setPosts((prev) => [...prev, data]);
            setNewPostContent('');
        }
    };

    const handleNewReplySubmit = async (newReplyContent, replyingToPostId) => {
        if (newReplyContent.trim() && replyingToPostId !== null) {
            const data = await replySubmit(newReplyContent, replyingToPostId, loggedInUserData.username);
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === replyingToPostId
                        ? { ...post, replies: [...post.replies, data] }
                        : post
                )
            );
            console.log(data + " from post.jsx");
            setNewReplyContent('');
            setReplyingToPostId(null);
        }
    };

    const handleEditPostSubmit = async (e) => {
        e.preventDefault();
        if (editContent.trim() && editingPostId !== null) {
            const data = await editPost(editContent, editingPostId);
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === editingPostId
                        ? { ...post, content: data.content }
                        : post
                )
            );
            setEditContent('');
            setEditingPostId(null);
        }
    };

    const handleEditReplySubmit = async (e) => {
        e.preventDefault();
        if (editContent.trim() && editingReplyId !== null) {
            const data = await editReply(editContent, editingReplyId);
            setPosts((prev) => {
                return prev.map((post) => {
                    return {
                        ...post,
                        replies: post.replies.map((reply) => {
                            return reply.id === editingReplyId ? { ...reply, content: data.content } : reply;
                        })
                    };
                });
            });
            setEditContent('');
            setEditingReplyId(null);
        }
    };

    function handleDeleteReplyClick(id) {
        handleDeleteReply(id);
    }

    const handleDeleteReply = async (id) => {
        const data = await deleteReply(id);
        if (data) {
            setPosts((prev) => {
                return prev.map((post) => {
                    return {
                        ...post,
                        replies: post.replies.filter((reply) => reply.id !== id)
                    };
                });
            });
        }
    };

    function handleDeletePostClick(id) {
        handleDeletePost(id);
    }

    const handleDeletePost = async (id) => {
        const data = await deletePost(id);
        if (data) {
            setPosts((prev) => prev.filter((post) => post.id !== id));
        }
    };

    function handleClickToUser(username) {
        navigate(`/user/${username}`);
    }


    return (
        <MainContainer>
            {posts && posts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    loggedInUserData={loggedInUserData}
                    toggleReplies={toggleReplies}
                    handleReplyClick={handleReplyClick}
                    handleEditPostClick={handleEditPostClick}
                    handleDeletePostClick={handleDeletePostClick}
                    replyingToPostId={replyingToPostId}
                    newReplyContent={newReplyContent}
                    setNewReplyContent={setNewReplyContent}
                    handleNewReplySubmit={handleNewReplySubmit}
                    visibleReplies={visibleReplies}
                    handleEditReplyClick={handleEditReplyClick}
                    handleDeleteReplyClick={handleDeleteReplyClick}
                    editingReplyId={editingReplyId}
                    editingPostId={editingPostId}
                    setEditContent={setEditContent}
                    editContent={editContent}
                    handleEditPostSubmit={handleEditPostSubmit}
                    handleEditReplySubmit={handleEditReplySubmit}
                    handleClickToUser={handleClickToUser}
                />
            ))}
            {loggedInUserData && (
                <NewPostForm
                    newPostContent={newPostContent}
                    setNewPostContent={setNewPostContent}
                    handleNewPostSubmit={handleNewPostSubmit}
                />
            )}
        </MainContainer>
    );
}
