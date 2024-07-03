import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";

type Props = {
  user: {
    id: string;
    name: string;
    description: string;
  };
  applications: {
    id: string;
    status: string;
    post: {
      id: string;
      title: string;
      description: string;
      address: string;
      photos: string[];
      createdAt: string;
      author: {
        name: string;
        email: string; // Add email field here
      };
    };
  }[];
};

export default function RenterUserPage({ user, applications }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {user.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{user.description}</p>
          </div>
        </div>
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Applications</h3>
          {applications.length > 0 ? (
            applications.map((application) => (
              <div
                key={application.id}
                className="p-4 bg-white shadow sm:rounded-lg"
              >
                <h4 className="text-lg font-semibold text-gray-900">
                  {application.post.title}
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  {application.post.description}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {application.post.address}
                </p>
                {application.post.photos.length > 0 && (
                  <Image
                    src={`https://rssm-listings.s3.eu-west-2.amazonaws.com/${application.post.photos[0]}`}
                    alt="Listing photo"
                    width={500}
                    height={500}
                  />
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Posted by: {application.post.author.name}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Status: {application.status}
                </p>
                {application.status === "APPROVED" && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Contact Email: {application.post.author.email}
                    </p>
                    <a
                      href={`mailto:${application.post.author.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      Send Email
                    </a>
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Posted on: {application.post.createdAt}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No applications available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || session.user.role !== "RENTER") {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = context.params?.renterId as string;

  if (!userId) {
    return {
      notFound: true,
    };
  }

  const user = await prisma.renterUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  const applications = await prisma.application.findMany({
    where: { applicantId: userId },
    select: {
      id: true,
      status: true,
      post: {
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
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Order by newest application
    },
  });

  // Format createdAt to a consistent string format
  const serializedApplications = applications.map((application) => ({
    ...application,
    post: {
      ...application.post,
      createdAt: format(new Date(application.post.createdAt), "MM/dd/yyyy"),
    },
  }));

  return {
    props: {
      user,
      applications: serializedApplications,
    },
  };
};
