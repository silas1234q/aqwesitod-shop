import { prisma } from "../config/prisma";
import ConflictError from "../errors/ConflictError";
import NotFoundError from "../errors/NotFoundError";

export const createCategoryService = async ({
  name,
  description,
  imageUrl,
}: {
  name: string;
  description: string;
  imageUrl: string;
}) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) throw new ConflictError("Category with this name already exists");

  const category = await prisma.category.create({
    data: {
      name,
      description,
      image: imageUrl,
    },
  });
  return category;
};

export const deleteCategoryService = async (categoryId: string) => {
    const category = await prisma.category.delete({
        where: {id: categoryId}
    });
    return category;
}

export const updateCategoryService = async (categoryId: string, {
    name,
    description,
    imageUrl,
}: {
    name: string;
    description: string;
    imageUrl: string;
}) => {
    const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!existingCategory) throw new NotFoundError("Category");

    const category = await prisma.category.update({
        where: {id: categoryId},
        data: { 
            name,
            description,
            image: imageUrl,
        }
    });
 
    return category;
}