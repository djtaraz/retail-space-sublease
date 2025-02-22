import { useSession } from "next-auth/react";
import { Roboto } from "next/font/google";
import Navigation from "./Navigation";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { data: session } = useSession();

  return (
    <>
      <Navigation isAuthenticated={!!session} />
      <main className={roboto.className}>
        <div className="bg-white">
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div
              className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
              aria-hidden="true"
              style={{ height: "100vh", width: "100vw" }}
            >
              <div
                className="relative left-1/2 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            {children}
            <div
              className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
              aria-hidden="true"
              style={{ height: "100vh", width: "100vw" }}
            >
              <div
                className="relative left-1/2 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
