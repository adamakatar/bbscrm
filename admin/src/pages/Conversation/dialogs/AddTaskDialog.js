import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useSelector } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Get, Post } from "../../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../../config/apiUrl";
import Loader from "../../../Component/Loader";
import { MSG_REQUIRED_FIELD } from "../../../utils/contants";
//  -------------------------------------------------------------------------------

const initialValues = {
  project: '',
  name: '',
  status: '',
  assignees: [],
  deadline: '',
  description: '',
};

const validationSchema = yup.object().shape({
  project: yup.string().required(MSG_REQUIRED_FIELD),
  name: yup.string().required(MSG_REQUIRED_FIELD),
  status: yup.string().required(MSG_REQUIRED_FIELD),
  assignees: yup
    .array()
    .of(yup.string().required(MSG_REQUIRED_FIELD))
    .min(1, "Assginee is required"),
  deadline: yup.string().required(MSG_REQUIRED_FIELD),
});

//  -------------------------------------------------------------------------------

export default function AddTaskDialog({ open, contacts, setOpen }) {
  const { access_token: accessToken, user } = useSelector((state) => state?.authReducer);

  const [deadline, setDeadline] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const availableAssignees = contacts.map(c => {
    const { firstName, lastName, role } = c?._doc;
    return {
      firstName,
      lastName,
      role,
      _id: c?._doc?._id
    };
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      Post(BaseURL('projects/add-task'), {
        creator: user?._id,
        title: values.name,
        project: values.project,
        type: "task",
        stageId: values.status,
        assignedTo: values.assignees,
        deadlineDate: values.deadline,
        description: values.description,
      }, apiHeader(accessToken)).then((res) => {
        setLoading(false);
        if (typeof res.data === 'string') {
          return toast.error(res.data);
        }
        onClose();
        return toast.success('Created successfully.');
      }).catch((err) => {
        setLoading(false);
        return toast.error(err.toString());
      });
    },
  });

  const handleAssignees = (_, values) => {
    formik.setFieldValue('assignees', values.map((v) => v._id));
    setAssignees(values);
  };

  const handleDeadline = (ddl) => {
    setDeadline(ddl);

    const ddlInDate = new Date(
      dayjs(ddl).format("YYYY-MM-DD HH:mm:ss:SSS")
    );
    const isoString = ddlInDate.toISOString();
    const formattedString = isoString.substring(0, 19) + "Z";
    formik.setFieldValue("deadline", formattedString);  //  2023-11-08T15:00:00Z
  }

  const onClose = () => {
    formik.setFormikState({
      values: initialValues,
      touched: false,
    });
    setAssignees([]);
    setDeadline(null);
    setOpen(false);
  };

  useEffect(() => {
    //  Get all projects
    Get(BaseURL('projects'), accessToken)
      .then((res) => {
        if (Array.isArray(res?.data?.data.project)) {
          setProjects(res.data.data.project);
        }
      })
      .catch((err) => {
        console.log('>>>>>>>>> err => ', err);
      });

    
    //  Get all task , comment out on 2023.12.16
    // Get(BaseURL('tasks/s-get-all-task-statuses'), accessToken)
    //   .then((res) => {
    //     if (Array.isArray(res?.data)) {
    //       setStatuses(res?.data);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log('>>>>>>>>> err => ', err);
    //   });
  }, []);

  useEffect(() => {
    if (formik.values.project) {
      const { assignTo: _assignees, stages: _status } = projects.find((p) => p?._id === formik.values.project);
      setStatuses(_status);
    }
  }, [formik.values.project]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
          }}
        >
          Add New Task
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        {loading ? (
          <Loader />
        ) : (
          <>
            <DialogContent>
              <Stack pt={2} spacing={2}>
                <TextField
                  name="project"
                  label="Project"
                  value={formik.values.project}
                  onChange={formik.handleChange}
                  error={formik.touched.project && Boolean(formik.errors.project)}
                  helperText={formik.touched.project && formik.errors.project}
                  select
                  fullWidth
                >
                  {projects.map((p) => (
                    <MenuItem key={p?._id} value={p?._id}>{p?.name}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  name="name"
                  label="Task Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                />

                <TextField
                  name="status"
                  label="Task Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                  select
                  fullWidth
                >
                  {statuses.map((s) => (
                    <MenuItem key={s?._id} value={s?._id}>{s?.name}</MenuItem>
                  ))}
                </TextField>

                <Autocomplete
                  multiple
                  limitTags={10}
                  options={availableAssignees}
                  getOptionLabel={(i) => `${i.firstName} ${i.lastName}(${i.role})`}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assignees"
                      error={formik.touched.assignees && Boolean(formik.errors.assignees)}
                      helperText={formik.touched.assignees && formik.errors.assignees}
                      fullWidth
                    />
                  )}
                  onChange={handleAssignees}
                  value={assignees}
                />

                <DateTimePicker
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      error={formik.touched.deadline && Boolean(formik.errors.deadline)}
                      helperText={formik.touched.deadline && formik.errors.deadline}
                    />
                  )}
                  label="Deadline *"
                  name="deadline"
                  value={deadline}
                  onChange={handleDeadline}
                  onError={(err) => toast.error(err.toString())}
                />

                <TextField
                  multiline
                  minRows={5}
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  helperText={formik.touched.description && formik.errors.description}
                  fullWidth
                />
              </Stack>
            </DialogContent >

            <DialogActions>
              <Button variant="contained" onClick={formik.handleSubmit}>
                Submit
              </Button>
            </DialogActions>
          </>
        )
        }
      </Dialog >
    </LocalizationProvider >
  );
}
