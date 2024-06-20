import Link from "next/link";

export default function SignUpSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Account Created Successfully
        </h2>
        <p className="text-center text-gray-600">
          Your account has been created successfully. Please sign in to
          continue.
        </p>
        <div className="flex justify-center">
          <Link href="/api/auth/signin">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
