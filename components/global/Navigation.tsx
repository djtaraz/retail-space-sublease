import { useState, useEffect } from "react";
import { signOut, getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Roboto } from "next/font/google";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

type Props = {
  isAuthenticated?: boolean;
};

export default function Navigation({ isAuthenticated }: Props) {
  const [userRole, setUserRole] = useState<string | null | undefined>(null);
  const [userId, setUserId] = useState<string | null | undefined>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session && session.user) {
        setUserRole(session.user.role);
        setUserId(session.user.id);
      }
    };

    fetchSession();
  }, []);
  const authenticatedNavigation = [
    { name: "Marketplace", href: "/listings" },
    { name: "My Page", href: `/${userRole?.toLowerCase()}/${userId}` },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className={`absolute inset-x-0 top-0 z-50 ${roboto.className}`}>
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">RSS</span>
            <Image
              src="/rssm-high-resolution-logo-transparent.png"
              alt="logo"
              width={1000}
              height={1000}
              style={{ height: 60, width: "auto" }}
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {isAuthenticated && (
          <div className="hidden lg:flex lg:gap-x-12 lg:items-center">
            {authenticatedNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Log Out
            </button>
          </div>
        )}
        {!isAuthenticated && (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/api/auth/signin">
              <button className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Sign In
              </button>
            </Link>
          </div>
        )}
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              href={`/${userRole?.toLowerCase()}/${userId}`}
              className="-m-1.5 p-1.5"
            >
              <span className="sr-only">RSS</span>
              <Image
                src="/rssm-high-resolution-logo-transparent.png"
                alt="logo"
                width={1000}
                height={1000}
                style={{ height: 60, width: "auto" }}
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {isAuthenticated && (
                <div className="space-y-2 py-6">
                  {authenticatedNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                    className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  >
                    Log Out
                  </button>
                </div>
              )}
              {!isAuthenticated && (
                <div className="py-6">
                  <Link href="/api/auth/signin">
                    <button className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      Sign In
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
