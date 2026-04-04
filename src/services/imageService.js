import axios from "axios";
import FormData from "form-data";

export const uploadImage = async (file, bloggerId) => {
        const formData = new FormData();
        formData.append("file", file);

        return await axios.post(
        `http://localhost:8080/UVB/bloggers/images/${bloggerId}`,
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
    return await axios.get(`http://localhost:8080/UVB/bloggers/profileImages/${bloggerId}`,{
        responseType: 'blob',
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
            Accept:"image/*"
        }
    });
  };