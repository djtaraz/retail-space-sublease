import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Lesser() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    name: "",
    description: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userDetails.name,
        description: userDetails.description,
        email: userDetails.email,
        role: "LESSER",
      }),
    });
    if (response.status === 201) {
      await signIn("email", {
        email: userDetails.email,
        callbackUrl: `${
          process.env.NEXT_PUBLIC_NEXTAUTH_URL
        }/auth/check-email?email=${encodeURIComponent(userDetails.email)}`,
      });
      router.push(
        `/auth/check-email?email=${encodeURIComponent(userDetails.email)}`
      );
    } else {
      if (response.status === 409) {
        setError("A user with this email adress already exists");
      } else {
        setError("an error has occured");
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Lease your space
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="name">Business Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              placeholder="Enter your business' name..."
              className="w-full rounded-lg h-10 p-2 border focus:border-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="description">Business Description</label>
            <textarea
              id="description"
              name="description"
              required
              value={userDetails.description}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  description: e.target.value,
                })
              }
              placeholder="Tell us about your business: include your address, nature of business and what you are looking for"
              className="w-full rounded-lg h-40 p-2 border focus:border-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              placeholder="Enter your email address..."
              className="w-full rounded-lg h-10 p-2 border focus:border-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
