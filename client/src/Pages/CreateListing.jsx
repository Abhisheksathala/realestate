import { useState } from "react";
import { app } from "./../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    parking: false,
    furnished: false,
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
          console.log(error);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({
        ...formData,
        type: id, // Set type based on the checkbox selected
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else if (type === "number" || type === "text" || type === "textarea") {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validation checks
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }
      if (+formData.regularPrice < +formData.discountedPrice) {
        return setError("Discount price must be lower than regular price");
      }

      // Reset states
      setLoading(true);
      setError(null);

      // Sending POST request
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.user._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log(data);
        navigate(`/listing/${data._id}`);
      } else {
        console.error(data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false); // Ensure loading is set to false after request completion
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded"
            id="name"
            minLength="10"
            maxLength="62"
            required
            onChange={handleFileChange}
            value={formData.name}
          />
          <textarea
            placeholder="description"
            className="border p-3 rounded"
            id="description"
            onChange={handleFileChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded"
            id="address"
            onChange={handleFileChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="checkbox flex gap-2">
              <input
                type="checkbox"
                id="sale"
                name="sale"
                checked={formData.type === "sale"}
                className="w-5 h-5"
                onChange={handleFileChange}
              />
              <span>sell</span>
            </div>
            <div className="checkbox flex gap-2">
              <input
                type="checkbox"
                id="rent"
                name="Rent"
                className="w-5 h-5"
                checked={formData.type === "rent"}
                onChange={handleFileChange}
              />
              <span>Rent</span>
            </div>
            <div className="checkbox flex gap-2">
              <input
                type="checkbox"
                id="parking"
                name="parking spot"
                className="w-5 h-5"
                checked={formData.parking}
                onChange={handleFileChange}
              />
              <span>parking spot</span>
            </div>
            <div className="checkbox flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                name="furnished"
                checked={formData.furnished}
                className="w-5 h-5"
                onChange={handleFileChange}
              />
              <span>furnished</span>
            </div>
            <div className="checkbox flex gap-2">
              <input
                type="checkbox"
                id="offer"
                name="offer"
                className="w-5 h-5"
                checked={formData.offer}
                onChange={handleFileChange}
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                required
                max="10"
                placeholder="bedrooms"
                className="border p-3 rounded"
                id="bedrooms"
                onChange={handleFileChange}
                value={formData.bedrooms}
              />
              <span>beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                required
                max="10"
                placeholder="bathrooms"
                className="border p-3 rounded"
                id="bathrooms"
                onChange={handleFileChange}
                value={formData.bathrooms}
              />
              <span>baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                required
                placeholder="regularPrice"
                className="border p-3 rounded"
                id="regularPrice"
                onChange={handleFileChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col item-center">
                <span>regularPrice</span>
                <p className="text-xs">($/month)</p>
              </div>
            </div>
            {formData.offer && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="discountedPrice"
                    className="border p-3 rounded"
                    id="discountedPrice"
                    onChange={handleFileChange}
                    value={formData.discountedPrice}
                  />
                  <div className="flex flex-col item-center">
                    <span>DiscountedPrice</span>
                    <p className="text-xs">($/month)</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              the first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(Array.from(e.target.files));
              }}
              type="file"
              id="image"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <img
                  src={url}
                  alt="uploaded"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      imageUrls: formData.imageUrls.filter(
                        (imageUrl) => imageUrl !== url
                      ),
                    });
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={uploading}
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-50 mt-5"
          >
            {loading ? "Loading..." : "Create Listing"}
          </button>
          <p className="text-red-700">{error && error}</p>
        </div>
        <p className="text-red-700">{imageUploadError && imageUploadError}</p>
      </form>
    </main>
  );
};

export default CreateListing;
