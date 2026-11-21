
import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  MessageCircle,
  X,
  Leaf
} from "lucide-react";


const products = [
  {
  id: 1,
  name: "Fresh Mosambi",
  marathi: "ताजी मोसंबी",
  category: "Fruits",
  price: 40,
  unit: "kg",
  emoji: "🍊",
  image: "/images/crops/mosambi.jpg",
  description: "Fresh farm-grown sweet lime."
},
  {
    id: 2,
    name: "Fresh Maize",
    marathi: "ताजा मका",
    category: "Grains",
    price: 25,
    unit: "kg",
    emoji: "/images/crops/maize.jpg",
    image: "/images/crops/maize.jpg",
    description: "Quality farm-grown maize."
  },
  {
    id: 3,
    name: "Wheat",
    marathi: "गहू",
    category: "Grains",
    price: 32,
    unit: "kg",
    emoji: "/images/crops/wheat.jpg",
    image: "/images/crops/wheat.jpg",
    description: "Farm-fresh quality wheat."
  },
  {
    id: 4,
    name: "Onion",
    marathi: "कांदा",
    category: "Vegetables",
    price: 30,
    unit: "kg",
    emoji: "/images/crops/onion.jpg",
    image: "/images/crops/onion.jpg",
    description: "Fresh quality onions."
  },
  {
    id: 5,
    name: "Tomato",
    marathi: "टोमॅटो",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    emoji: "/images/crops/tomato.jpg",
    image: "/images/crops/tomato.jpg",
    description: "Fresh farm tomatoes."
  },
  {
    id: 6,
    name: "Bajra",
    marathi: "बाजरी",
    category: "Grains",
    price: 35,
    unit: "kg",
    emoji: "/images/crops/bajra.jpg",
    image: "/images/crops/bajra.jpg",
    description: "Quality pearl millet."
  }
];


export default function Products() {
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Fruits", "Grains", "Vegetables"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.marathi.includes(search);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  const total = products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] || 0),
    0
  );

  const updateCart = (id, change) => {
    setCart((previous) => {
      const next = { ...previous };
      next[id] = Math.max(0, (next[id] || 0) + change);

      if (next[id] === 0) delete next[id];

      return next;
    });
  };

  const sendWhatsAppOrder = (phone) => {
    const items = products
      .filter((product) => cart[product.id])
      .map(
        (product) =>
          `${product.name} - ${cart[product.id]} kg = ₹${product.price * cart[product.id]}`
      );

    if (!items.length) {
      alert("Please add products to cart first.");
      return;
    }

    const message = [
      "Hello Kakde Agro!",
      "I want to place an order:",
      "",
      ...items,
      "",
      `Total: ₹${total}`,
      "",
      "Please confirm availability and delivery details."
    ].join("\n");

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <section className="marketplace-section" id="marketplace">
      <div className="marketplace-heading">
        <span className="marketplace-tag">
          <Leaf size={16} /> KAKDE AGRO MARKETPLACE
        </span>
        <h2>Farm Fresh Products</h2>
        <p>Direct from our farm to your home.</p>
      </div>

      <div className="marketplace-tools">
        <div className="marketplace-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
        </div>

        <div className="marketplace-categories">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="marketplace-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
           <img
  src={product.image}
  alt={product.name}
  className="product-image"
  loading="lazy"
/> 
            <span className="product-category">{product.category}</span>
            <h3>{product.name}</h3>
            <p className="product-marathi">{product.marathi}</p>
            <p className="product-description">{product.description}</p>

            <div className="product-bottom">
              <strong>₹{product.price}/{product.unit}</strong>

              <div className="quantity-controls">
                <button onClick={() => updateCart(product.id, -1)}>
                  <Minus size={15} />
                </button>
                <span>{cart[product.id] || 0}</span>
                <button onClick={() => updateCart(product.id, 1)}>
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="marketplace-empty">No products found.</p>
      )}

      <div className="marketplace-cart">
        <div>
          <strong>
            <ShoppingCart size={18} /> Your Cart ({cartCount})
          </strong>
          <p>Total: ₹{total}</p>
        </div>

        <div className="marketplace-checkout">
          <button onClick={() => sendWhatsAppOrder("919359183419")}>
            <MessageCircle size={17} /> Order 1
          </button>
          <button onClick={() => sendWhatsAppOrder("919420243651")}>
            <MessageCircle size={17} /> Order 2
          </button>
        </div>
      </div>
    </section>
  );
}
