import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const CartContext = createContext(null);


export const CartProvider = ({ children }) => {

  // Load existing cart from localStorage
  const [cartItems, setCartItems] = useState(() => {

    const savedCart = localStorage.getItem("cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });


  // Save cart whenever cartItems changes
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);


  // ADD FOOD TO CART

  const addToCart = (food) => {

    setCartItems((currentItems) => {

      const existingItem = currentItems.find(
        (item) => item.id === food.id
      );


      // Food already in cart
      if (existingItem) {

        return currentItems.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }


      // New food
      return [
        ...currentItems,
        {
          ...food,
          quantity: 1,
        },
      ];

    });

  };


  // INCREASE QUANTITY

  const increaseQuantity = (foodId) => {

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === foodId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

  };


  // DECREASE QUANTITY

  const decreaseQuantity = (foodId) => {

    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === foodId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  };


  // REMOVE ITEM

  const removeFromCart = (foodId) => {

    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== foodId
      )
    );

  };


  // CLEAR CART

  const clearCart = () => {
    setCartItems([]);
  };


  // TOTAL NUMBER OF ITEMS

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  // CART TOTAL

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) * item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );

};


export const useCart = () => {

  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};