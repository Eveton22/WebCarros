import { ReactNode, createContext, useState, useEffect } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from "../services/firebaseConnection"

interface AuthProviderProps{
    children: ReactNode
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser: ({name, email, uid}: UserProps)=> void;
    user: UserProps | null
}

interface UserProps{
    uid: string;
    name: string | null;
    email: string | null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({children}: AuthContextData){
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingAuth, setLoadinAuth] = useState(true);

    useEffect(()=>{
        const unsub = onAuthStateChanged( auth, (user)=>{
            if(user){
                setUser({
                    uid: user.uid,
                    name: user?.displayName,
                    email: user?.email
                })

                setLoadinAuth(false)

            }else{
                setUser(null)
                setLoadinAuth(false)
            }
        })

        return ()=> {
            unsub();
        }
    },[])

    function handleInfoUser({name, email, uid}: UserProps){
        setUser({
            name,
            email,
            uid,
        })
    }

    return(
        <AuthContext.Provider value={{ signed: !!user, loadingAuth, handleInfoUser, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;