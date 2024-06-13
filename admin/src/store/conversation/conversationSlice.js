import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
  addedContacts: [],
};

const conversationSlice = createSlice({
  name: "conversationSlice",
  initialState,
  //   reducer needs a map
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setAddedContacts(state, action) {
      state.addedContacts = action.payload;
    },
  },
});

export const { setShowModal, setAddedContacts } = conversationSlice.actions;

export default conversationSlice.reducer;
