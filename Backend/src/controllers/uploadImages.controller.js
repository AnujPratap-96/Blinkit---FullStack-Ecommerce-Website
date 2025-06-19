import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const uploadImagesController = async (req, res) => {
    try{
      const file = req.file;
      if(!file) {
        return res
        .status(400)
        .json({ message: "No file uploaded", error: true, success: false });
      }
      const uploadImage =await  uploadImageCloudinary(file);
        if(!uploadImage) {
            return res
            .status(500)
            .json({ message: "Error uploading image", error: true, success: false });
        }

        return res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: uploadImage,
            error: false,
            success: true
        });
    }
    catch (error) {
        return res
        .status(500)
        .json({ message: error.message || error, error: true, success: false });
    }
}

export default uploadImagesController;


