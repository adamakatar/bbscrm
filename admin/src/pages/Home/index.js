import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import classes from "./Home.module.css";
import LatestActivitiesSection from "../../Component/LatestAndEmailSection/LatestActivitiesSection";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import { Get } from "../../Axios/AxiosFunctions";
import NoData from "../../Component/NoData/NoData";
import Loader from "../../Component/Loader";
import { Button } from "../../Component/Button/Button";
import TableSkeleton from "../../Component/TableSkeleton";
import CalendarClasses from "../Calendar/Calendar.module.css";
import CalendarComponent from "../../Component/CalendarComponent";
import { setAllCommon} from "../../store/common/commonSlice";
import { MSG_ERROR } from "../../utils/contants";
import { toast } from "react-toastify";

const Home = () => {
  const { user, access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const isAdmin = !user?.role?.includes("broker");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [latestActivities, setLatestActivities] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  // dates
  // calendar events
  const [calendarEventsData, setCalendarEventsData] = useState([]);
  const [calendarEventsDataLoading, setCalendarEventsDataLoading] =
    useState(false);

  const latestActivitiesApiUrl = BaseURL(`notifications`);
  // const emailsApiUrl = BaseURL(
  //   `mails/?mood=INBOX&from=${dates[0]}&to=${dates[1]}`
  // );
  const eventsUrl = BaseURL(
    `events/calendar-of-day?offset=${moment().utcOffset()}`
  );
  const getDashboardAllApisData = async () => {
    setLoading(true);
    const [notifications, eventsLogs] = await Promise.all([
      Get(latestActivitiesApiUrl, accessToken),
      Get(`${eventsUrl}`, accessToken),
      // Get(`${emailsApiUrl}`, accessToken),
    ]);
    if (notifications !== undefined) {
      setLatestActivities(notifications?.data?.data?.notifications);
    }
    if (eventsLogs !== undefined) {
      eventsLogs?.data?.events.forEach(event => {
        event.valid = true;
        if (event.type === 'task'){
          const taskToFind = event.task._id;
          const foundStage = event.task.project.stages.find(obj => obj.tasks.includes(taskToFind));
          if (foundStage?.name === 'Completed'){
            event.valid = false;
          }
        }
      });

      eventsLogs.data.events = eventsLogs.data.events.filter(x => x.valid);
      setEventsData(eventsLogs?.data?.events);
    }
    // if (email !== undefined) {
    //   setEmails(email?.data?.data);
    // }
    setLoading(false);
  };

  const setAllData = () => {
    const isAdmin = !user?.role?.includes("broker");
    Promise.all([
      Get(BaseURL("categories/admin/all"), accessToken, false),
      Get(BaseURL("users/brokers/all"), accessToken, false),
      Get(
        BaseURL("users/admin/owner-broker?userType=seller"),
        accessToken,
        false
      ),
      Get(BaseURL("users/admin/owner-broker"), accessToken, false),
      isAdmin
        ? Get(BaseURL("business/admin/all"), accessToken, false)
        : Get(BaseURL("business/broker"), accessToken, false),
      Get(BaseURL("project-templates"), accessToken, false),
      Get(BaseURL("templates/admin/all"), accessToken, false),
    ]).then(([
      allCategories,
      allBrokers,
      allOwners,
      allUsers,
      allListing,
      allTaskManagerTemplate,
      allEmailTemplates,
    ]) => {
      dispatch(
        setAllCommon({
          allUsers: [
            ...allUsers?.data?.sellers,
            ...allUsers?.data?.brokers,
          ].filter((item) => item?._id !== user?._id),
          // allBrokers: allBrokers?.data?.data?.data.filter(
          //   (item) => item?._id !== user?._id
          // ),
          allBrokers: allBrokers?.data?.data?.data,
          allCategories: allCategories?.data?.data,
          allOwners: allOwners?.data?.sellers,
          allListing: allListing?.data?.business,
          allTaskManagerTemplate: allTaskManagerTemplate?.data?.templates,
          allEmailTemplates: allEmailTemplates?.data?.data,
        })
      );
    }).catch((error) => {
      console.log('>>>>>>>> error => ', error)
      toast.error(MSG_ERROR)
    })
  }

  useEffect(() => {
    getDashboardAllApisData();
    setAllData();
  }, []);

  const dispatch = useDispatch();

  // calendar events
  const getEvents = async (myTasks = false, month) => {
    const url = BaseURL(
      isAdmin
        ? `events/admin?date=${moment(month)
          .startOf("month")
          .format("YYYY-MM-DD")}&involvedTasks=false`
        : `events/calendar?date=${moment(month)
          .startOf("month")
          .format("YYYY-MM-DD")}`
    );
    setCalendarEventsDataLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setCalendarEventsData(response?.data?.events);
    }
    setCalendarEventsDataLoading(false);
  };

  return (
    <>
      <SideBarSkeleton>
        <style>{`
        .table100-body{
          min-height:300px;
        }
        @media (max-width:768px){
        .${CalendarClasses.DateBox},.${CalendarClasses.multiEvents} {
          height:70px !important;
          padding-top: 7px !important;
        }
        .${CalendarClasses.DateBox} span,.${CalendarClasses.multiEvents} span{
          padding-right: 4px !important;
          font-size: 11px !important;
        }
        .${CalendarClasses.renderEventsDiv} p{
          width: 14px !important;
          height: 14px !important;
        }
        .${CalendarClasses.mainCalendarDiv} {
          margin-top: 12px !important;
        }
        }
        @media screen and (max-width:1440px){
         .table100-head, .table100-body{
           width:1300px;
         }
         .table100.ver1{
           overflow-x:scroll !important;
         }
        }
    `}</style>
        <div className={classes.home_main}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Row className={classes.section1_main_row}>
                <Col lg={6}>
                  <div className={classes.main_heading}>
                    <h4>Latest Activities</h4>
                  </div>
                  <div className={classes.latestActivities_main}>
                    <div className={classes.header}></div>
                    <div className={classes.latestActivities_inner}>
                      {latestActivities !== undefined &&
                        (latestActivities?.length == 0 ? (
                          <NoData text="No Latest Activities Found" />
                        ) : (
                          <Row className={classes.latestActivities_row}>
                            {latestActivities?.map((item) => {
                              return (
                                <Col lg={12}>
                                  <LatestActivitiesSection item={item} />
                                </Col>
                              );
                            })}
                          </Row>
                        ))}
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className={classes.main_heading}>
                    <h4>Today Events</h4>
                    <Button onClick={() => navigate("/calendar")}>
                      View More
                    </Button>
                  </div>
                  <div className={classes.events}>
                    <div class="table100 ver1 m-b-110">
                      <div class="table100-head">
                        <table>
                          <thead>
                            <tr class="row100 head">
                              <th
                                class="cell100 column1"
                                style={{ width: "30%", textAlign: "left" }}
                              >
                                Name
                              </th>
                              <th
                                class="cell100 column4"
                                style={{ width: "50%", textAlign: "left" }}
                              >
                                Description
                              </th>
                              <th
                                class="cell100 column5"
                                style={{ width: "20%", textAlign: "left" }}
                              >
                                Time
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div class="table100-body js-pscroll ps ps--active-y">
                        {loading ? (
                          <TableSkeleton
                            rowsCount={recordsLimit}
                            colsCount={7}
                          />
                        ) : (
                          <table>
                            <tbody>
                              {eventsData?.length > 0 ? (
                                eventsData?.map((item, index) => (
                                  <tr class="row100 body">
                                    <td
                                      class="cell100 column1"
                                      style={{
                                        width: "30%",
                                        textAlign: "left",
                                      }}
                                    >
                                      {item?.name}
                                    </td>
                                    <td
                                      class="cell100 column4"
                                      style={{
                                        width: "50%",
                                        textAlign: "left",
                                      }}
                                    >
                                      <p
                                        className={`ellipsis1Line ${classes.para}`}
                                      >
                                        {item?.description}
                                      </p>
                                    </td>
                                    <td
                                      class="cell100 column4"
                                      style={{
                                        width: "20%",
                                        textAlign: "left",
                                      }}
                                    >
                                      {moment(item?.date)?.format(
                                        "DD MMM YYYY hh:mm a"
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <NoData text={"No Events Found"} />
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className={classes.section2_main_row}>
                <Col lg={12} className={classes.calendarCol}>
                  <CalendarComponent />
                </Col>
              </Row>
            </>
          )}
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default Home;
