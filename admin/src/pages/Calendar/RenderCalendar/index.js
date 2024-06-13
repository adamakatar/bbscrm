import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddEventModal from "../../../modals/AddEventModal";
import classes from "../Calendar.module.css";
import { apiHeader, BaseURL } from "../../../config/apiUrl";
import { Post } from "../../../Axios/AxiosFunctions";
import ViewEventModal from "../../../modals/ViewEventModal";
import Loader from "../../../Component/Loader";
import ViewAllEventModal from "../../../modals/ViewAllEvents";
import PoperComponent from "../../../Component/PopperComponent";
import PopperClasses from "../../../Component/PopperComponent/PopperComponent.module.css";

const RenderCalendar = ({
  eventsData,
  eventsDataLoading,
  getEvents,
  setEventsData,
}) => {
  const { access_token: accessToken, user } = useSelector(
    (state) => state?.authReducer
  );

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingEventLoading, setIsAddingEventLoading] = useState(false);
  // view event modal
  const [viewEventModal, setViewEventModal] = useState(false);
  const [viewEventData, setViewEventData] = useState();
  // view all events modal
  const [viewAllEventsModal, setAllViewEventsModal] = useState(false);
  const [allEventsData, setAllEventsData] = useState([]);
  const [month, setMonth] = useState(moment().format());
  // Involved Tasks
  const startDate = moment(month).startOf("month").format();
  const endDate = moment(month).endOf("month").format();
  // days count
  const daysCount = moment(startDate).daysInMonth();
  // start date
  const startOfWeek = moment(startDate).startOf("week").format();
  const startDateDiff = moment(startDate).diff(moment(startOfWeek), "day");
  // end date
  const endOfWeek = moment(endDate).endOf("week").format();
  const endDateDiff = moment(endOfWeek).diff(moment(endDate), "day");
  // popover
  const anchorRef = useRef(null);
  const [indexMap, setIndexMap] = useState(null);
  const [openPopper, setOpenPopper] = useState(false);
  // selected date
  const [selectedDate, setSelectedDate] = useState(null);

  let arrayData = Array(daysCount + startDateDiff + endDateDiff).fill(0);
  const withoutBorderIndex = [6, 13, 20, 27, 34, 41];

  const addEventClick = async (params) => {
    const url = BaseURL("events/create");
    setIsAddingEventLoading(true);
    const response = await Post(url, params, apiHeader(accessToken));
    if (response !== undefined) {
      setEventsData([...eventsData, response?.data]);
      setIsAddingEvent(false);
      toast.success("Successfully Created");
    }
    setIsAddingEventLoading(false);
  };

  useEffect(() => {
    getEvents(false, month);
  }, [month]);

  const handleToggleActionPopup = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  const handleActionClick = (flag) => {
    if (flag == "View") {
      setAllViewEventsModal(true);
    } else if (flag == "Add") {
      setIsAddingEvent(true);
    }
  };

  return (
    <>
      <style>{`
      // ${PopperClasses} popperDiv {
      //   padding:0px !important;
      // }
      `}</style>
      <div>
        {eventsDataLoading ? (
          <Loader />
        ) : (
          <div className={[classes.mainCalendarDiv]}>
            <Header
              setMonth={setMonth}
              month={month}
              setEventsData={setEventsData}
            />
            <DayName />
            <div className={classes.calendarBox}>
              {arrayData?.map((item, index) => {
                const filterEvents = eventsData?.filter(
                  (x) =>
                    moment(startDate)
                      .add(index - startDateDiff, "days")
                      .format("YYYY-MM-DD") ==
                    moment(x?.date).format("YYYY-MM-DD")
                );
                return (
                  <div
                    className={[
                      filterEvents?.length > 1
                        ? classes.multiEvents
                        : classes.DateBox,
                      moment(startDate)
                        .add(index - startDateDiff, "days")
                        .format("MMM") !== moment(startDate).format("MMM")
                        ? classes.dateDisabled
                        : "",
                    ].join(" ")}
                    style={{
                      borderRight:
                        !withoutBorderIndex.includes(index) &&
                        "1px solid #eaf0f4",
                      borderBottom: index <= 34 && "1px solid #eaf0f4",
                      cursor: "pointer",
                    }}
                    //  for popper
                    ref={index == indexMap ? anchorRef : null}
                    id="composition-button"
                    aria-controls={openPopper ? "composition-menu" : undefined}
                    aria-expanded={openPopper ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(e) => {
                      e?.stopPropagation();
                      setSelectedDate(
                        moment(startDate)
                          .add(index - startDateDiff, "days")
                          .format()
                      );
                      setAllEventsData(filterEvents);
                      setIndexMap(index);
                      setTimeout(() => {
                        handleToggleActionPopup();
                      }, 100);
                    }}
                  >
                    <span
                      className={
                        moment(startDate)
                          .add(index - startDateDiff, "days")
                          .format("MM-DD-YYYY") ===
                        moment().format("MM-DD-YYYY") && classes.todaysDate
                      }
                    >
                      {moment(startDate)
                        .add(index - startDateDiff, "days")
                        .format("D")}
                    </span>
                    {filterEvents?.length > 0 && (
                      <div className={classes.renderEventsMainDiv}>
                        {filterEvents?.map((item, index) => (
                          <RenderEvents
                            data={item}
                            onClick={(e) => {
                              e?.stopPropagation();
                              setViewEventData(item);
                              setViewEventModal(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isAddingEvent && (
        <AddEventModal
          show={isAddingEvent}
          setShow={setIsAddingEvent}
          addEventClick={addEventClick}
          loading={isAddingEventLoading}
          selectedDate={selectedDate}
        />
      )}
      {viewEventModal && (
        <ViewEventModal
          show={viewEventModal}
          setShow={setViewEventModal}
          data={viewEventData}
        />
      )}
      {viewAllEventsModal && (
        <ViewAllEventModal
          show={viewAllEventsModal}
          setShow={setAllViewEventsModal}
          eventsArray={allEventsData}
          setViewEventModal={setViewEventModal}
          setViewEventData={setViewEventData}
        />
      )}

      <PoperComponent
        handleClick={handleActionClick}
        open={openPopper}
        setOpen={setOpenPopper}
        anchorRef={anchorRef}
        data={
          moment(selectedDate)?.format("MM-DD-YYYY") <
            moment()?.format("MM-DD-YYYY")
            ? ["View"]
            : ["View", "Add"]
        }
        isCloseOnClick={false}
        placement="right-start"
      />
    </>
  );
};

const Header = ({ setMonth, month, setEventsData }) => {
  return (
    <div className={classes?.headerContainer}>
      <span className={classes?.monthName}>
        {moment(month).format("MMMM, YYYY")}
      </span>
      <div>
        <IoIosArrowBack
          onClick={() => {
            setEventsData([]);
            setMonth(moment(month).add(-1, "months").format());
          }}
          style={{
            cursor: "pointer",
          }}
        />
        <IoIosArrowForward
          onClick={() => {
            setEventsData([]);
            setMonth(moment(month).add(1, "months").format());
          }}
          style={{
            marginLeft: 12,
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

const DayName = () => {
  return (
    <div className={classes?.dayNameContainer}>
      {moment?.weekdays()?.map((item, index) => (
        <span className={[classes?.dayContainer, classes?.day].join(" ")}>
          {item[0]}
          {item[1]}
          {item[2]}
        </span>
      ))}
    </div>
  );
};

const RenderEvents = ({ data, onClick }) => {
  return (
    <div className={[classes.renderEventsDiv]}>
      <p style={{ backgroundColor: data?.color }} onClick={onClick}>
        {/* {data?.name} */}
      </p>
    </div>
  );
};

export default RenderCalendar;