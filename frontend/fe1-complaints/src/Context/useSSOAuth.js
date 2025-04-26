// src/hooks/useSSOAuth.js
import { useEffect, useState } from "react";

const useSSOAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://auth.vnrzone.site/check-auth", {
      method: "GET",
      credentials: "include", // Ensure cookies are sent
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.logged_in) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return { user };
};

export default useSSOAuth;
