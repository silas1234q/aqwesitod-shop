import type { ProductVariant } from "./productTypes";

export type CartItemsType={
    id: string;
    quantity: number;
    variant: ProductVariant
}