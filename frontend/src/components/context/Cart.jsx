import { createContext, useEffect, useState } from "react";
import { apiUrl } from "../common/Http";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const [shippingCost, setShippingCost] = useState(0);

  const addToCart = (product, size = null) => {
    let updatedCart = [...cartData];

    // If cart is empty
    if (cartData.length == 0) {
      updatedCart.push({
        id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
        product_id: product.id,
        size,
        title: product.title,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
      });
    } else {
      if (size != null) {
        const isProductExist = updatedCart.find(
          (item) => item.product_id == product.id && item.size == size
        );

        // If product and size combnination exist then increase quantity
        if (isProductExist) {
          updatedCart = updatedCart.map((item) =>
            item.product_id == product.id && item.size == size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // If product and size combnination not exist then add new item
          updatedCart.push({
            id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
            product_id: product.id,
            size,
            title: product.title,
            price: product.price,
            quantity: 1,
            image_url: product.image_url,
          });
        }
      } else {
        // When Size is null
        const isProductExist = updatedCart.find(
          (item) => item.product_id == product.id
        );

        if (isProductExist) {
          // When product found in cart then increase quantity
          updatedCart = updatedCart.map((item) =>
            item.product_id == product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // If product not exist then add new item
          updatedCart.push({
            id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
            product_id: product.id,
            size,
            title: product.title,
            price: product.price,
            quantity: 1,
            image_url: product.image_url,
          });
        }
      }
    }

    setCartData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getShippingFront = async () => {
    const res = await fetch(`${apiUrl}/get-shipping-front`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.status === 200) {
          setShippingCost(result.data.shipping_charge);
        } else {
          console.log(result);
        }
      })
      .catch((error) => console.log(error));
  };

  const shipping = () => {
    let shippingAmount = 0;
    cartData.map((item) => {
      shippingAmount += item.quantity * shippingCost;
    });
    return shippingAmount;
  };

  const subTotal = () => {
    let subTotal = 0;
    cartData.map((item) => {
      subTotal += item.quantity * item.price;
    });
    return subTotal || 0;
  };

  const grandTotal = () => {
    return subTotal() + shipping() || 0;
  };

  const updateCartItem = (itemId, newQuantity) => {
    let updateCart = [...cartData];

    updateCart = updateCart.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCartData(updateCart);
    localStorage.setItem("cart", JSON.stringify(updateCart));
  };

  const deleteCartItem = (itemId) => {
    const newCartItem = cartData.filter((item) => item.id !== itemId);
    setCartData(newCartItem);
    localStorage.setItem("cart", JSON.stringify(newCartItem));
  };

  const getCartQuantity = () => {
    let quantity = 0;
    cartData.forEach((item) => {
      quantity += Number(item.quantity);
    });

    return quantity;
  };

  useEffect(() => {
    getShippingFront();
  }, []);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        cartData,
        shipping,
        subTotal,
        grandTotal,
        updateCartItem,
        deleteCartItem,
        getCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
