import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "Cart",
  initialState: {
    data: [],
    total: 0,
    original_total: 0,
  },
  reducers: {
    addToCart(state, { payload }) {
      const productData = state.data.find((prod) => prod.productId === payload.productId);
      if (productData) {
        productData.qty++;
      } else {
        state.data.push({
          productId: payload.productId,
          finalPrice: Number(payload.finalPrice),
          originalPrice: Number(payload.originalPrice),
          qty: 1,
        });
      }

      state.total += Number(payload.finalPrice);
      state.original_total += Number(payload.originalPrice);

      localStorage.setItem("cart-data", JSON.stringify(state.data));
      localStorage.setItem("cart-total", state.total);
      localStorage.setItem("original-total", state.original_total);
    },

    removeFromCart(state, { payload }) {
      const index = state.data.findIndex((prod) => prod.productId === payload.productId);
      if (index !== -1) {
        const item = state.data[index];

        state.total -= item.qty * item.finalPrice;
        state.original_total -= item.qty * item.originalPrice;

        state.data.splice(index, 1);

        localStorage.setItem("cart-data", JSON.stringify(state.data));
        localStorage.setItem("cart-total", state.total);
        localStorage.setItem("original-total", state.original_total);
      }
    },

    changeQty(state, { payload }) {
      const item = state.data.find((prod) => prod.productId === payload.productId);
      if (item) {
        const qtyDiff = payload.qty - item.qty;

        state.total += qtyDiff * item.finalPrice;
        state.original_total += qtyDiff * item.originalPrice;

        item.qty = payload.qty;

        localStorage.setItem("cart-data", JSON.stringify(state.data));
        localStorage.setItem("cart-total", state.total);
        localStorage.setItem("original-total", state.original_total);
      }
    },

    lstoCart(state) {
      const cartData = localStorage.getItem("cart-data");
      const cartTotal = localStorage.getItem("cart-total");
      const OriginalTotal = localStorage.getItem("original-total");

      if (cartData) {
        state.data = JSON.parse(cartData);
        state.total = Number(cartTotal);
        state.original_total = Number(OriginalTotal);
      }
    },

    emptyCart(state) {
      state.data = [];
      state.total = 0;
      state.original_total = 0;
      localStorage.removeItem("cart-data");
      localStorage.removeItem("cart-total");
      localStorage.removeItem("original-total");
    },

    dbToCart(state, { payload }) {
      state.data = payload.data;
      state.total = payload.total;
      state.original_total = payload.original_total;
      localStorage.setItem("cart-data", JSON.stringify(state.data));
      localStorage.setItem("cart-total", state.total);
      localStorage.setItem("original-total", state.original_total);
    }
  },
});

export const { addToCart, removeFromCart, changeQty, lstoCart, emptyCart, dbToCart } = cartSlice.actions;
export default cartSlice.reducer;
