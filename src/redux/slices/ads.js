import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAds = createAsyncThunk(
  "ads/fetchAds",
  async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const { data } = await axios.get(`/ads?${queryParams}`);
    return data;
  }
);

export const fetchAd = createAsyncThunk("ads/fetchAd", async (id) => {
  const { data } = await axios.get(`/ads/${id}`);
  return data;
});

export const createAd = createAsyncThunk("ads/createAd", async (adData) => {
  const { data } = await axios.post("/ads", adData);
  return data;
});

export const updateAd = createAsyncThunk(
  "ads/updateAd",
  async ({ id, ...adData }) => {
    const { data } = await axios.put(`/ads/${id}`, adData);
    return data;
  }
);

export const fetchRemoveAd = createAsyncThunk(
  "ads/fetchRemoveAd",
  async (id) => {
    await axios.delete(`/ads/${id}`);
    return id;
  }
);

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const { data } = await axios.get("/categories");
    return data;
  }
);

const initialState = {
  ads: {
    items: [],
    status: "loading",
    pagination: {
      current: 1,
      pages: 1,
      total: 0,
    },
  },
  categories: {
    items: [],
    status: "loading",
  },
};

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAds.pending, (state) => {
        state.ads.status = "loading";
        state.ads.items = [];
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.ads.status = "loaded";
        state.ads.items = action.payload.ads;
        state.ads.pagination = action.payload.pagination;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.ads.status = "error";
        state.ads.items = [];
      })

      .addCase(fetchAd.fulfilled, (state, action) => {
        state.ads.items = action.payload;
      })

      .addCase(createAd.fulfilled, (state, action) => {
        state.ads.items.unshift(action.payload);
      })

      .addCase(updateAd.fulfilled, (state, action) => {
        const index = state.ads.items.ads.findIndex(
          (ad) => ad._id === action.payload._id
        );
        if (index !== -1) {
          state.ads.items[index] = action.payload;
        }
      })

      .addCase(fetchRemoveAd.pending, (state, action) => {
        state.ads.items = state.ads.items.filter(
          (ad) => ad._id !== action.meta.arg
        );
      })

      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = "loading";
        state.categories.items = [];
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.status = "loaded";
        state.categories.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.status = "error";
        state.categories.items = [];
      });
  },
});

export const adsReducer = adsSlice.reducer;
