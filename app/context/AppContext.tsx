/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState, type ReactNode, useContext, createContext, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest, putRequest } from "@/utils/services";
import { useRouter } from "next/router";
import { useAuthContext } from "./AuthContext";
import { Collection, Post, User, userSkeleton } from "../utils/types";

type AppContextType = {
    incrementVisitors: (id: string, presentUserId: string) => Promise<void>
    incrementObservers: (id: string, presentUserId: string) => Promise<void>
    stopObservingUser: (id: string) => Promise<void>
    presentUser: User;
    setPresentUser: React.Dispatch<React.SetStateAction<User>>;
    getUserInfo: (id: string, setInfo: React.Dispatch<React.SetStateAction<User>>) => Promise<User>
    setPost: (url: string, description: string) => Promise<void>
    getUserPost: (id: string) => Promise<void>
    posts: User[];
    setPosts: React.Dispatch<React.SetStateAction<User[]>>;
    postsInfo: User[];
    setPostsInfo: React.Dispatch<React.SetStateAction<User[]>>;
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    editUser: (updatedUser: User) => Promise<void>
    getUserInfoFiltered: (idArray: string[]) => Promise<User[]>
    getPosts: (change? : boolean) => Promise<void>
    getUserInfoForObservers: (id: string) => Promise<User>
    
    // Ranking
    ranking: User[];
    setRanking: React.Dispatch<React.SetStateAction<User[]>>;
    getRanking: () => Promise<void>
    getRankingByRegion: (region: string) => Promise<void>
    getRankingByProvince: (province: string) => Promise<void>

    // Search
    searchResults: User[];
    setSearchResults: React.Dispatch<React.SetStateAction<User[]>>;
    searchUser: (query: string) => Promise<void>

    // Collections
    addCollectionWithPost: (userId: string, collection: Collection) => Promise<{ error: boolean; message: string }>
    addPostToCollection: (userId: string, collectionId: string, post: Post) => Promise<{ error: boolean; message: string }>
    updateCollection: (userId: string, collectionId: string, collection: Collection) => Promise<{ error: boolean; message: string }>
    getPostsByIds: (postIds: string[]) => Promise<void>
    deleteCollectionWithPosts: (userId: string, collectionId: string) => Promise<{ error: boolean; message: string }>

    // Date
    setDate: (date: Date) => Promise<void>
    getDate: (id: string) => Promise<Date>
};

type AppContextProviderProps = {
    children: ReactNode;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook personalizzato per utilizzare il contesto
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};

