import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchMyApplications = createAsyncThunk('apps/mine', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/applications/my');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchJobApplications = createAsyncThunk('apps/byJob', async (jobId, thunkAPI) => {
  try {
    const { data } = await api.get(`/applications/job/${jobId}`);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const applyToJob = createAsyncThunk('apps/apply', async (formData, thunkAPI) => {
  try {
    const { data } = await api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateStatus = createAsyncThunk('apps/status', async ({ id, status }, thunkAPI) => {
  try {
    const { data } = await api.put(`/applications/${id}/status`, { status });
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: { myApplications: [], jobApplications: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.myApplications = action.payload;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.jobApplications = action.payload;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.myApplications.unshift(action.payload);
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const idx = state.jobApplications.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.jobApplications[idx] = action.payload;
      });
  },
});

export default applicationSlice.reducer;
