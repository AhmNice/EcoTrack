import { create } from "zustand";
import { toast } from "react-toastify";
import api from "../lib/axios";

const initialState = {
  loadingVote: false,
  voteError: null,
  voteSuccess: null,
};

const ENDPOINT = "/votes";

export const useVoteStore = create((set, get) => ({
  ...initialState,

  upVoteReport: async (report_id) => {
    set({ loadingVote: true, voteError: null, voteSuccess: null });
    try {
      const { data } = await api.post(`${ENDPOINT}/add-vote/${report_id}`, {
        vote_type: 1,
      });
      if (!data.success) {
        toast.error(data.message)
        return data
      }
      set({ voteSuccess: data.message });
      toast.success(data.message);
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ voteError: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loadingVote: false });
    }
  },


  downVoteReport: async (report_id) => {
    set({ loadingVote: true, voteError: null, voteSuccess: null });
    try {
      const { data } = await api.post(`${ENDPOINT}/add-vote/${report_id}`, {
        vote_type: -1,
      });
      if (!data.success) {
        toast.error(data.message)
        return data
      }

      set({ voteSuccess: data.message });
      toast.success(data.message);
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ voteError: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loadingVote: false });
    }
  },


  removeVote: async (report_id) => {
    set({ loadingVote: true, voteError: null, voteSuccess: null });
    try {
      const { data } = await api.delete(`${ENDPOINT}/remove-vote/${report_id}`);
      if (!data.success) {
        toast.error(data.message)
        return data
      }
      set({ voteSuccess: data.message });
      toast.success(data.message);
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      set({ voteError: message });
      toast.error(message);
      throw error;
    } finally {
      set({ loadingVote: false });
    }
  },
}));
