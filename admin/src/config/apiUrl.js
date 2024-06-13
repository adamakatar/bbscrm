// export const apiUrl = "https://backend.bizbrokerscolorado.com";
//export const apiUrl = "http://localhost:3016";
export const apiUrl = "https://bizbrokerscolorado.com";
// export const apiUrl = "https://brokerage-backend-silivex-e60fb62d598a.herokuapp.com";
// export const apiUrl = "https://businessbrokeragebackend-170afe52191a.herokuapp.com";
// export const apiUrl = "https://eab3-39-57-209-91.ngrok-free.app";

export const socketURL = `${apiUrl}`;
export const stripe_public_key = `pk_test_51L8FqNL51LXb45sopLMv0wOiEZvg9NhshZWh0vWC7Okl7Alm2n01MGG89jdvovL41Fw98xNs1I0VqIn29KCD9JQc00acfYgJBk`;

export const googleMapApiKey = "AIzaSyAQF8zMBGMgko1Fz5oDAzu8lWS7iasTgr0";

export const imageUrl = (url) => `${apiUrl}/api/v1/images/${url}`;
export const mediaUrl = (url) => `${apiUrl}/api/v1/media/${url}`;

export const BaseURL = (link) => {
  return `${apiUrl}/api/v1/${link}`;
};

export const apiHeader = (token, isFormData) => {
  if (token && !isFormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }
  if (token && isFormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  }
  if (!token && !isFormData) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (!token && isFormData) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const CreateFormData = (data) => {
  const formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};

export const firebaseVapidObject = {
  vapidKey:
    "BKlmZ2T6iSDR1mOAaQOzBEbwHdlYX71OqZOwvvja_oDliCf9eRrb8Rgo_dasRs9WCpgSppH0O0kvtIOc959bO0U",
};

export const formRegEx = /([a-z])([A-Z])/g;
export const formRegExReplacer = "$1 $2";

export var recordsLimit = 10;
export var recordsLimit50 = 50;

export const ReturnFormatedNumber = (number) => {
  let newNumber = number?.slice(2);
  newNumber = newNumber?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) - $2 $3");
  return newNumber;
};