// Provider del contesto
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
    const router = useRouter();
    const { user, setUser } = useAuthContext();
    const [presentUser, setPresentUser] = useState(userSkeleton);
    const [posts, setPosts] = useState<{ userInfo: User; posts: Post[] }[]>([]);
    const [postsInfo, setPostsInfo] = useState<User[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const getUserInfo = useCallback(async (id: string, setInfo: React.Dispatch<React.SetStateAction<User>>) => {

        const userInfo = await getRequest(`${baseUrl}/usersInfo/${id}`);
        console.log(userInfo)
        if (userInfo.userInfo) {
            setInfo(userInfo.userInfo);
            setPresentUser(userInfo.userInfo);
            return userInfo.userInfo;
        }
    }, [])

    const getUserInfoForObservers = useCallback(async (id: string) => {

        const userInfo = await getRequest(`${baseUrl}/usersInfo/${id}`);
        console.log(userInfo)
        return userInfo.userInfo;
    }, [])
    
    const getUserInfoFiltered = useCallback(async (userIds: string[]) => {
        console.log(userIds)
        const usersInfo = await postRequest(`${baseUrl}/usersinfo/getusersfiltered`, { userIds });
        console.log(usersInfo)
        return usersInfo.users
    }, [])

    const setDate = useCallback(async (date: Date) => {
        const res = await postRequest(`${baseUrl}/date/set`, { date: date });
        console.log(res);
    }, [])

    const getDate = useCallback(async (id: string) => {
        const res = await getRequest(`${baseUrl}/date/get/${id}`);
        console.log(res);
        return res.date;
    }, [])

    useEffect(() => {
        console.log("Present user updated: ", presentUser);
    }, [presentUser])

    // useEffect(() => {
    //     if(user && user.name == "" && router.pathname !== "/login" && router.pathname !== "/register" && router.pathname !== "/assistance" && router.pathname !== "/changepassword" && router.pathname !== "/home"){
    //         router.push("/login");
    //     }
    // }, [router.pathname, user])

    const incrementVisitors = useCallback(async (id: string, presentUserId: string) => {
        console.log(user);

        const response = await putRequest(`${baseUrl}/usersInfo/incrementvisitors`, { userId: presentUserId, presentUserId: id });

        if (response.error) {
            console.log(response.message);
        } else {
            console.log(response);
            // if (user.userId === id) {
            //     setUser((prev) => ({ ...prev, visitors: prev.visitors + 1 }));
            // }
            if(response.success){
            setPresentUser((prev) => ({ ...prev, visitors: prev.visitors + 1 }));
            if (user.userId === presentUser.userId) {
                setUser((prev) => ({ ...prev, visitors: prev.visitors + 1 }));
            }
        }
            console.log("Incremented visitors ON CONTEXT");
        }

    }, []);

    // useEffect(() => {
    //    if((user.team ==  "" || user.category == "" || user.province == "" || user.region == "") && user.userId !== ""){
    //     router.push(`/myprofile`);
        
    //    }
    // }, [user])



    const incrementObservers = useCallback(async (id: string, presentUserId: string) => {
        console.log(user);
        const response = await putRequest(`${baseUrl}/usersInfo/incrementobservers`, { userId: presentUserId, newObserverId: id });

        if (response.error) {
            console.log(response.message);
        } else {
            console.log(response);
            if(response.success){
                setPresentUser((prev) => ({
                    ...prev,
                    observers: [...prev.observers, user.userId]
                }));
                console.log("Incremented observers ON CONTEXT");
            }
        }

    }, []);

    const stopObservingUser = useCallback(async (id: string) => {
        console.log(user);
        const response = await putRequest(`${baseUrl}/usersInfo/stopobservinguser`, { userId: id, observerId: user.userId });

        if (response.error) {
            console.log(response.message);
        } else {
            console.log(response);
            if(response.success){
            setPresentUser((prev) => ({
                ...prev,
                observers: prev.observers.filter((observer) => observer !== user.userId)
            }));
        }

            console.log("Decrement observers ON CONTEXT");
        }

    }, []);

    const editUser = useCallback(async (updatedUser: User) => {
        console.log(user);
        const response = await putRequest(`${baseUrl}/usersInfo/update`, {...updatedUser});

        if (response.error) {
            console.log(response.message);
        } else {
            if(response.success){
            console.log(response);
            setUser(response.userInfo);
            setPresentUser(response.userInfo);
            }
        }

    }, []);

    const setPost = useCallback(async (url: string, description: string) => {
        console.log(user);
        const response = await postRequest(`${baseUrl}/post/set`, { userId: user.userId, location: user.province, description: description, date: new Date(), imageUrl: url, videoUrl: url });

        if (response.error) {
            console.log(response.message);
        } else {
            if(response.success){
            console.log(response);
            }
        }
    }, []);

    const getUserPost = useCallback(async () => {
        console.log(user);
        const response = await getRequest(`${baseUrl}/post/get/679f70b3313a747e086ab5a2`);
        const response2 = await getRequest(`${baseUrl}/post/get/67a3bf6829f937fe7732b527`);
    
        if (response.error) {
            console.log(response.message);
        } else {
            console.log("aaaa", response);
    
            // Aggiungi la proprietà 'loaded' a ciascun post
            // @ts-ignore
            const updatedPosts = response.posts.concat(response2.posts).concat(response2.posts).concat(response2.posts).map((post) => ({
                ...post,
                loaded: false, // Imposta il valore iniziale di "loaded" su false
            }));
    
            // Aggiungi i post solo se la lunghezza è inferiore a 20
            if (updatedPosts.length < 20) {
                setPosts(updatedPosts);
            }
        }
    
        return response;
    }, []);

    // useEffect(() => {
    //     if(posts.length !== 0) return
    //     getPosts();
    // }, [])

    useEffect(() => {
        console.log("Posts updated: ", posts);
        console.log("Posts info updated: ", postsInfo);
    }
    , [posts, postsInfo]);
    // const getPosts = useCallback(async () => {
    //     const response = await getRequest(`${baseUrl}/usersinfo/getusersforhome/1`);
    //     console.log(response, "PRESI I POSTS");
    
    //     if (response.error) {
    //         console.log(response.message);
    //     } else {
    //         const usersInfo: User[] = [];
    //         const allPosts: Post[] = [];
        
    //         // Popoliamo usersInfo e allPosts separatamente
    //         for (const user of response.users) {
    //             const userInfo = await getRequest(`${baseUrl}/usersInfo/${user.userId}`);
    //             const gettedPosts = await getRequest(`${baseUrl}/post/get/${user.userId}`);
    //             console.log(userInfo);
    
    //             // Aggiungi l'utente a usersInfo
    //             usersInfo.push(userInfo.userInfo);
                
    //             // Aggiungi i post all'array allPosts
    //             const updatedPosts = gettedPosts.posts.map((post) => ({
    //                 ...post,
    //                 loaded: false,
    //                 userId: user.userId, // Aggiungi l'ID dell'utente per associare il post
    //             }));
    //             allPosts.push(...updatedPosts);
    //         }
    
    //         // Mescola casualmente l'array allPosts
    //         const shuffledPosts = allPosts.sort(() => Math.random() - 0.5);
    
    //         // Associa ogni post al suo `userInfo` corrispondente
    //         const postsWithUserInfo = shuffledPosts.map((post) => {
    //             const userInfo = usersInfo.find((user) => user.userId === post.userId);
    //             return {
    //                 ...post,
    //                 userInfo, // Associa il `userInfo` al post
    //             };
    //         });
    
    //         // Aggiorna lo stato con i post mescolati
    //         setPosts((prev) => [...prev, ...postsWithUserInfo]);
    
    //         console.log(postsWithUserInfo, "PRESI I POSTS 222");
    //     }
    
    //     return response;
    // }, [posts]); // Ho aggiunto 'posts' come dipendenza per assicurarmi che venga usato l'array più aggiornato
    
    const getPosts = useCallback(async (change?: boolean, preloadOnly?: boolean) => {
        if (posts.length !== 0 && !change && !preloadOnly) return;
        console.log("GET POSTS");

        const response = await getRequest(`${baseUrl}/usersinfo/getusersforhome/1`);

        console.log(response, "PRESI I POSTS");

        if (response.error) {
            console.log(response.message);
            return;
        }

        const adv1: User = {
            userId: "PROFILOSPORTIVO",
            name: "",
            surname: "",
            profileImage: "",
            email: "",
            phone: "",
            description: "",
            registeredAt: new Date(),
            visitors: 0,
            lastWeekVisitors: 0,
            totalVisitors: 0,
            observers: [],
            lastWeekObservers: [],
            totalObservers: [],
            contact: 0,
            shares: 0,
            posts: [],
            isSearchingOpportunity: false,
            footballFigure: "",
            isPromisingTalent: false,
            numberId: 0,
            presentationVideo: "/adv1.mp4",
            presentationImage: "",
            verify: false,
            subscriptionExpiration: null,
            isPremium: false,
            team: "",
            region: "",
            province: "",
            birthday: new Date(),
            residence: "",
            FIGCbadge: "",
            provincesOfInterest: "",
            weight: 0,
            height: 0,
            rightFoot: 0,
            leftFoot: 0,
            category: "",
            hidden: false,
            lastWeekRankingPosition: 0,
            lastWeekBadges: [],
            collections: [],
            nationality: "",
            condition: "",
            career: [],
            savedProfiles: [],
            whatsappNumber: "",
            otherEmails: [],
            reportedBy: [],
        };
        const adv2: User = {
            userId: "PROFILOSPORTIVO",
            name: "",
            surname: "",
            profileImage: "",
            email: "",
            phone: "",
            description: "",
            registeredAt: new Date(),
            visitors: 0,
            lastWeekVisitors: 0,
            totalVisitors: 0,
            observers: [],
            lastWeekObservers: [],
            totalObservers: [],
            contact: 0,
            shares: 0,
            posts: [],
            isSearchingOpportunity: false,
            footballFigure: "",
            isPromisingTalent: false,
            numberId: 0,
            presentationVideo: "/adv2.mp4",
            presentationImage: "",
            verify: false,
            subscriptionExpiration: null,
            isPremium: false,
            team: "",
            region: "",
            province: "",
            birthday: new Date(),
            residence: "",
            FIGCbadge: "",
            provincesOfInterest: "",
            weight: 0,
            height: 0,
            rightFoot: 0,
            leftFoot: 0,
            category: "",
            hidden: false,
            lastWeekRankingPosition: 0,
            lastWeekBadges: [],
            collections: [],
            nationality: "",
            condition: "",
            career: [],
            savedProfiles: [],
            whatsappNumber: "",
            otherEmails: [],
            reportedBy: [],
        };
        response.users.push(adv1);
        response.users.push(adv2);
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        const shuffledUsers = shuffleArray(response.users);
        setPosts(shuffledUsers.slice(0, 40));


        // Se è solo precaricamento, ritorna i post per uso futuro
        return response.users.slice(0, 40);
    }, [posts]);

    
    //   const getPosts = useCallback(async (change? : boolean) => {
    //     if(posts.length !== 0 && !change) return; // Se i post sono già stati caricati, non fare nulla
    //     if(change){
    //         await setPosts([]);
    //     }
    //     console.log("GET POSTS")
    //     const response = await getRequest(`${baseUrl}/usersinfo/getusersforhome/1`);
    //     console.log(response, "PRESI I POSTS");
    //     const users: User[] = response.users.filter((user) => !user.hidden)
    //     if (response.error) {
    //         console.log(response.message);
    //     } else {
    //         const usersInfo: User[] = [];
    //         const allPosts: Post[] = [];
    //         const presentationPosts = users.filter((user) => user.presentationVideo != "" &&  user.presentationVideo != ".")

    //         presentationPosts.map((user) => {
    //             const post = {
    //                 _id: "dasdsa",
    //                 userInfo: user,
    //                 imageUrl: user.presentationVideo,
    //                 videoUrl: user.presentationVideo,
    //                 description: "",
    //                 location: "",
    //                 date: new Date(),
    //                 loaded: false,
    //                 userId: user.userId,
    //             }
    //             allPosts.push(post)
    //         })
    //         // Popoliamo usersInfo e allPosts separatamente
    //         for (const user of users) {
    //             const userInfo = await getRequest(`${baseUrl}/usersInfo/${user.userId}`);
    //             const gettedPosts = await getRequest(`${baseUrl}/post/get/${user.userId}`);
    //             console.log(userInfo);
    
    //             // Aggiungi l'utente a usersInfo
    //             usersInfo.push(userInfo.userInfo);
                
    //             // Aggiungi i post all'array allPosts
    //             const updatedPosts = gettedPosts.posts.map((post) => ({
    //                 ...post,
    //                 loaded: false,
    //                 userId: user.userId, // Aggiungi l'ID dell'utente per associare il post
    //             }));
    //             allPosts.push(...updatedPosts);
    //         }
    
    //         // Mescola casualmente l'array allPosts
    //         const shuffledPosts = allPosts.sort(() => Math.random() - 0.5);
    
    //         // Associa ogni post al suo `userInfo` corrispondente
    //         const postsWithUserInfo = shuffledPosts.map((post) => {
    //             const userInfo = usersInfo.find((user) => user.userId === post.userId);
    //             return {
    //                 ...post,
    //                 userInfo, // Associa il `userInfo` al post
    //             };
    //         });
    //         const emptyPost = {
    //             userInfo: userSkeleton,
    //             imageUrl: "",
    //             videoUrl: "EMPTY",
    //             description: "",
    //             location: "",
    //             date: new Date(),
    //             loaded: false,
    //             userId: "",
    //         }
    //         // Aggiorna lo stato con i post mescolati
    //         setPosts((prev) => [...prev, ...postsWithUserInfo]);
    
    //         console.log(postsWithUserInfo, "PRESI I POSTS 222");
    //     }
    
    //     return response;
    // }, [posts]); // Ho aggiunto  
    
    // useEffect(() => {
    //     posts.map(async (post) => {
    //         const userInfo = await getRequest(`${baseUrl}/usersInfo/${post.userId}`);
    //         console.log(userInfo);
    //         setPostsInfo((prev) => [...prev, userInfo.userInfo]);
    //     });
    //     console.log(postsInfo);
    //     console.log(posts.map((post) => post.videoUrl));
    // }, [posts]);

    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        console.log("Posts info updated: ", postsInfo);
    }, [postsInfo]);


    // Ranking
    const [ranking, setRanking] = useState<User[]>([]);

    const getRanking = useCallback(async () => {

        const response = await getRequest(`${baseUrl}/usersInfo/getranking/all`);
        console.log(response)
        if (response.users) {
            setRanking(response.users.filter((user) => user.email != "pizzinialberto@libero.it" && user.email != "fabio.cattaneo.0507@gmail.com"));
        }
    }, [])

    const getRankingByRegion = useCallback(async (region: string) => {

        const response = await getRequest(`${baseUrl}/usersInfo/getrankingbyregion/${region}`);
        console.log(response)
        if (response.users) {
            if(response.success){
            if(response.users.length == 0){
                setRanking([userSkeleton]);
                return;
            }
            setRanking(response.users);
        }
        }
    }, [])

    const getRankingByProvince = useCallback(async (province: string) => {

        const response = await getRequest(`${baseUrl}/usersInfo/getrankingbyprovince/${province}`);
        console.log(response)
        if (response.users) {
            if(response.users.length == 0){
                setRanking([userSkeleton]);
                return;
            }
            setRanking(response.users);
        }
    }, [])

    // Search
    const [searchResults, setSearchResults] = useState<User[]>([]);

    const searchUser = useCallback(async (query: string) => {
        const response = await getRequest(`${baseUrl}/usersInfo/searchUser/${query}`);
        console.log(response)
        
        if (response.users) {
            setSearchResults(response.users.filter((user) => !user.hidden));
        }
    }, [])


    // Collections
    const addCollectionWithPost = useCallback(async (userId: string, collection: Collection) => {
        console.log(user);
        if(user.collections.filter((c) => c.name == collection.name).length > 0){
            return { error: true, message: "Esiste già una collezione con questo nome" }
        }
        if(collection.name.length < 3){
            return { error: true, message: "Il nome della collezione deve essere di almeno 3 caratteri" }
        }
        const response = await putRequest(`${baseUrl}/usersInfo/addcollectionwithpost`, { userId, collectionName: collection.name, collectionImage: collection.image });

        if (response.error) {
            console.log(response.message);
            return response
        } else {
            if(response.success){
            console.log(response);
            await setUser(response.userInfo)
            }
            return response
        }

    }, []);

    const deleteCollectionWithPosts = useCallback(async (userId: string, collectionId: string) => {
        console.log(user);
        const response = await putRequest(`${baseUrl}/usersInfo/deletecollection`, { userId, collectionId });

        if (response.error) {
            console.log(response.message);
            return response
        } else {
            if(response.success){
            console.log(response);
            await setUser(response.userInfo)
            await setPresentUser(response.userInfo);
            }
            return response
        }

    }, []);
    
    const addPostToCollection = useCallback(async (userId: string, collectionId: string, post: Post) => {
        console.log(collectionId);
        const response = await putRequest(`${baseUrl}/usersInfo/addposttocollection`, { userId, collectionId, imageUrl: post.imageUrl, videoUrl: post.videoUrl, description: post.description, location: post.location });
        if (response.error) {
            console.log(response.message);
            return response
        } else {
            if(response.success){
            console.log(response);
            await setUser(response.userInfo);   
            }     
            return response    
        }

    }, []);

    const updateCollection = useCallback(async (userId: string, collectionId: string, collection: Collection) => {
        console.log(collectionId);
        const response = await putRequest(`${baseUrl}/usersInfo/updatecollection`, { userId, collectionId, collectionName: collection.name, imageUrl: collection.image, posts: collection.posts });

        if (response.error) {
            console.log(response.message);
            return response
        } else {
            console.log(response);
            await setUser(response.userInfo);       
            await setPresentUser(response.userInfo); 
            return response    
        }

    }, []);

    const getPostsByIds = useCallback(async (postIds: string[]) => {
        const response = await postRequest(`${baseUrl}/post/getpostsbyids`, { postIds });
        if (response.error) {
            console.log(response.message);
        } else {
            console.log(response);
           return response.posts
        }

    }, []);
    
    // useEffect(() => {
    //     setDate(new Date(2025, 3, 20, 0, 0, 0, 0))
    // }, [])

    // useEffect(() => {
    //     getDate("67f0349dcffcdcdf66e5ef22")
    // }, [])

    return (
        <AppContext.Provider value={{ incrementVisitors, presentUser, setPresentUser, incrementObservers, getUserInfo, stopObservingUser, setPost, getUserPost, posts, setPosts, postsInfo, setPostsInfo, showFilters, setShowFilters, editUser, ranking, setRanking, getRanking, getRankingByRegion, getRankingByProvince, searchResults, setSearchResults, searchUser, getUserInfoFiltered, addCollectionWithPost, addPostToCollection, updateCollection, getPostsByIds, deleteCollectionWithPosts, getPosts, getUserInfoForObservers, setDate, getDate }}>
            {children}
        </AppContext.Provider>
    );
};