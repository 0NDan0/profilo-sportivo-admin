/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, type ReactNode, useContext, createContext, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "@/utils/services";
import { useRouter } from "next/router";
import { RegisterInfo, User, userSkeleton } from "../utils/types";
import { useSession } from "next-auth/react";
import { Preferences } from '@capacitor/preferences';

type AuthContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    registerInfo: RegisterInfo;
    setRegisterInfo: React.Dispatch<React.SetStateAction<RegisterInfo>>;
    updateRegisterInfo: (newInfo: RegisterInfo) => void;
    registerUser: (e: { preventDefault: () => void; }, info: GoogleRegisterInfo, google: boolean) => Promise<{ error: boolean; message: string }>;
    registerError: string | null;
    isRegisterLoading: boolean;
    logoutUser: () => void;
    loginInfo: { email: string; password: string };
    setLoginInfo: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
    updateLoginInfo: (newInfo: { email: string; password: string }) => void;
    loginUser: (e: { preventDefault: () => void; }, google: boolean, info: { email: string; password: string }) => Promise<{
      verifiedCode?: string; error: boolean; message: string }>
    loginError: string | null;
    isLoginLoading: boolean;
    admin: boolean;
    setAdmin: React.Dispatch<React.SetStateAction<boolean>>;

    googleLoginInfo: string;
    setGoogleLoginInfo: React.Dispatch<React.SetStateAction<string>>;
    googleRegisterInfo: GoogleRegisterInfo;
    setGoogleRegisterInfo: React.Dispatch<React.SetStateAction<GoogleRegisterInfo>>;
};

type AuthContextProviderProps = {
    children: ReactNode;
};

