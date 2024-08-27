import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance"
const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    role: localStorage.getItem('role') || "",
    data: (() => {
        try {
            return JSON.parse(localStorage.getItem('data')) || {};
        } catch {
            return {};
        }
    })()
    // token: localStorage.getItem('token') || ""
    // isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    // role: localStorage.getItem('role') || "",
    // data: localStorage.getItem('data') != undefined ? JSON.parse(localStorage.getItem('data')) : {}
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("user/register", data);
        toast.promise(res, {
            loading: "Wait! creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
        

    }
})

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("user/login", data);
        toast.promise(res, {
            loading: "Wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log in"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = axiosInstance.get("user/logout");
        toast.promise(res, {
            loading: "Wait! logout in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log out"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
    try {
        const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
        toast.promise(res, {
            loading: "Wait! profile update in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update profile"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})

export const getUserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = axiosInstance.get("user/me");
        return (await res).data;
    } catch(error) {
        toast.error(error.message);
    }
})


// function to change user password
export const changePassword = createAsyncThunk(
    "/auth/changePassword",
    async (userPassword) => {
      try {
        let res = axiosInstance.post("/user/change-password", userPassword);
  
        await toast.promise(res, {
          loading: "Loading...",
          success: (data) => {
            return data?.data?.message;
          },
          error: "Failed to change password",
        });
  
        // getting response resolved here
        res = await res;
        return res.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  );
  
  // function to handle forget password
  export const forgetPassword = createAsyncThunk(
    "auth/forgetPassword",
    async (email) => {
      try {
        let res = axiosInstance.post("/user/reset", { email });
  
        await toast.promise(res, {
          loading: "Loading...",
          success: (data) => {
            return data?.data?.message;
          },
          error: "Failed to send verification email",
        });
  
        // getting response resolved here
        res = await res;
        return res.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  );

  
// function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
    try {
      let res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
        password: data.password,
      });
  
      toast.promise(res, {
        loading: "Resetting...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to reset password",
      });
      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  });

  export const updateSubscriptionStatus = createAsyncThunk("/success",async (status) => {
        try {
            // Make the API request to update the subscription status
            const res = await axiosInstance.post('/user/subscription', { status });

            // Show success toast notification
            toast.promise(res, {
                loading: "Updating subscription...",
                success: (data) => data?.data?.message || "Subscription updated successfully!",
                error: "Failed to update subscription"
            });

            // Return the response data
            return res.data;
        } catch (error) {
            // Show error toast notification
            toast.error(error?.response?.data?.message || "An error occurred");

            // Pass the error to the Redux action
            // return rejectWithValue(error?.response?.data || { message: "An error occurred" });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            // localStorage.setItem("token", action?.payload?.jwt);  // Store JWT token
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
            state.token = action?.payload?.user?.jwt


        })
        .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.data = {};
            state.isLoggedIn = false;
            state.role = "";
        })
        .addCase(getUserData.fulfilled, (state, action) => {
            if(!action?.payload?.user) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        });
    }
});

// export const {} = authSlice.actions;
export default authSlice.reducer;