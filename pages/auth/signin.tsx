import { useState, useEffect } from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState("");

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    await signIn("email", { email });
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      const userId = session?.user?.id;
      if (role && userId) {
        if (role === "LESSER") {
          router.push(`/lesser/${userId}`);
        } else if (role === "RENTER") {
          router.push(`/renter/${userId}`);
        }
      }
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center mt-40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full rounded-lg h-10 p-2 border focus:border-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
