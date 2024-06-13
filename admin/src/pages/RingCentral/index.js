import React, { useEffect, useState } from "react";
import classes from "./RingCentral.module.css";
import { Get } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import PaginationComponent from "../../Component/PaginationComponent";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { BaseURL } from "../../config/apiUrl";
import { ringCentral } from "../../config/DummyData";
import PoperComponent from "../../Component/PopperComponent";

import { IoMdCall } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { BsChatDots } from "react-icons/bs";

import { useSelector } from "react-redux";
const RingCentral = () => {
  const token = useSelector(
    (state) => state?.authReducer?.access_token
  );

  const [ringcentral, setRingCentral] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openPopper, setOpenPopper] = useState(false);
  const anchorRef = React.useRef(null);
  const [indexMap, setIndexMap] = useState(null);
  const [getCurrentUser, setGetCurrentUser] = useState(null);

  const [btnText, setbtnText] = useState("Phone/Video");


  useEffect(() => {
    getAllRingCentral();
  }, [page]);

  const getAllRingCentral = async (type = 'phone', pg = page) => {
    const url = BaseURL("");
    setLoading(true);
    const response = await Get(url, token);
    if (response !== undefined) {
      setRingCentral(response?.data?.data);
    }
    setRingCentral(ringcentral);
    setLoading(false);
  };

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  const handleClick = (flag) => {
  };

  useEffect(() => {
    if (!openPopper) setGetCurrentUser(null);
  }, [openPopper]);
  return (
    <>
      <style>{`
    .table100-body{
      max-height:calc(100vh - 310px);
    }
    .table100-body td {
      padding-block: 25px;
    }
    `}</style>
      <div>
        <SideBarSkeleton>
          <div className={[classes.mainContainer]}>
            <div className={[classes.headerContainer]}>
              <h3>Ring Central</h3>
              <div className={[classes.buttonDiv]}>
                <Button
                  onClick={() => setbtnText("Phone/Video")}
                  label="Phone/Video"
                  className={[
                    classes.addProjectBtnTrans,
                    btnText == "Phone/Video" && classes.addProjectBtn,
                  ].join(" ")}
                />
                <Button
                  //   customStyle={
                  //     btnText == "Phone/Video" && {
                  //       backgroundColor: "var(--dashboard-main-color)",
                  //     }
                  //   }
                  onClick={() => setbtnText("Messages")}
                  label="Messages"
                  className={[
                    classes.addProjectBtnTrans,
                    btnText == "Messages" && classes.addProjectBtn,
                  ].join(" ")}
                />
                <Button
                  //   customStyle={
                  //     btnText == "Phone/Video" && {
                  //       backgroundColor: "var(--dashboard-main-color)",
                  //     }
                  //   }
                  onClick={() => setbtnText("Contacts")}
                  label="Contacts"
                  className={[
                    classes.addProjectBtnTrans,
                    btnText == "Contacts" && classes.addProjectBtn,
                  ].join(" ")}
                />
              </div>
            </div>

            <div class="table100 ver1 m-b-110">
              <div class="table100-head">
                <table>
                  <thead>
                    <tr class="row100 head">
                      <th
                        class="cell100 column1"
                        style={{ width: "20%", textAlign: "start" }}
                      >
                        Name
                      </th>
                      <th
                        class="cell100 column2"
                        style={{ width: "20%", textAlign: "start" }}
                      >
                        Phone Number
                      </th>

                      {btnText == "Contacts" && (
                        <>
                          <th
                            class="cell100 column2"
                            style={{ width: "20%", textAlign: "start" }}
                          >
                            Address
                          </th>
                          <th
                            class="cell100 column2"
                            style={{ width: "20%", textAlign: "start" }}
                          >
                            Email
                          </th>
                          <th
                            class="cell100 column2"
                            style={{ width: "20%", textAlign: "start" }}
                          >
                            Timezone
                          </th>
                        </>
                      )}

                      {(btnText == "Phone/Video" || btnText == "Messages") && (
                        <>
                          <th
                            class="cell100 column3"
                            style={{ width: "20%", textAlign: "start" }}
                          >
                            Time
                          </th>
                          {btnText == "Phone/Video" && (
                            <th
                              class="cell100 column4"
                              style={{ width: "15%", textAlign: "start" }}
                            >
                              Call Duration
                            </th>
                          )}

                          <th
                            class="cell100 column5"
                            style={{ width: "15%", textAlign: "start" }}
                          >
                            Call Log
                          </th>
                        </>
                      )}

                      <th class="cell100 column5" style={{ width: "10%" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="table100-body js-pscroll ps ps--active-y">
                <table>
                  <tbody>
                    {ringCentral.map((item, index) => (
                      <tr
                        class="row100 body"
                      // style={{
                      //   backgroundColor:
                      //     getCurrentUser?.id == item?.id && "#E5F5FF",
                      // }}
                      >
                        <td
                          class="cell100 column1"
                          style={{ width: "20%", textAlign: "start" }}
                        >
                          {item?.name}
                        </td>
                        <td
                          class="cell100 column2"
                          style={{
                            width: "20%",
                            textAlign: "start",
                          }}
                        >
                          {item?.phone}
                        </td>

                        {btnText == "Contacts" && (
                          <>
                            <td
                              class="cell100 column2"
                              style={{
                                width: "20%",
                                textAlign: "start",
                              }}
                            >
                              {item?.address}
                            </td>
                            <td
                              class="cell100 column2"
                              style={{
                                width: "20%",
                                textAlign: "start",
                              }}
                            >
                              {item?.email}
                            </td>
                            <td
                              class="cell100 column2"
                              style={{
                                width: "20%",
                                textAlign: "start",
                              }}
                            >
                              {item?.timezone}
                            </td>
                          </>
                        )}

                        {(btnText == "Phone/Video" ||
                          btnText == "Messages") && (
                            <>
                              <td
                                class="cell100 column3"
                                style={{ width: "20%", textAlign: "start" }}
                              >
                                {item?.time}
                              </td>
                              {btnText == "Phone/Video" && (
                                <td
                                  class="cell100 column4"
                                  style={{ width: "15%", textAlign: "start" }}
                                >
                                  {item?.callDuration}
                                </td>
                              )}

                              <td
                                class="cell100 column4"
                                style={{ width: "15%", textAlign: "start" }}
                              >
                                {btnText == "Phone/Video" ? (
                                  <IoMdCall className={classes.call_icon} />
                                ) : (
                                  <BsChatDots className={classes.call_icon} />
                                )}
                              </td>
                            </>
                          )}

                        <td class="cell100 column5" style={{ width: "10%" }}>
                          <div
                            ref={index == indexMap ? anchorRef : null}
                            id="composition-button"
                            aria-controls={
                              openPopper ? "composition-menu" : undefined
                            }
                            aria-expanded={openPopper ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={() => {
                              setGetCurrentUser(item);
                              setIndexMap(index);
                              setTimeout(() => {
                                handleToggle();
                              }, 100);
                            }}
                          >
                            <BsThreeDots
                              size={30}
                              className={[classes.threeDots]}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={[classes.paginationDiv]}>
              <PaginationComponent
                totalPages={4}
                currentPage={page}
                setCurrentPage={setPage}
              />
            </div>
          </div>
        </SideBarSkeleton>
      </div>

      <PoperComponent
        handleClick={handleClick}
        open={openPopper}
        setOpen={setOpenPopper}
        anchorRef={anchorRef}
        data={["Edit", "Preview", "Delete"]}
      />
    </>
  );
};

export default RingCentral;
