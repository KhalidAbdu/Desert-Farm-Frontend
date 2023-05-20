import { createContext, useReducer } from 'react';

const initialState = {
  cart: {
    cartItems: [],
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
      return { ...state, cart: { ...state.cart, cartItems } };
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
