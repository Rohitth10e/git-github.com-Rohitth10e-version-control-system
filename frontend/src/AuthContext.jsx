import {useContext, createContext, useState, useEffect} from 'react'

const AuthContext = createContext();

export const useAuth = () =>{
    return useContext(AuthContext)
}

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(()=>{
        const userId = localStorage.getItem("userId");
        if(userId !== null){
            setCurrentUser(userId);
        }
    }, []);

    const value = {
        currentUser,
        setCurrentUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}