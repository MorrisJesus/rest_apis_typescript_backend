import { Request, Response } from "express";
import Product from "../models/Product.model";

//Obtener productos
// export const getProducts = async (req: Request, res: Response) => {
// 	const products = await Product.findAll({
// 		order: [["price", "DESC"]],
// 		attributes: { exclude: ["createdAt", "updatedAt"] },
// 	});
// 	res.json({ data: products });
// };
export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    res.json({data: products})
}

export const getProductById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const product = await Product.findByPk(id);
	if (!product) {
		res.status(404).json({ error: "Producto no encontrado" });
		return;
	}
	res.json({ data: product });
};

export const createProduct = async (
	req: Request,
	res: Response
): Promise<void> => {
	const product = await Product.create(req.body);
	res.status(201).json({ data: product });
};

export const updateProduct = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const product = await Product.findByPk(id);
	if (!product) {
		res.status(404).json({ error: "Producto no encontrado" });
		return;
	}
	//Actualizar el producto
	await product.update(req.body);
	res.json({ data: product });
};

export const updateAvailability = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const product = await Product.findByPk(id);
	if (!product) {
		res.status(404).json({ error: "Producto no encontrado" });
		return;
	}
	//Actualizar el producto
	product.availability = !product.availability;
	await product.save();
	res.json({ data: product });
};

export const deleteProduct = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { id } = req.params;
	const product = await Product.findByPk(id);
	if (!product) {
		res.status(404).json({ error: "Producto no encontrado" });
		return;
	}
	//Eliminar el producto
	await product.destroy();
	res.json({ data: "Producto Eliminado" });
};
