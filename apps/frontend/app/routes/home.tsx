import { useAuth } from "~/context/auth-provider";
import { useEffect, useState } from "react";

import { usersSchema } from "@zod-schemas";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const auth = useAuth();
  const [userDetails, setUserDetails] = useState<{
    id: string;
    email: string;
    name: string;
    image: string | null | undefined;
  } | null>(null);

  useEffect(() => {
    auth.getSession().then((session) => {
      if (session.data?.user) {
        setUserDetails({
          id: session.data.user.id,
          email: session.data.user.email,
          name: session.data.user.name,
          image: session.data.user.image,
        });
      }
    });
  }, [auth]);

  const onSignInClick = () => {
    auth.signIn.email({ email: "test@test.com", password: "helloworld@123" });
  };

  const onSignUpClick = () => {
    auth.signUp.email({
      email: "test@test.com",
      password: "helloworld@123",
      name: "Test User",
    });
  };

  const onSignOutClick = () => {
    auth.signOut();
  };

  return (
    <div>
      <h1>Home</h1>

      {userDetails && (
        <div>
          <h2>User Details</h2>
          <p>ID: {userDetails.id}</p>
          <p>Email: {userDetails.email}</p>
          <p>Name: {userDetails.name}</p>
          <p>Image: {userDetails.image}</p>
        </div>
      )}

      <button
        onClick={onSignInClick}
        type="button"
        className="bg-blue-500 p-2 text-white m-5"
      >
        Sign In
      </button>
      <button
        onClick={onSignUpClick}
        type="button"
        className="bg-blue-500 p-2 text-white m-5"
      >
        Sign Up
      </button>
      <button
        onClick={onSignOutClick}
        type="button"
        className="bg-blue-500 p-2 text-white m-5"
      >
        Sign Out
      </button>
    </div>
  );
}
