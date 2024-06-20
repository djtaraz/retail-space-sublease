import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import Navigation from "./Navigation";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  if (session) {
    return (
      <>
        <Navigation isAuthenticated />
        <main>{children}</main>
      </>
    );
  } else {
    return (
      <>
        <Navigation />
        <main>{children}</main>
      </>
    );
  }
}
