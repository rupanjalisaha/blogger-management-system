import { useState } from "react";
import { uploadImage } from "../services/imageService";

const ProfileImageUpload = ({ bloggerId, onUploadSuccess, username }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSameUser = username === localStorage.getItem("username");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
    }

    try {
      setLoading(true);
      const response = await uploadImage(selectedFile, bloggerId);
      console.log("Upload response:", response.data);
      if(response.status === 200){
        alert(response.data.message);
      }else if(response.status === 403){
        alert(response.data.error);
      }
      localStorage.setItem("imageId", response.data.imageId); // Store the image ID for later retrieval
      alert("Proceed to submit the form to save changes.");

      if (onUploadSuccess) {
        onUploadSuccess(response);
      }else{
        alert("Upload successful, but no callback provided to handle response.");
      }
    } catch (error) {
      console.error(error);
      if(selectedFile){
      alert("Profile image exists. Please delete the existing image to upload a new one.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={!isSameUser} />

      {preview && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={preview}
            alt="preview"
            width="350px"
            length="450px"
            style={{ borderRadius: "5%" }}
          />
        </div>
      )}

      <button
        className="btn btn-primary mt-3"
        onClick={handleUpload}
        disabled={loading || !isSameUser}
      >
        {loading ? "Uploading..." : "Update"}
      </button>
    </div>
  );
};

export default ProfileImageUpload;