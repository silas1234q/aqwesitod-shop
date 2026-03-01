import AppError from "../errors/AppError";
import ValidationErrors from "../errors/ValidationError";
import {
  createCategoryService,
  deleteCategoryService,
  updateCategoryService,
} from "../services/category.service";
import { catchAsync } from "../utils/catchAsync";

export const createCategory = catchAsync(async (req, res) => {
  const { name, description, imageUrl } = req.body;
  const errors: any = {};
  if (!name) errors.name = "Name is required";
  if (!description) errors.description = "Description is required";
  if (!imageUrl) errors.ImageUrl = "ImageUrl is required";
  if (Object.keys(errors).length > 0) throw new ValidationErrors(errors);
  const category = createCategoryService({ name, description, imageUrl });
  if (!category)
    throw new AppError({
      message: "Failed to create category",
      statusCode: 500,
    });

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
});

export const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId || Array.isArray(categoryId))
    throw new ValidationErrors({ categoryId: "Category ID is required" });
  const category = await deleteCategoryService(categoryId);
  if (!category)
    throw new AppError({
      message: "Failed to delete category",
      statusCode: 500,
    });
  res.status(200).json({
    message: "Category deleted successfully",
  });
});

export const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description, imageUrl } = req.body;
  const errors: any = {};
    if (!categoryId || Array.isArray(categoryId))
        errors.categoryId = "Category ID is required";
    if (Object.keys(errors).length > 0) throw new ValidationErrors(errors);

    const category = await updateCategoryService(categoryId as string, { name, description, imageUrl });
    if (!category)
        throw new AppError({
            message: "Failed to update category",
            statusCode: 500,
        });

    res.status(200).json({
        message: "Category updated successfully",
        category,
    });
});