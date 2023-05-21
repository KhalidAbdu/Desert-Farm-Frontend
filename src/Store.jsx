import { createContext, useReducer } from 'react';

const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};
function reducer(state, action) {
  let newItem, anItem, cartItems;
  switch (action.type) {
    case 'CART_ADD_ITEM':
      newItem = action.payload;
      anItem = state.cart.cartItems.find((item) => item._id === newItem._id);
      cartItems = anItem
        ? state.cart.cartItems.map((item) =>
            item._id === anItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}
export const Store = createContext();
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
