import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CheckEmail = () => {
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
          Check your email
        </h2>
        <div className="mt-8 space-y-6">
          <p className="text-center text-sm text-gray-600">
            A sign-in link has been sent to you. Please check your email to
            continue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
