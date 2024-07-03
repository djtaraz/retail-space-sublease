import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function Lesser() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    name: "",
    description: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await axios.post("/api/auth/signup", {
        name: userDetails.name,
        description: userDetails.description,
        email: userDetails.email,
        role: "LESSER",
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
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError("User with this email already exists.");
      } else {
        console.error(error);
        setError("An error occurred during sign-up.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Lease your space
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Business Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your business' name..."
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Business Description
              </label>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Tell us about your business: include your address, nature of business and what you are looking for"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email address..."
              />
            </div>
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
