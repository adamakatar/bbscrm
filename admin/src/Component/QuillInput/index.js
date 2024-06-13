import React, { useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import BlotFormatter from "quill-blot-formatter";
import classes from "./QuillInput.module.css";
import { apiHeader, BaseURL, imageUrl } from "../../config/apiUrl";
import { Post } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { useEffect } from "react";
Quill.register("modules/blotFormatter", BlotFormatter);

function QuillInput({
  value,
  setter,
  quillClass = "",
  placeholder = "",
  label,
  disabled,
  ...props
}) {
  const toolbarOption = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ];
  const modules = {
    blotFormatter: {
      overlay: {
        style: { border: "2px solid var(--dashboard-main-color)" },
      },
    },
    toolbar: toolbarOption,
  };

  return (
    <>
      {label && <label className={classes.label}>{label}</label>}
      <style>{`
      .ql-disabled{
         background-color:var(--disabled-input-color);
      }
      .ql-snow{
         background-color:${
           disabled ? "var(--disabled-input-color)" : "var(--white-color)"
         } ;
      }
      `}</style>
      <div className={classes.quillInput}>
        <ReactQuill
          className={`${classes.quill} ${
            disabled && classes.disabledQuillInput
          } ${quillClass}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setter(e)}
          modules={modules}
          readOnly={disabled}
          {...props}
        />
      </div>
    </>
  );
}

export default QuillInput;
function extractImgKeys(value) {
  let array = value.match(/https:\/\/\S+(?:jpg|jpeg|png)/g);
  let newArray = array?.map((item) => item?.split("images/")[1]);
  return newArray;
}

export function CkEditorInput({
  value,
  setter,
  quillClass = "",
  placeholder = "",
  label,
  disabled,
  oldData,
  ...props
}) {
  let imagesInText = oldData ? extractImgKeys(oldData) : [];
  let imagesInState = extractImgKeys(value);
  const ckRef = useRef(null);
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );

  async function uploadImage(img) {
    const url = BaseURL("upload/image");
    const formData = new FormData();
    formData.append("photo", img);
    const response = await Post(url, formData, apiHeader(accessToken, true));
    return response?.data;
  }
  async function deleteImage(images) {
    const url = BaseURL("delete/image");
    const params = {
      images,
    };
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      method: "DELETE",
    });
    return response?.data?.data;
  }

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then(async (file) => {
            const fileUpload = await uploadImage(file);
            let url = `${imageUrl(fileUpload?.data?.keys[0])}`;
            resolve({
              default: url,
            });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  const editorConfiguration = {
    toolbar: [
      "bold",
      "italic",
      "heading",
      "|",
      // "link",
      "bulletedList",
      "numberedList",
      "fontFamily",
      "blockQuote",
      // "ckfinder",
      "fontSize",
      "fontColor",
      "fontBackgroundColor",
      "removeFormat",
      "|",
      "alignment",
      "|",
      "imageTextAlternative",
      "imageUpload",
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "mediaEmbed",
      "insertTable",
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "|",
      "undo",
      "redo",
    ],
    extraPlugins: [uploadPlugin],
  };

  useEffect(() => {
    if (oldData) {
      let removedImages = imagesInText?.filter((item) => {
        if (!imagesInState?.includes(item)) {
          return item;
        }
      });
      if (imagesInText?.length > imagesInState?.length) {
        deleteImage(removedImages);
      }
    }
  }, [value]);

  ClassicEditor.create(document.querySelector("#description"))
    .then((editor) => {
      editor.isReadOnly = true; // make the editor read-only right after initialization
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <>
      {label && <label className={classes.label}>{label}</label>}
      <div className={`${classes.ckEditorBox}  ${quillClass && quillClass}`}>
        <CKEditor
          editor={ClassicEditor}
          ref={ckRef}
          className={`${classes.CKEditor} ${
            disabled && classes.disabledQuillInput
          }`}
          config={editorConfiguration}
          placeholder={placeholder}
          data={value}
          onChange={(e, editor) => {
            setter(editor?.getData());
          }}
          isReadOnly={disabled}
          readOnly={disabled}
          locked={disabled}
          {...props}
        />
      </div>
    </>
  );
}
