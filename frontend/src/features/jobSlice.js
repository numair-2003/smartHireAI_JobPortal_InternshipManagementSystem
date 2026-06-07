import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (params = {}, thunkAPI) => {
  try {
    const { data } = await api.get('/jobs', { params });
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchMyJobs = createAsyncThunk('jobs/fetchMine', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/jobs/my/listings');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createJob = createAsyncThunk('jobs/create', async (jobData, thunkAPI) => {
  try {
    const { data } = await api.post('/jobs', jobData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteJob = createAsyncThunk('jobs/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/jobs/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: { jobs: [], myJobs: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.isLoading = true; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.myJobs = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.myJobs.unshift(action.payload);
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.myJobs = state.myJobs.filter((j) => j._id !== action.payload);
      });
  },
});

export default jobSlice.reducer;
