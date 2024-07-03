import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import React, { useState } from "react";
import NewPostModal from "@/components/lesser/NewPostModal";
import Image from "next/image";
import { signOut } from "next-auth/react";

type Props = {
  user: {
    id: string;
    name: string;
    description: string;
  };
  posts: {
    id: string;
    title: string;
    description: string;
    address: string;
    photos: string[];
    applications: {
      id: string;
      status: string;
      applicant: {
        name: string;
      };
    }[];
  }[];
};

export default function LesserUserPage({ user, posts }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (
    title: string,
    description: string,
    address: string,
    fileUrl: string
  ) => {
    await fetch("/api/create-listing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, title, description, address, fileUrl }),
    });
    setShowModal(false);
  };

  const handleApplicationStatus = async (
    applicationId: string,
    status: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/application/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Error updating application status");
      }

      // Optionally, you can refresh the page or update the state to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error updating application status");
    } finally {
      setLoading(false);
    }
  };

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
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Log out
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Listing
          </button>
        </div>
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Your Posts</h3>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="p-4 bg-white shadow sm:rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900">
                  {post.title}
                </h4>
                <p className="mt-2 text-sm text-gray-600">{post.description}</p>
                <p className="mt-2 text-sm text-gray-600">{post.address}</p>
                <Image
                  src={`https://rssm-listings.s3.eu-west-2.amazonaws.com/${post.photos[0]}`}
                  alt="post"
                  width={100}
                  height={100}
                />
                <div className="mt-4">
                  <h5 className="text-lg font-semibold text-gray-900">
                    Applications
                  </h5>
                  {post.applications.length > 0 ? (
                    post.applications.map((application) => (
                      <div
                        key={application.id}
                        className="mt-2 p-2 border rounded"
                      >
                        <p className="text-sm text-gray-600">
                          Applicant: {application.applicant.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {application.status}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() =>
                              handleApplicationStatus(
                                application.id,
                                "APPROVED"
                              )
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            disabled={loading}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleApplicationStatus(application.id, "DENIED")
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            disabled={loading}
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">
                      No applications available.
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No posts yet.</p>
          )}
        </div>
      </div>
      <NewPostModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || session.user.role !== "LESSER") {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = context.params?.lesserId as string;

  if (!userId) {
    return {
      notFound: true,
    };
  }

  const user = await prisma.lesserUser.findUnique({
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

  const posts = await prisma.lesserPost.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      title: true,
      description: true,
      address: true,
      photos: true,
      createdAt: true,
      applications: {
        select: {
          id: true,
          status: true,
          applicant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc", // or 'asc' for ascending order
    },
  });

  // Convert createdAt to ISO string
  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));

  return {
    props: {
      user,
      posts: serializedPosts,
    },
  };
};
