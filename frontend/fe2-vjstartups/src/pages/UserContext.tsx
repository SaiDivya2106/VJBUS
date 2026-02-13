import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

//
// USER TYPE
//
interface User {
  id?: string;
  name: string;
  email: string;
  picture: string;
}

//
// CONTEXT TYPE
//
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

//
// CREATE CONTEXT
//
const UserContext = createContext<UserContextType | undefined>(undefined);

//
// PROVIDER
//
export const UserProvider = ({ children }: { children: ReactNode }) => {
  //
  // INITIAL STATE FROM LOCALSTORAGE (SYNC)
  //
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  //
  // CHECK AUTH WITH BACKEND ON APP LOAD
  //
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(import.meta.env.VITE_AUTH_URL, "Check Auth Response:");

        const res = await fetch(
          `${import.meta.env.VITE_AUTH_URL}/check-auth`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const userDetails = await res.json();
        const user : User = userDetails.logged_in && userDetails.user ? userDetails.user : null;
        console.log("Authenticated User:", userDetails);

        setUser(user);
        // localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.log("User not authenticated");

        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  //
  // UPDATE LOCALSTORAGE WHEN USER CHANGES
  //
  useEffect(() => {
    if (user) {
      // localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  //
  // PROVIDER VALUE
  //
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

//
// CUSTOM HOOK
//
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};
