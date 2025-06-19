import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append('image', image);

    const response = await Axios({
      ...SummaryApi.uploadImage,
      data: formData,
    });

    return response; // response = { data: {...} }
  } catch (error) {
    console.error("Image upload failed:", error);
    return { data: null, success: false, error }; // return consistent shape
  }
};

export default uploadImage;