type GoogleRegisterInfo = {
    name: string;
    surname: string;
    email: string;
    password: string;
    firebaseId: string;
    nationality: string;
    province: string;
    selectedDate: Date;
    residence: string;
    condition: string;
    footballFigure: string;
    verifiedCode: string;
    region: string;
    birthday: Date;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState<User>(userSkeleton);
    const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({ name: "", surname: "", email: "", password: "", footballFigure: "", verifiedCode: "" });
    const [loginInfo, setLoginInfo] = useState<{ email: string; password: string }>({ email: "", password: "" });
    const [googleLoginInfo, setGoogleLoginInfo] = useState<string>("");
    const [googleRegisterInfo, setGoogleRegisterInfo] = useState<GoogleRegisterInfo>({
        name: "",
        surname: "",
        email: "",
        password: "",
        firebaseId: "",
        nationality: "",
        province: "",
        selectedDate: new Date(),
        residence: "",
        condition: "",
        footballFigure: "",
        verifiedCode: "",
        region: "",
        birthday: new Date(),
    });
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
    const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);

    const updateRegisterInfo = useCallback((newInfo: RegisterInfo) => {
        setRegisterInfo(newInfo);
    }, [])

    const updateLoginInfo = useCallback((newInfo: { email: string; password: string }) => {
        setLoginInfo(newInfo);
    }, [])

    useEffect(() => {
        console.log("Register info updated: ", registerInfo);
    }, [registerInfo]);

    useEffect(() => {
        console.log("Login info updated: ", loginInfo);
        // setTimeout(() => {
        //     console.log("login")
        //     router.push("/home");
        //     // loginUser({ preventDefault: () => {} });
        // }, 1000);

    }, [loginInfo]);

    useEffect(() => {
        console.log("Google info: ", googleLoginInfo);
        if (googleLoginInfo != "") {
            console.log("login with google...")
            loginUser({ preventDefault: () => { } }, true, { email: googleLoginInfo, password: "" });
        }
    }, [googleLoginInfo]);

    useEffect(() => {
        setTimeout(() => {
            if (googleRegisterInfo.email && googleRegisterInfo.password) {
                console.log("Registering with Google...", googleRegisterInfo);
                const info = { ...googleRegisterInfo };
                registerUser({ preventDefault: () => { } }, info, true);
            }
        }, 400);
    }, [googleRegisterInfo]);



    useEffect(() => {
        const setUserPreferences = async () => {
            if (user.name === "") return;
            console.log("User:", user);
            await Preferences.set({
                key: 'user',
                value: JSON.stringify(user)
            });
        };
        setUserPreferences();
    }, [user]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const info = localStorage.getItem("userInfo");
            if (info) {
                const userInfo = JSON.parse(info);
                if (userInfo?.userId) {
                    try {
                        const updatedInfo = await getRequest(`${baseUrl}/usersInfo/${userInfo.userId}`);
                        //@ts-ignore
                        updatedInfo.userInfo ? localStorage.setItem("userInfo", JSON.stringify(updatedInfo.userInfo)) : null;
                        setUser(updatedInfo.userInfo);

                    } catch (error) {
                        console.error("Errore nel recupero delle informazioni utente:", error);
                    }
                }
            }
        };

        fetchUserInfo();
    }, []);



    const registerUser = useCallback(async (e: { preventDefault: () => void }, info: GoogleRegisterInfo, google: boolean) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
        console.log("Registering user...");

        let response;

        if (google) {
            response = await postRequest(`${baseUrl}/users/registerwithgoogle`, info);
        } else {
            response = await postRequest(`${baseUrl}/users/register`, info);
        }

        console.log(response);
        setIsRegisterLoading(false);

        if (response.error || !response.success) {
            console.log(response.message);
            return response
        }


        const createUserInfo: User = await postRequest(`${baseUrl}/usersInfo/set`, {
            userId: response._id,
            name: response.name,
            surname: info.surname,
            email: response.email,
            profileImage: info.password === "REGISTERED_WITH_GOOGLEa1!" ? session && session.user ? session.user.image : "" : "",
            phone: "",
            description: "",
            registeredAt: new Date(),
            visitors: 0,
            observers: [],
            lastWeekObservers: [],
            totalObservers: [],
            contact: 0,
            shares: 0,
            posts: [],
            isSearchingOpportunity: false,
            footballFigure: info.footballFigure,
            isPromisingTalent: false,
            numberId: 0,
            presentationVideo: "",
            presentationImage: "",
            verify: false,
            subscriptionExpiration: null,
            isPremium: false,
            team: "",
            condition: info.condition,
            region: info.region,
            nationality: info.nationality,
            province: info.province,
            birthday: info.selectedDate,
            residence: info.residence,
            FIGCbadge: "",
            provincesOfInterest: [],
            weight: 0,
            height: 0,
            leftFoot: "",
            rightFoot: "",
            category: "",
            hidden: false,
            lastWeekRankingPosition: 0,
            lastWeekBadges: [],
            savedProfiles: [],
            whatsappNumber: "",
            otherEmails: [],
            reportedBy: [],
        });

        console.log("User created:", createUserInfo);
        const responseLogin = await loginUser(e, false, { email: response.email, password: info.password });
        return response
        // return createUserInfo


        console.log(createUserInfo);
    }, [registerInfo]); // Dipendenze corrette


    const { data: session } = useSession();
    // const [registered , setRegistered] = useState(false);
    // useEffect(() => {
    //     console.log("STARTING REGISTER");
    //     console.log(session);
    //     if (session && session.user) {
    //         console.log(session.user);
    //         const [firstName, ...lastName] = session.user.name!.split(" ");
    //         setRegisterInfo({
    //             name: firstName,
    //             surname: lastName.join(" "),
    //             email: session.user.email!,
    //             password: "REGISTERED_WITH_GOOGLEa1!",
    //         });
    //     }
    // }, [session]);    

    // useEffect(() => {
    //     console.log("Register info updated: ", registerInfo);
    //     if (registerInfo.password == "REGISTERED_WITH_GOOGLEa1!") {
    //         console.log("register")
    //         registerUser({ preventDefault: () => { } }, false);
    //     }
    // }, [registerInfo]);

    // useEffect(() => {
    //     // Control is logged in
    // const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    //     if (userInfo.observers){
    //         setUser((prev) => ({
    //             ...prev,
    //             ...userInfo,
    //             visitors: prev.visitors,
    //           }));

    //     }
    //     console.log("User info:", userInfo);
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    //     if(router.pathname === '/login' || router.pathname == '/register'){
    //         if (user && user.email) {
    //             router.push('/test');
    //         }
    //         if (userInfo && userInfo.observers) {
    //             router.push('/test');
    //         }
    //     } else {
    //         if (!user || !user.email) {
    //             router.push('/login');
    //         }
    //         if (!userInfo) {
    //             router.push('/login');
    //         }
    //     }
    // }, [router]);

    // START

    useEffect(() => {
        const fetchUserData = async () => {
            if (user.name !== "") return;
            console.log("Fetching user data...");
            const ret = await Preferences.get({ key: 'user' });
            if (ret.value && JSON.parse(ret.value).name != "") {
                const userData = JSON.parse(ret.value);
                await setUser(userData);
                console.log("LOGGED IN")
                // if (router.pathname == "/login") {
                //     router.push("/home");
                // };
            } else {
                console.log("NOT LOGGED IN")
            };
        }
        fetchUserData()

    }, []);

    // useEffect(() => {
    //     // if (user.name != "" && (router.pathname == "/login" || router.pathname == "/register")) {
    //     //     router.push("/home");
    //     // }
    // }, [user, router.pathname])

    const loginUser = useCallback(async (e: { preventDefault: () => void }, google: boolean, info: {
        email: string;
        password: string;
    }) => {
        setIsLoginLoading(true);
        setLoginError(null);

        const loginData = google ? { email: info.email } : info;
        const endpoint = google ? `${baseUrl}/users/loginwithgoogle` : `${baseUrl}/users/login`;

        const response = await postRequest(endpoint, loginData);
        console.log(response);

        setIsLoginLoading(false);

        if (response.error) {
            // setPopUp({ show: true, message: response.message });
            // return setLoginError(response.message);
            return response
        }

        const { _id, email, token, date } = response;
        localStorage.setItem("user", JSON.stringify({ _id, email, token, date }));

        const userInfo = await getRequest(`${baseUrl}/usersInfo/${_id}`);
        console.log(userInfo);

        if (userInfo.userInfo) {
            await setUser(userInfo.userInfo);
            await Preferences.set({
                key: 'user',
                value: JSON.stringify(userInfo.userInfo)
            });
            localStorage.setItem("userInfo", JSON.stringify(userInfo.userInfo));
        }
        // if (userInfo.userInfo.team == "" || userInfo.userInfo.category == "" || userInfo.userInfo.province == "" || userInfo.userInfo.region == "") {
        //     router.push("/myprofile");
        //     console.log("aa")
        // } else {
        //     // router.push("/home");
        // }
        return response
    }, [loginInfo]);

    const logoutUser = useCallback(async () => {
        console.log("Logout");
        localStorage.removeItem("user");
        localStorage.removeItem("userInfo");
        await Preferences.remove({ key: 'user' });
        setUser(userSkeleton);
        // router.push("/login");
    }, []);

    const [popUp, setPopUp] = useState({ show: false, message: "" });

    return (
        <AuthContext.Provider value={{ user, setUser, registerInfo, setRegisterInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading, logoutUser, loginInfo, setLoginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading, admin, setAdmin, googleLoginInfo, setGoogleLoginInfo, googleRegisterInfo, setGoogleRegisterInfo }}>
            {children}
            {/* {popUp.show ?
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center" onClick={() => setPopUp({ show: false, message: "" })}>
                    <div
                        className={`fixed text-center bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white bg-red-500 w-[70%]`}
                    >
                        {popUp.message}
                    </div>
                </div>
                : null} */}
        </AuthContext.Provider>
    );
};