import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Retail Space Subleasing <i className="text-primary">Marketplace</i>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          RSSM - the innovative digital marketplace revolutionising retail space
          utilisation. Our platform connects retail business owners with excess
          space to startups, pop-up stores, and small businesses seeking
          flexible, short-term leases.
          <br />
          <b>Lease your space, rent space out.</b>
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/lesser"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            I want to lease my space
          </Link>
          <Link
            href="/renter"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            I want to rent out space
          </Link>
        </div>
      </div>
    </div>
  );
}
