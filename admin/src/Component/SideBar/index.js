import React, { useState } from "react";
import classes from "./SideBar.module.css";
import { HiOutlineClipboardList } from "react-icons/hi";
import { VscGraph, VscListUnordered } from "react-icons/vsc";
import { NavigateBefore } from "@mui/icons-material";
import { CgTemplate } from "react-icons/cg";
import {
  AiOutlineMail,
  AiOutlineQuestionCircle,
  AiOutlineHome,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FiHome, FiMail, FiInfo } from "react-icons/fi";
import {
  IoChatbubbleEllipsesOutline,
  IoReaderOutline,
  IoBriefcaseOutline,
} from "react-icons/io5";
import { BsCalendar4, BsFolder, BsCart2 } from "react-icons/bs";
import {
  BiCategoryAlt,
  BiMessageDots,
  BiCommentDetail,
  BiChat,
} from "react-icons/bi";
import { GiAtomCore } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiDraftLine,
  RiTeamLine,
} from "react-icons/ri";
import {
  MdOutlineContacts,
  MdOutlineFeaturedPlayList,
  MdOutlineAssignment,
  MdGroups,
  MdMiscellaneousServices,
  MdOutlineSell,
} from "react-icons/md";
import { TiPrinter } from "react-icons/ti";
import { CgUserList } from "react-icons/cg";
import { Logo, ConversationIcon } from "../../constant/imagePath";
import { Box, Stack, Typography } from "@mui/material";
import useRuntimeData from '../../hooks/useRuntimeData';

