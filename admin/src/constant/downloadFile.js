import Axios from "axios";

const options = {
  onDownloadProgress: (progressEvent) => {
    const { loaded, total } = progressEvent;
  },
};

export function downloadFileFromUrl(fileUrl, filename) {
  Axios.get(fileUrl, {
    responseType: "blob",
    ...options,
  })
    .then(function (response) {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    })
    .catch((e) => {});
}
