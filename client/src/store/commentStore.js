import { toast } from "react-toastify";
import api from "../lib/axios";
import { create } from "zustand";

const ENDPOINT = "/comments";

const initialState = {

  loadingComments: false,
  commentError: null,
  commentSuccess: null,
};

export const useCommentStore = create((set, get) => ({
  ...initialState,


  addComment: async (payload) => {
    set({
      loadingComments: true,
      commentError: null,
      commentSuccess: null,
    });

    try {
      const { data } = await api.post(
        `${ENDPOINT}/add-comment/${payload.report_id}`,
        payload
      );

      if (!data.success) {
        toast.error(data.message);
        set({
          loadingComments: false,
          commentError: data.message,
        });
        return { success: false };
      }

      toast.success(data.message);


      set((state) => ({
        loadingComments: false,
        commentSuccess: data.message,
      }));

      return { success: true, comment: data.comment };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Failed to submit comment";

      toast.error(errMsg);
      set({
        loadingComments: false,
        commentError: errMsg,
      });

      return { success: false };
    }
  },

  getCommentsByReport: async (report_id) => {
    set({
      loadingComments: true,
      commentError: null,
    });
    try {
      const { data } = await api.get(
        `${ENDPOINT}/get-post-comment/${report_id}`
      );

     
      if (!data.success) {
        set({
          loadingComments: false,
          commentError: data.message,
        });
        toast.error(data.message)
        return { success: false };
      }

      set({
        loadingComments: false,
      });
      return { success: true, comments: data.comments }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Failed to fetch comments";

      set({
        loadingComments: false,
        commentError: errMsg,
      });
      throw error
    }
  },

  updateComment: async (comment_id, payload) => {
    set({
      loadingComments: true,
      commentError: null,
      commentSuccess: null,
    });

    try {
      const { data } = await api.patch(
        `${ENDPOINT}/update-comment/${comment_id}`,
        payload
      );

      if (!data.success) {
        toast.error(data.message);
        set({
          loadingComments: false,
          commentError: data.message,
        });
        return { success: false };
      }

      toast.success(data.message);

      set((state) => ({
        loadingComments: false,
        commentSuccess: data.message,
      }));

      return { success: true };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Failed to update comment";

      toast.error(errMsg);
      set({
        loadingComments: false,
        commentError: errMsg,
      });

      return { success: false };
    }
  },

  deleteComment: async (comment_id) => {
    set({
      loadingComments: true,
      commentError: null,
      commentSuccess: null,
    });

    try {
      const { data } = await api.delete(
        `${ENDPOINT}/delete-comment/${comment_id}`
      );

      if (!data.success) {
        toast.error(data.message);
        set({
          loadingComments: false,
          commentError: data.message,
        });
        return { success: false };
      }

      toast.success(data.message);

      set((state) => ({

        loadingComments: false,
        commentSuccess: data.message,
      }));

      return { success: true };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        "Failed to delete comment";

      toast.error(errMsg);
      set({
        loadingComments: false,
        commentError: errMsg,
      });

      return { success: false };
    }
  },

  resetCommentState: () => {
    set(initialState);
  },
}));