const RenderItem = ({ icon, title, subMenu = [], path }) => {
  const navigate = useNavigate();
  const active = useLocation()?.pathname;
  const [subnav, setSubnav] = useState(false);
  const subActive = subMenu.find((item, index) => item?.path == active);
  const showSubnav = () => setSubnav(!subnav);
  return (
    <>
      <Link
        className={[
          classes?.listItemContainer,
          path == active ? classes?.active : classes?.inactive,
          subActive && classes?.subActive,
          subnav && classes?.marginZero,
        ].join(" ")}
        to={subMenu?.length > 0 ? "#" : path}
        onClick={() => {
          if (subMenu?.length > 0) {
            showSubnav(!subnav);
          }
        }}
      >
        {icon}
        <span>{title}</span>
        {subMenu?.length > 0 &&
          (subnav ? (
            <RiArrowUpSFill
              size={20}
              color={"white"}
              className={classes?.dropDownIcon}
            />
          ) : (
            <RiArrowDownSFill
              size={20}
              color={"white"}
              className={classes?.dropDownIcon}
            />
          ))}
      </Link>
      {subnav &&
        subMenu.map((item, index) => {
          return (
            <Link
              className={[
                classes?.innerItemContainer,
                item?.path == active && classes?.active,
              ].join(" ")}
              key={index}
              to={item?.path}
            >
              {item?.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
    </>
  );
};

const SideBar = ({ toggleDrawer, isMobile, isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { unreadCallCount, unreadSMSCount, unreadEmailCount } = useRuntimeData();

  const { user: userData, fcmToken } = useSelector(
    (state) => state?.authReducer
  );
  const isBroker = userData?.role?.includes("broker");
  const isOnlyAdmin = userData?.role?.some((item) => ["admin"].includes(item));
  const isAdmin = !userData?.role?.includes("broker");
  const isOnlySuperAdmin = userData?.role?.includes('super-admin');

  return (
    <div className={classes?.mainContainer}>
      <div className={classes?.logoContainer}>
        <img src={Logo} alt="logo" />
      </div>
      <div className={classes.itemsContainer}>
        <RenderItem
          icon={<FiHome size={20} color={"var(--sidebar-text-color)"} />}
          title={"Home"}
          path={"/"}
        />
        <RenderItem
          icon={
            <HiOutlineClipboardList
              size={20}
              color={"var(--sidebar-text-color)"}
            />
          }
          title={"Task Manager"}
          subMenu={[
            {
              label: "Projects",
              path: "/task-manager",
              icon: <FiMail size={18} color={"var(--sidebar-text-color)"} />,
            },
            {
              label: "Templates",
              path: "/all-template",
              icon: (
                <BsCalendar4 size={18} color={"var(--sidebar-text-color)"} />
              ),
            },
          ]}
        />
        {/* <RenderItem
          icon={<IoChatbubbleEllipsesOutline size={20} color={"var(--sidebar-text-color)"} />}
          title={"Conversation"}
          path={"/conversation"}
        /> */}
        <Box position="relative">
          <RenderItem
            icon={
              <img src={ConversationIcon} alt="conversation" width={20} />
            }
            title={"Conversations"}
            subMenu={[
              {
                label: "Conversations",
                path: "/conversation",
                icon: (
                  <IoChatbubbleEllipsesOutline
                    size={20}
                    color={"var(--sidebar-text-color)"}
                  />
                ),
              },
              {
                label: "Messages",
                path: "/messages",
                icon: (
                  <IoChatbubbleEllipsesOutline
                    size={18}
                    color={"var(--sidebar-text-color)"}
                  />
                ),
              },
            ]}
          />

          {unreadCallCount + unreadEmailCount + unreadSMSCount > 0 ? (
            <Stack
              bgcolor="white"
              borderRadius={9999}
              right={0}
              top={0}
              position="absolute"
              width={20}
              height={20}
              alignItems="center"
              justifyContent="center"
            >
              <Typography component="span" color="primary" fontSize={12}>
                {unreadCallCount + unreadEmailCount + unreadSMSCount}
              </Typography>
            </Stack>
          ) : (
            <></>
          )}
        </Box>

        {!isBroker && (
          <>
            <RenderItem
              icon={
                <MdOutlineFeaturedPlayList
                  size={20}
                  color={"var(--sidebar-text-color)"}
                />
              }
              title={"Website Forms"}
              subMenu={[
                {
                  label: "Contact Us",
                  path: "/contact-us",
                  icon: (
                    <MdOutlineContacts
                      size={18}
                      color={"var(--sidebar-text-color)"}
                    />
                  ),
                },
                {
                  label: "Valuation",
                  path: "/free-evaluation",
                  icon: (
                    <CgUserList size={18} color={"var(--sidebar-text-color)"} />
                  ),
                },
                // {
                //   label: "Preferred Business",
                //   path: "/preferred-business",
                //   icon: (
                //     <TiPrinter size={18} color={"var(--sidebar-text-color)"} />
                //   ),
                // },
              ]}
            />
            {/* {isAdmin && (
              <RenderItem
                icon={
                  <HiOutlineUserGroup
                    size={20}
                    color={"var(--sidebar-text-color)"}
                  />
                }
                title={"Contacts"}
                subMenu={[
                  {
                    label: "Brokers",
                    path: "/all-broker",
                    icon: (
                      <FiUsers size={18} color={"var(--sidebar-text-color)"} />
                    ),
                  },
                  {
                    label: "Buyer/Seller",
                    path: "/all-user",
                    icon: (
                      <FiUsers size={18} color={"var(--sidebar-text-color)"} />
                    ),
                  },
                  {
                    label: "Admin Users",
                    path: "/admin-users",
                    icon: (
                      <FiUsers size={18} color={"var(--sidebar-text-color)"} />
                    ),
                  },
                  {
                    label: "Outside Users",
                    path: "/outside-users",
                    icon: (
                      <FiUsers size={18} color={"var(--sidebar-text-color)"} />
                    ),
                  },
                ]}
              />
            )} */}
          </>
        )}

        {/* {isBroker && (
          <RenderItem
            icon={
              <HiOutlineUserGroup
                size={20}
                color={"var(--sidebar-text-color)"}
              />
            }
            title={"Contacts"}
            subMenu={[
              {
                label: "Buyer/Seller",
                path: "/all-user",
                icon: <FiUsers size={18} color={"var(--sidebar-text-color)"} />,
              },

              {
                label: "Outside Users",
                path: "/outside-users",
                icon: <FiUsers size={18} color={"var(--sidebar-text-color)"} />,
              },
              {
                label: "Brokers",
                path: "/all-broker",
                icon: <FiUsers size={18} color={"var(--sidebar-text-color)"} />,
              },
              {
                label: "Admin Users",
                path: "/admin-users",
                icon: <FiUsers size={18} color={"var(--sidebar-text-color)"} />,
              },
            ]}
          />
        )} */}

        <RenderItem
          icon={<CgTemplate size={20} color={"var(--sidebar-text-color)"} />}
          title={"Templates"}
          subMenu={[
            {
              label: "Emails",
              path: "/email-templates",
              icon: (
                <AiOutlineMail size={18} color={"var(--sidebar-text-color)"} />
              ),
            },
          ]}
        />

        {/* <RenderItem
          icon={
            <VscListUnordered size={20} color={"var(--sidebar-text-color)"} />
          }
          title={"Listings"}
          path={"/listings"}
        /> */}
        <RenderItem
          icon={
            <VscListUnordered size={20} color={"var(--sidebar-text-color)"} />
          }
          title={"Listings"}
          subMenu={[
            {
              label: "Listings",
              path: "/listings",
              icon: (
                <VscListUnordered
                  size={20}
                  color={"var(--sidebar-text-color)"}
                />
              ),
            },
            {
              label: "Draft Listings",
              path: "/draft-listings",
              icon: (
                <RiDraftLine size={20} color={"var(--sidebar-text-color)"} />
              ),
            },
          ]}
        />

        {!isBroker && (
          <RenderItem
            icon={<MdGroups size={20} color={"var(--sidebar-text-color)"} />}
            title={"Groups"}
            path={"/groups"}
          />
        )}
        <RenderItem
          icon={
            <HiOutlineClipboardList
              size={20}
              color={"var(--sidebar-text-color)"}
            />
          }
          title={"Interests"}
          path={"/interests"}
        />
        <RenderItem
          icon={<BsFolder size={20} color={"var(--sidebar-text-color)"} />}
          title={"Data Rooms"}
          path={"/team-folder"}
        />

        <RenderItem
          icon={<VscGraph size={20} color={"var(--sidebar-text-color)"} />}
          title={"Reports"}
          path={"/reports"}
        />
        {userData?.role?.some((item) =>
          ["executive", "admin"].includes(item)
        ) && (
            <RenderItem
              icon={
                <BiCategoryAlt size={20} color={"var(--sidebar-text-color)"} />
              }
              title={"CMS"}
              subMenu={[
                // {
                //   label: "Home",
                //   path: "/cms/home",
                //   icon: (
                //     <AiOutlineHome
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
                // {
                //   label: "Contact Us",
                //   path: "/cms/contact-us",
                //   icon: (
                //     <BiMessageDots
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
                // {
                //   label: "Services",
                //   path: "/cms/services",
                //   icon: (
                //     <MdMiscellaneousServices
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
                // {
                //   label: "About Us",
                //   path: "/cms/about",
                //   icon: <FiInfo size={18} color={"var(--sidebar-text-color)"} />,
                // },
                // {
                //   label: "Careers",
                //   path: "/cms/careers",
                //   icon: (
                //     <IoBriefcaseOutline
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
                {
                  label: "Buy A Business",
                  path: "/cms/buy-a-business",
                  icon: <BsCart2 size={18} color={"var(--sidebar-text-color)"} />,
                },
                // {
                //   label: "Sell your Business",
                //   path: "/cms/sell-your-business",
                //   icon: (
                //     <MdOutlineSell
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
                // {
                //   label: "Footer",
                //   path: "/cms/footer",
                //   icon: (
                //     <MdOutlineAssignment
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
              ]}
            />
          )}

        {/* Cruds */}
        {userData?.role?.some((item) =>
          ["executive", "admin"].includes(item)
        ) && (
            <RenderItem
              icon={
                <IoReaderOutline size={20} color={"var(--sidebar-text-color)"} />
              }
              title={"CRUDS"}
              subMenu={[
                // {
                //   label: "Services",
                //   path: "/services",
                //   icon: (
                //     <MdMiscellaneousServices
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
                // {
                //   label: "Faqs",
                //   path: "/faqs",
                //   icon: (
                //     <AiOutlineQuestionCircle
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
                {
                  label: "Categories",
                  path: "/categories",
                  icon: (
                    <BiCategoryAlt
                      size={18}
                      color={"var(--sidebar-text-color)"}
                    />
                  ),
                },
                // {
                //   label: "Core Values",
                //   path: "/core-values",
                //   icon: (
                //     <GiAtomCore size={18} color={"var(--sidebar-text-color)"} />
                //   ),
                // },
                // {
                //   label: "Our Team",
                //   path: "/our-team",
                //   icon: (
                //     <RiTeamLine size={18} color={"var(--sidebar-text-color)"} />
                //   ),
                // },
                // {
                //   label: "Reviews",
                //   path: "/reviews",
                //   icon: (
                //     <BiCommentDetail
                //       size={18}
                //       color={"var(--sidebar-text-color)"}
                //     />
                //   ),
                // },
              ]}
            />
          )}

        {!isBroker && (
          <RenderItem
            icon={<BiChat size={20} color={"var(--sidebar-text-color)"} />}
            title={"Support Chat"}
            path={"/support-chat"}
          />
        )}
        {/*isOnlySuperAdmin ? (
          <RenderItem
            icon={<AiOutlineUserAdd size={20} color={"var(--sidebar-text-color)"} />}
            title={"Manage Admins"}
            path={"/manage-admins"}
          />
        ) : (
          <></>
        )*/}
      </div>
    </div>
  );
};

export default SideBar;
