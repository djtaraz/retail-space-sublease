import React, { useState } from "react";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    description: string,
    address: string,
    fileUrl: string
  ) => void;
};

function NewPostModal({
  show,
  onClose,
  onSave,
}: ModalProps): React.ReactElement | null {
  const [postForm, setPostForm] = useState({
    title: "",
    description: "",
    address: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!show) {
    return null;
  }

  const handleSave = async () => {
    if (file) {
      setUploading(true);
      const signedResponse = await fetch("/api/s3-upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
        }),
      });

      const { url, key } = await signedResponse.json();

      const s3Response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!s3Response.ok) {
        console.error("Error uploading to S3:", s3Response.statusText);
        setUploading(false);
        return;
      }

      onSave(postForm.title, postForm.description, postForm.address, key);
      setUploading(false);
      onClose();
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create Listing
              </h3>
              <div className="mt-2">
                <input
                  type="text"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Title"
                  value={postForm.title}
                  onChange={(e) =>
                    setPostForm({ ...postForm, title: e.target.value })
                  }
                />
                <textarea
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Description"
                  value={postForm.description}
                  onChange={(e) =>
                    setPostForm({ ...postForm, description: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Address"
                  value={postForm.address}
                  onChange={(e) =>
                    setPostForm({ ...postForm, address: e.target.value })
                  }
                />
                <input
                  type="file"
                  className="mt-1 block w-full"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              onClick={handleSave}
              type="button"
              className={`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 ${
                uploading ? "bg-gray-500" : "bg-indigo-600"
              } text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm`}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostModal;
