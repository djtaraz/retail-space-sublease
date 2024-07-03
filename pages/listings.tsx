import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../lib/prisma";
import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";

type Listing = {
  id: string;
  title: string;
  description: string;
  address: string;
  photos: string[];
  createdAt: string;
  author: {
    name: string;
  };
};

type Props = {
  listings: Listing[];
  session: any;
};

export default function Listings({ listings, session }: Props) {
  const [applying, setApplying] = useState<string | null>(null);

  const applyForListing = async (postId: string) => {
    setApplying(postId);
    try {
      const userId = session.user.id;
      const response = await fetch("/api/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      });

      if (!response.ok) {
        throw new Error("Error applying for listing");
      }

      alert("Application submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Error applying for listing");
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Listings</h2>
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="p-4 bg-white shadow sm:rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900">
                {listing.title}
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {listing.description}
              </p>
              <p className="mt-2 text-sm text-gray-600">{listing.address}</p>
              {listing.photos.length > 0 && (
                <Image
                  src={`https://rssm-listings.s3.eu-west-2.amazonaws.com/${listing.photos[0]}`}
                  alt="Listing photo"
                  width={500}
                  height={500}
                />
              )}
              <p className="mt-2 text-sm text-gray-600">
                Posted by: {listing.author.name}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Posted on: {format(new Date(listing.createdAt), "MM/dd/yyyy")}
              </p>
              {session?.user.role === "RENTER" && (
                <button
                  onClick={() => applyForListing(listing.id)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  disabled={applying === listing.id}
                >
                  {applying === listing.id ? "Applying..." : "Apply"}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No listings available.</p>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const listings = await prisma.lesserPost.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      address: true,
      photos: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Order by newest post
    },
  });

  // Convert createdAt to ISO string
  const serializedListings = listings.map((listing) => ({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
  }));

  return {
    props: {
      listings: serializedListings,
      session,
    },
  };
};
