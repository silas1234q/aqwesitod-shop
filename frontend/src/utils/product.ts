import product1 from "../assets/product (1).jpg";
import product2 from "../assets/product (2).jpg";
import product3 from "../assets/product (3).jpg";
import product4 from "../assets/product (4).jpg";
import product5 from "../assets/product (5).jpg";
import product6 from "../assets/product (6).jpg";
import product7 from "../assets/product (7).jpg";
import product8 from "../assets/product (8).jpg";
import product9 from "../assets/product (9).jpg";
export const products = [
  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    image: product1,
    description: "This is a great product that you will love!",
    discountedPrice: 19.99,
    details: [
      "Made from 100% organic cotton for a soft and comfortable feel.",
      "Features a classic fit with a crew neckline and short sleeves.",
      "Available in a variety of colors to suit your style.",
    ],
    fabric: "100% Organic Cotton",
    care: [
      "Machine wash cold with like colors.",
      "Tumble dry low or hang to dry for best results.",
      "Do not bleach or iron directly on the print.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#808080" },
    ],
    images: [
      { id: 1, url: product1, alt: "Product 1 Front View" },
      { id: 2, url: product2, alt: "Product 1 Side View" },
      { id: 3, url: product3, alt: "Product 1 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 2,
    name: "Product 2",
    price: 39.99,
    image: product2,
    description: "This is a great product that you will love!",
    discountedPrice: 29.99,
    details: [
      "Crafted from premium materials for durability and style.",
      "Features a modern fit with a V-neckline and short sleeves.",
      "Available in multiple colors to match your wardrobe.",
    ],
    fabric: "80% Cotton, 20% Polyester",
    care: [
      "Machine wash warm with like colors.",
      "Tumble dry medium or hang to dry for best results.",
      "Do not bleach or iron directly on the print.",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy", hex: "#000080" },
      { name: "Maroon", hex: "#800000" },
      { name: "Olive", hex: "#808000" },  
    ],
    images: [
      { id: 1, url: product2, alt: "Product 2 Front View" },
      { id: 2, url: product3, alt: "Product 2 Side View" },
      { id: 3, url: product4, alt: "Product 2 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 3,
    name: "Product 3",
    price: 49.99,
    image: product3,
    description: "This is a great product that you will love!",
    discountedPrice: 39.99,
    details: [
      "Made from a blend of cotton and spandex for a comfortable stretch.",
      "Features a slim fit with a scoop neckline and short sleeves.",
      "Perfect for active lifestyles and everyday wear.",
    ],
    fabric: "85% Cotton, 15% Spandex",
    care: [
      "Machine wash cold with like colors.",
      "Tumble dry low or hang to dry.",
      "Do not bleach or iron.",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Red", hex: "#FF0000" },
      { name: "Blue", hex: "#0000FF" },
      { name: "Green", hex: "#008000" },
    ],
    images: [
      { id: 1, url: product3, alt: "Product 3 Front View" },
      { id: 2, url: product4, alt: "Product 3 Side View" },
      { id: 3, url: product5, alt: "Product 3 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 4,
    name: "Product 4",
    price: 59.99,
    image: product4,
    description: "This is a great product that you will love!",
    discountedPrice: 49.99,
    details: [
      "Premium quality with exceptional durability.",
      "Modern design with comfortable fit.",
      "Available in multiple colors.",
    ],
    fabric: "100% Cotton",
    care: [
      "Machine wash cold with like colors.",
      "Tumble dry low.",
      "Do not bleach.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
    ],
    images: [
      { id: 1, url: product4, alt: "Product 4 Front View" },
      { id: 2, url: product5, alt: "Product 4 Side View" },
      { id: 3, url: product6, alt: "Product 4 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 5,
    name: "Product 5",
    price: 69.99,
    image: product5,
    description: "This is a great product that you will love!",
    discountedPrice: 59.99,
    details: [
      "High-quality craftsmanship.",
      "Stylish and versatile design.",
      "Comfortable for all-day wear.",
    ],
    fabric: "100% Organic Cotton",
    care: [
      "Machine wash cold.",
      "Tumble dry low.",
      "Iron on low heat if needed.",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#36454F" },
      { name: "Cream", hex: "#FFFDD0" },
    ],
    images: [
      { id: 1, url: product5, alt: "Product 5 Front View" },
      { id: 2, url: product6, alt: "Product 5 Side View" },
      { id: 3, url: product7, alt: "Product 5 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 6,
    name: "Product 6",
    price: 79.99,
    image: product6,
    description: "This is a great product that you will love!",
    discountedPrice: 69.99,
    details: [
      "Premium materials for superior comfort.",
      "Contemporary style.",
      "Great for layering.",
    ],
    fabric: "90% Cotton, 10% Polyester",
    care: [
      "Machine wash warm.",
      "Tumble dry medium.",
      "Do not bleach.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Slate", hex: "#708090" },
      { name: "Sand", hex: "#C2B280" },
    ],
    images: [
      { id: 1, url: product6, alt: "Product 6 Front View" },
      { id: 2, url: product7, alt: "Product 6 Side View" },
      { id: 3, url: product8, alt: "Product 6 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 7,
    name: "Product 7",
    price: 89.99,
    image: product7,
    description: "This is a great product that you will love!",
    discountedPrice: 79.99,
    details: [
      "Exceptional quality and comfort.",
      "Modern minimalist design.",
      "Perfect for any occasion.",
    ],
    fabric: "100% Premium Cotton",
    care: [
      "Machine wash cold.",
      "Tumble dry low.",
      "Do not bleach or iron.",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Midnight", hex: "#191970" },
      { name: "Pearl", hex: "#FDEEF4" },
    ],
    images: [
      { id: 1, url: product7, alt: "Product 7 Front View" },
      { id: 2, url: product8, alt: "Product 7 Side View" },
      { id: 3, url: product9, alt: "Product 7 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 8,
    name: "Product 8",
    price: 99.99,
    image: product8,
    description: "This is a great product that you will love!",
    discountedPrice: 89.99,
    details: [
      "Luxury craftsmanship.",
      "Sophisticated design.",
      "Ultra-comfortable fit.",
    ],
    fabric: "100% Organic Cotton",
    care: [
      "Machine wash cold with similar colors.",
      "Tumble dry low.",
      "Do not bleach.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Ebony", hex: "#555555" },
      { name: "Ivory", hex: "#FFFFF0" },
    ],
    images: [
      { id: 1, url: product8, alt: "Product 8 Front View" },
      { id: 2, url: product9, alt: "Product 8 Side View" },
      { id: 3, url: product1, alt: "Product 8 Detail View" },
    ],
    inStock: true,
  },
  {
    id: 9,
    name: "Product 9",
    price: 109.99,
    image: product9,
    description: "This is a great product that you will love!",
    discountedPrice: 99.99,
    details: [
      "Top-tier quality and design.",
      "Premium comfort features.",
      "Perfect statement piece.",
    ],
    fabric: "100% Premium Organic Cotton",
    care: [
      "Machine wash cold.",
      "Tumble dry low or hang dry.",
      "Do not bleach or iron directly.",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx", hex: "#0F0F0F" },
      { name: "Cloud", hex: "#F5F5F5" },
    ],
    images: [
      { id: 1, url: product9, alt: "Product 9 Front View" },
      { id: 2, url: product1, alt: "Product 9 Side View" },
      { id: 3, url: product2, alt: "Product 9 Detail View" },
    ],
    inStock: true,
  },
];
