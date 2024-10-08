// import React from 'react'

import { useSelector } from "react-redux";
import { useRef } from "react";
import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../../firebase";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
} from "../redux/User/UserSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();

  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  console.log(userListings);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `/api/updateuser/update/${currentUser.user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update the user profile.");
      }

      const updatedUser = await res.json();
      dispatch(updateUserSuccess(updatedUser));
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error));
    }
  };

  const HandleClick = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `/api/updateuser/Listings/${currentUser.user._id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user listings");
      }

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setShowListingsError(true);
        throw new Error("No listings found");
      }

      setUserListings(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold text-center">Profile</h1>
      <form action="" onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.user?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span>error image uploading</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">image uploaded</span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="username"
          value={formData.name || currentUser.user?.name}
          id="name"
          onChange={handelChange}
          className="border p-3 rounded-lg mt-3"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          value={formData.email || currentUser.user?.email}
          className="border p-3 rounded-lg mt-3"
          onChange={handelChange}
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          onChange={handelChange}
          value={formData.password || currentUser.user?.password}
          className="border p-3 rounded-lg mt-2"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 mt-3">
          Update
        </button>
        {/* \end{code} */}
        <Link
          className="bg-green-500 text-white rounded-lg uppercase text-center p-3 mt-3 hover:opacity-85"
          to={"/create-listing"}
        >
          create-listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      {/* showlisting */}

      <button onClick={HandleClick} className="text-green-700 w-full">
        show list
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => {
                    handleListingDelete(listing._id);
                  }}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// }

export default Profile;
