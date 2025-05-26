import React, { type ReactNode, useContext, createContext, useState } from "react";
import { baseUrl, getRequest } from "@/utils/services";
import { Post } from "../utils/types";

type AdminContextType = {
    deletePost: (postId: string) => Promise<void>;
    getReportedPosts: () => Promise<void>;
    reportedPosts: Post[];
    setReportedPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

type AdminContextProviderProps = {
    children: ReactNode;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdminContext must be used within an AdminContextProvider");
    }
    return context;
};

export const AdminContextProvider: React.FC<AdminContextProviderProps> = ({ children }) => {
    const [reportedPosts, setReportedPosts] = useState<Post[]>([]);

    const deletePost = async (postId: string) => {
        try {
            const response = await fetch(`${baseUrl}/post/delete/${postId}`, {
                method: "DELETE",
            });
    
            const data = await response.json();
            if (data.success) {
                console.log("Post eliminato con successo");
                alert("Post eliminato con successo");
                const updatedPosts = reportedPosts.filter((post) => post._id !== postId);
                setReportedPosts(updatedPosts);
            } else {
                console.log("Errore nell'eliminazione:", data.message);
            }
        } catch (error) {
            console.error("Errore nella richiesta DELETE:", error);
        }
    };

    const getReportedPosts = async () => {
        try {
            const response = await getRequest(`${baseUrl}/post/reported`);
            const data = await response
            
    
            if (data.success) {
                console.log("Post segnalati:", data.posts);
                setReportedPosts(data.posts);
            } else {
                console.log("Nessun post segnalato trovato.");
            }
        } catch (error) {
            console.error("Errore nella richiesta GET:", error);
        }
    };
    
    
    return (
        <AdminContext.Provider value={{ deletePost, getReportedPosts, reportedPosts, setReportedPosts }}>
            {children}
        </AdminContext.Provider>
    );
};