import CategoryModel from "../models/category.model.js";

export const addCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        message: "Please provide all the required fields",
        success: false,
        error: true,
      });
    }

    const addCategory =  new CategoryModel({
      name,
      image,
    });
    await addCategory.save();
     
    if(!addCategory) {
      return res.status(500).json({
        message: "Failed to add category",
        success: false,
        error: true,
      });
    }

    return res.status(201).json({
      message: "Category added successfully",
      success: true,
      error: false,
      data: addCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};



export const getCategoryController = async(req,res)=>{
    try {
        
        const data = await CategoryModel.find().sort({ createdAt : -1 })

        return res.json({
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.messsage || error,
            error : true,
            success : false
        })
    }
}

export const updateCategoryController = async(req,res)=>{
    try {
        const { _id ,name, image } = req.body 

        const update = await CategoryModel.updateOne({
            _id : _id
        },{
           name, 
           image 
        })

        return res.json({
            message : "Updated Category",
            success : true,
            error : false,
            data : update
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCategoryController = async(req,res)=>{
    try {
        const { _id } = req.body 

        const checkSubCategory = await SubCategoryModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        const checkProduct = await ProductModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        if(checkSubCategory >  0 || checkProduct > 0 ){
            return res.status(400).json({
                message : "Category is already use can't delete",
                error : true,
                success : false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id : _id})

        return res.json({
            message : "Delete category successfully",
            data : deleteCategory,
            error : false,
            success : true
        })

    } catch (error) {
       return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
       }) 
    }
}