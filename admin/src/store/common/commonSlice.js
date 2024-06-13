import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allBrokers: [],
  allCategories: [],
  allOwners: [],
  allListing: [],
  allUsers: [],
  allTaskManagerTemplate: [],
  allEmailTemplates: [],
  hasNotification: false,
};

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  //   reducer needs a map
  reducers: {
    setEmailTemplates(state, action) {
      state.allEmailTemplates = action.payload;
    },
    setAllCommon(state, action) {
      state.allBrokers = action.payload?.allBrokers;
      state.allCategories = action.payload?.allCategories;
      state.allOwners = action.payload?.allOwners;
      state.allListing = action.payload?.allListing;
      state.allUsers = action.payload?.allUsers;
      state.allTaskManagerTemplate = action.payload?.allTaskManagerTemplate;
      state.allEmailTemplates = action.payload?.allEmailTemplates;
    },
    setHasNotification: (state, action) => {
      state.hasNotification = action.payload.data;
    }
  },
});

export const { setAllCommon, setEmailTemplates, setHasNotification } = commonSlice.actions;

export default commonSlice.reducer;
