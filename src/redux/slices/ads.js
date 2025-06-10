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

export const fetchMyAds = createAsyncThunk(
  "ads/fetchMyAds",
  async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const { data } = await axios.get(`/ads/user/my?${queryParams}`);
    return data;
  }
);

export const createAd = createAsyncThunk("ads/createAd", async (adData) => {
  const { data } = await axios.post("/ads", adData);
  return data;
});

export const updateAd = createAsyncThunk(
  "ads/updateAd",
  async ({ id, ...adData }) => {
    const { data } = await axios.patch(`/ads/${id}`, adData);
    return data;
  }
);

export const toggleAd = createAsyncThunk("ads/toggleAd", async (id) => {
  const { data } = await axios.patch(`/ads/${id}/toggle`);
  return { id, ...data };
});

export const uploadPhotos = createAsyncThunk(
  "ads/uploadPhotos",
  async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    const { data } = await axios.post("/upload/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
  myAds: {
    items: [],
    status: "loading",
    pagination: {
      current: 1,
      pages: 1,
      total: 0,
    },
  },
  currentAd: {
    data: null,
    status: "loading",
  },
  categories: {
    items: [],
    status: "loading",
  },
  uploadStatus: "idle",
};

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    clearCurrentAd: (state) => {
      state.currentAd.data = null;
      state.currentAd.status = "loading";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAds.pending, (state) => {
        state.ads.status = "loading";
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.ads.status = "loaded";
        state.ads.items = action.payload.ads;
        state.ads.pagination = action.payload.pagination;
      })
      .addCase(fetchAds.rejected, (state) => {
        state.ads.status = "error";
        state.ads.items = [];
      })

      .addCase(fetchAd.pending, (state) => {
        state.currentAd.status = "loading";
      })
      .addCase(fetchAd.fulfilled, (state, action) => {
        state.currentAd.status = "loaded";
        state.currentAd.data = action.payload;
      })
      .addCase(fetchAd.rejected, (state) => {
        state.currentAd.status = "error";
        state.currentAd.data = null;
      })

      .addCase(fetchMyAds.pending, (state) => {
        state.myAds.status = "loading";
      })
      .addCase(fetchMyAds.fulfilled, (state, action) => {
        state.myAds.status = "loaded";
        state.myAds.items = action.payload.ads;
        state.myAds.pagination = action.payload.pagination;
      })
      .addCase(fetchMyAds.rejected, (state) => {
        state.myAds.status = "error";
        state.myAds.items = [];
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.ads.items.unshift(action.payload);
        state.myAds.items.unshift(action.payload);
      })

      .addCase(updateAd.fulfilled, (state, action) => {
        const adsIndex = state.ads.items.findIndex(
          (ad) => ad._id === action.payload._id
        );
        if (adsIndex !== -1) {
          state.ads.items[adsIndex] = action.payload;
        }

        const myAdsIndex = state.myAds.items.findIndex(
          (ad) => ad._id === action.payload._id
        );
        if (myAdsIndex !== -1) {
          state.myAds.items[myAdsIndex] = action.payload;
        }

        if (state.currentAd.data?._id === action.payload._id) {
          state.currentAd.data = action.payload;
        }
      })

      .addCase(toggleAd.fulfilled, (state, action) => {
        const { id, active } = action.payload;

        const adsIndex = state.ads.items.findIndex((ad) => ad._id === id);
        if (adsIndex !== -1) {
          state.ads.items[adsIndex].active = active;
        }

        const myAdsIndex = state.myAds.items.findIndex((ad) => ad._id === id);
        if (myAdsIndex !== -1) {
          state.myAds.items[myAdsIndex].active = active;
        }

        if (state.currentAd.data?._id === id) {
          state.currentAd.data.active = active;
        }
      })

      .addCase(fetchRemoveAd.pending, (state, action) => {
        const adId = action.meta.arg;
        state.ads.items = state.ads.items.filter((ad) => ad._id !== adId);
        state.myAds.items = state.myAds.items.filter((ad) => ad._id !== adId);
      })

      .addCase(uploadPhotos.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(uploadPhotos.fulfilled, (state) => {
        state.uploadStatus = "loaded";
      })
      .addCase(uploadPhotos.rejected, (state) => {
        state.uploadStatus = "error";
      })

      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = "loading";
        state.categories.items = [];
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.status = "loaded";
        state.categories.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categories.status = "error";
        state.categories.items = [];
      });
  },
});

export const adsReducer = adsSlice.reducer;
