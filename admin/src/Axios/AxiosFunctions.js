import axios from "axios";
import { toast } from "react-toastify";

/**
 * @description Sends a Get request to api
 * @param {String} route
 * @example "/api/route"
 * @returns Promise<any>
 */

let Get = async (route, accessToken, showAlert = true, callback) => {
  const options = accessToken
    ? {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    : {
        headers: {
          Accept: "application/json",
        },
      };
  try {
    const response = await axios.get(route, options);
    return response;
  } catch (error) {
    let errorMessage = "";
    Array.isArray(error?.response?.data?.message?.error)
      ? error?.response?.data?.message?.error?.map(
          (item, i) => (errorMessage = `${errorMessage} • ${item} \n`)
        )
      : (errorMessage = error?.response?.data?.message?.error);
    if (showAlert == true) {
      if (error.message === "Network Error") {
        toast.error(`${error.message} : Please Check Your Network Connection`, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
    callback && callback(error);
  }
};

/**
 * @description Sends a post request to api
 * @param {String} route
 * @example "/api/route"
 * @param {Object} data
 * @example {foo:bar}
 * @returns Promise<any>
 */

let Post = async (route, data, headers, showAlert = true) => {
  try {
    return await axios.post(route, data, headers);
  } catch (error) {
    let errorMessage = "";
    Array.isArray(error?.response?.data?.message?.error)
      ? error?.response?.data?.message?.error?.map(
          (item, i) => (errorMessage = `${errorMessage} • ${item} \n`)
        )
      : (errorMessage = error?.response?.data?.message?.error);
    if (error.message === "Network Error") {
      toast.error(`${error.message} : Please Check Your Network Connection`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
};

/**
 * @description Sends a post request to api
 * @param {String} route
 * @example "/api/route"
 * @param {Object} data
 * @example {foo:bar}
 *   @returns Promise<any>
 */

let Patch = async (route, data, headers, showAlert = true) => {
  try {
    return await axios.patch(route, data, headers);
  } catch (error) {
    let errorMessage = "";
    Array.isArray(error?.response?.data?.message?.error)
      ? error?.response?.data?.message?.error?.map(
          (item, i) => (errorMessage = `${errorMessage} • ${item} \n`)
        )
      : (errorMessage = error?.response?.data?.message?.error);
    if (error.message === "Network Error") {
      toast.error(`${error.message} : Please Check Your Network Connection`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
};

/**
 * @description Sends a post request to api
 * @param {String} route
 * @example "/api/route"
 * @param {Object} data
 * @example {foo:bar}
 *   @returns Promise<any>
 */

let Put = async (route, data, headers, showAlert = true) => {
  try {
    return await axios.put(route, data, headers);
  } catch (error) {
    let errorMessage = "";
    Array.isArray(error?.response?.data?.message?.error)
      ? error?.response?.data?.message?.error?.map(
          (item, i) => (errorMessage = `${errorMessage} • ${item} \n`)
        )
      : (errorMessage = error?.response?.data?.message?.error);
    if (error.message === "Network Error") {
      toast.error(`${error.message} : Please Check Your Network Connection`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
};

/**
 * @description Sends a Delete request to api
 * @param {String} route
 * @example "/api/route"
 * @param {Object} data
 * @example {foo:bar}
 *   @returns Promise<any>
 */

let Delete = async (route, data, headers, showAlert = true) => {
  try {
    return data == null
      ? await axios.delete(route, headers)
      : await axios.delete(route, data, headers);
  } catch (error) {
    let errorMessage = "";
    Array.isArray(error?.response?.data?.message?.error)
      ? error?.response?.data?.message?.error?.map(
          (item, i) => (errorMessage = `${errorMessage} • ${item} \n`)
        )
      : (errorMessage = error?.response?.data?.message?.error);
    if (error.message === "Network Error") {
      toast.error(`${error.message} : Please Check Your Network Connection`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
};
export { Post, Put, Get, Patch, Delete };
