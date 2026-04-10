import axios from "axios";
import FormData from "form-data";

export const uploadImage = async (file, bloggerId) => {
        const formData = new FormData();
        formData.append("file", file);

        return await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/UVB/bloggers/images/${bloggerId}`,
        formData,
        {
            headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        },
        );
    };
export const getImageById = async (bloggerId) => {
    console.log("Fetching image with user ID:", bloggerId);
    console.log(`Bearer ${localStorage.getItem("token")}`);
    return await axios.get(`${process.env.REACT_APP_BACKEND_URL}/UVB/bloggers/profileImages/${bloggerId}`,{
        responseType: 'blob',
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
            Accept:"image/*"
        }
    });
  };