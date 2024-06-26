import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPostsByUserId, fetchThreadsByUserId } from "../services/apiFacade";


const Container = styled.div`
    display: flex;
    height: 95vh;
    `;

    const PersonalInformation = styled.div`
    background-color: var(--basewhite);
    margin-top: 9%;
    margin-left: auto;
    margin-right: auto;
    overflow-y: hidden;
    padding: 2%;
    border-radius: 5px;
    width: 90%;
    text-align: center;
    color: var(--grey);
    @media (max-width: 900px) {
        margin-top: 15%;
    }
    @media (max-width: 600px) {
        margin-top: 20%;
    }
    @media (max-width: 400px) {
        margin-top: 30%;
    }

    input {
        background-color: var(--green);
        color: var(--basewhite);
        padding: 1.5%;
        border-radius: 5px;
        margin: 1% 0;
        width: 100%;
        text-align: center;
        border: none;
    }
    `;

    const PostUnderYourName = styled.div`
    background-color: var(--basewhite);
    border-radius: 5px;
    padding: 1%;
        div {
            background-color: var(--green);
            color: var(--basewhite);
            border-radius: 5px;
            padding: 1%;
            margin: 1% 0;
            cursor: pointer;
        }
    `;

    const ThreadsUnderYourName = styled.div`
    background-color: var(--basewhite);
    border-radius: 5px;
    padding: 1%;
        div {
            background-color: var(--green);
            color: var(--basewhite);
            border-radius: 5px;
            padding: 1%;
            margin: 1% 0;
            cursor: pointer;
        }
    `;

    const Threads = styled.div`
    overflow-y: auto;
    max-height: 40%;
    `;


export const SpecificUser = () => {
    const params = useParams();
    const [threads, setThreads] = useState([]);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [filteredThreads, setFilteredThreads] = useState([]);
    const [filteredposts, setFilteredPosts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const threads = await fetchThreadsByUserId(params.id);
                const posts = await fetchPostsByUserId(params.id);
                setThreads(threads);
                setPosts(posts);
                setFilteredPosts(posts);
                setFilteredThreads(threads);
            } catch (error) {
                console.error('fetching data error', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        filterPosts(search);
        filterThreads(search);
        
    }, [search]);


    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    function filterPosts(search) {
        console.log("posts");
        if (search === '') {
            setFilteredPosts(posts);
            return;
        }
        const filteredPosts = posts.filter((post) => {
            return post.content && post.content.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredPosts(filteredPosts);
    }

    function filterThreads(search) {
        if (search === '') {
            setFilteredThreads(threads);
            return;
        }
        const filteredThreads = threads.filter((thread) => {
            return thread.title && thread.title.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredThreads(filteredThreads);
    }


return (
    <Container>
            <PersonalInformation>
                <h1>Account Page of {params.id}</h1>
                <p>Here you can see his/hers threads and posts</p>
                <input type="seach" placeholder="Filter threads and posts" onChange={handleSearch}/>
                <Threads>
                <ThreadsUnderYourName>
                <p>Threads under username {params.id} :</p>
                    {filteredThreads && filteredThreads.map((thread) => (
                        <div key={thread.id} onClick={() => {navigate(`/thread/${thread.id}`);}}>
                            <h1>{thread.title}</h1>
                            <p>{thread.content}</p>
                        </div>
                    ))}
                </ThreadsUnderYourName>
                </Threads>
                <Threads>
                <p>Posts under username {params.id} : </p>
                <PostUnderYourName>
                    {filteredposts && filteredposts.map((post) => (
                    <div key={post.id} onClick={() => {navigate(`/thread/${post.threadId}`);}}>
                        <p>{post.content}</p>    
                    </div>
                    ))}
                </PostUnderYourName>
                </Threads>
                
            </PersonalInformation>
    </Container>
);


}