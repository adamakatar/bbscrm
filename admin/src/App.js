import "./assets/Styles/style.css";
import "./assets/Styles/table.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-modern-drawer/dist/index.css";
import "react-quill/dist/quill.snow.css";
import React, { useEffect, Suspense, lazy } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BeforeLoginRoute from "./Helper/BeforeLoginRoute";
import { useSelector } from "react-redux";
import ProtectedRouter from "./Helper/ProtectedRoute";
import Loader from "./Component/Loader";
import LiquorAPA from "./pages/AgreementTemplates/LiquorAPA";
import CompanyFolderDetail from "./pages/TeamFolder/CompanyFolderDetail";
import BrokerFolderDetail from "./pages/TeamFolder/BrokerFolderDetail";
import ListingFolderDetail from "./pages/TeamFolder/ListingFolderDetail";
import NotFound from "./pages/NotFound";
import UpdatePassword from "./pages/UpdatePassword";
import EditProfile from "./pages/EditProfile";
import AdminUsers from "./pages/PlatformUsers/AdminUsers";
import GuestMessages from "./pages/GuestMessages";
import ManageAdmins from "./pages/ManageAdmins";
import { RuntimeDataProvider } from "./contexts/RuntimeDataContext";

const DraftListing = lazy(() => import("./pages/DraftListing"));
const StandardAPA = lazy(() =>
  import("./pages/AgreementTemplates/StandardAPA")
);
const ListingAPA = lazy(() => import("./pages/AgreementTemplates/ListingAPA"));
const Home = lazy(() => import("./pages/Home"));
const AddListing = lazy(() => import("./pages/AddListing"));
const TaskManagerAllProjects = lazy(() =>
  import("./pages/TaskManager/TaskManagerAllProjects")
);
const SelectedProjectTaskManager = lazy(() =>
  import("./pages/TaskManager/SelectedProjectTaskManager")
);
const TaskManagerTemplateTask = lazy(() =>
  import("./pages/TaskManager/TaskManagerTemplateTask")
);
const Calendar = lazy(() => import("./pages/Calendar"));
const EditListing = lazy(() => import("./pages/EditListing"));
const Listing = lazy(() => import("./pages/Listing"));
const Login = lazy(() => import("./pages/Login"));
const ViewListing = lazy(() => import("./pages/ViewListing"));
const ViewInterest = lazy(() => import("./pages/ViewInterest"));
const TeamFolder = lazy(() => import("./pages/TeamFolder"));
const Conversation = lazy(() => import("./pages/Conversation"));
const ConversationNew = lazy(() => import("./pages/Conversation/index-new"));
const Email = lazy(() => import("./pages/Email"));
const Marketing = lazy(() => import("./pages/Marketing"));
const Messages = lazy(() => import("./pages/Messages"));
const Interests = lazy(() => import("./pages/Interests"));
const EditInterestsProfile = lazy(() => import("./pages/Interests/EditProfile"));
const ContactUs = lazy(() => import("./pages/WebsiteForms/ContactUs"));
const FreeEvaluation = lazy(() =>
  import("./pages/WebsiteForms/FreeEvaluation")
);
const PrefferedBusiness = lazy(() =>
  import("./pages/WebsiteForms/PrefferedBusiness")
);
const PrefferedBusinessDetail = lazy(() =>
  import("./pages/WebsiteForms/PrefferedBusinessDetail")
);
const AllUser = lazy(() => import("./pages/PlatformUsers/AllUser"));
const AllBroker = lazy(() => import("./pages/PlatformUsers/AllBroker"));
const BrokerDetail = lazy(() => import("./pages/PlatformUsers/BrokerDetail"));
const UserDetail = lazy(() => import("./pages/PlatformUsers/UserDetail"));
const TaskManagerAllTemplates = lazy(() =>
  import("./pages/TaskManager/TaskManagerAllTemplates")
);
const ViewTeamFolderDetail = lazy(() =>
  import("./pages/TeamFolder/ViewTeamFolderDetail")
);
const OutsideUsers = lazy(() => import("./pages/PlatformUsers/OutsideUsers"));
const OutsideUserDetail = lazy(() =>
  import("./pages/PlatformUsers/OutsideUserDetail")
);
const Reports = lazy(() => import("./pages/Reports"));
const Groups = lazy(() => import("./pages/Groups"));

const BuyABusiness = lazy(() => import("./pages/Cms/BuyABusiness"));

// Cruds Routes
const Categories = lazy(() => import("./pages/Cruds/Categories"));

function App() {
  const {
    user,
  } = useSelector((state) => state.authReducer);
  const { hasNotification } = useSelector((state) => state.commonReducer);
  const isAdmin = !user?.role?.includes("broker");
  const isBroker = user?.role?.includes("broker");
  const isOnlySuperAdmin = user?.role?.includes('super-admin');
  const isAllowCMS = user?.role?.some((item) =>
    ["admin", "executive"]?.includes(item)
  );

  useEffect(() => {
    const updateFavicon = () => {
      const favicon = document.querySelector('link[rel="icon"]');
      const badgeIconURL = hasNotification ? "/favicon1.png" : "/favicon.png";
      favicon.href = badgeIconURL;
    };

    updateFavicon(); // Call the function when 'hasNotifications' changes
  }, [hasNotification]);

  return (
    <RuntimeDataProvider>
      <ToastContainer />

      <BrowserRouter>
        <Suspense fallback={<Loader className={"mvh-100"} />}>
          <Routes>
            <Route
              path="/login"
              exact
              element={<BeforeLoginRoute element={<Login />} />}
            />
            <Route
              path="/"
              exact
              element={<ProtectedRouter element={<Home />} />}
            />
            <Route
              path="/listings"
              exact
              element={<ProtectedRouter element={<Listing />} />}
            />

            <Route
              path="/reports"
              exact
              element={<ProtectedRouter element={<Reports />} />}
            />
            <Route
              path="/conversation/:slug?"
              exact
              element={<ProtectedRouter element={<Conversation />} />}
            />
            <Route
              path="/conversation-new"
              exact
              element={<ProtectedRouter element={<ConversationNew />} />}
            />
            <Route
              path="/reports"
              exact
              element={<ProtectedRouter element={<Reports />} />}
            />
            {/* {isAdmin && ( */}
            <Route
              path="/add-listing"
              exact
              element={<ProtectedRouter element={<AddListing />} />}
            />
            <Route
              path="/edit-listing/:slug"
              exact
              element={<ProtectedRouter element={<EditListing />} />}
            />
            <Route
              path="/draft-listings"
              exact
              element={<ProtectedRouter element={<DraftListing />} />}
            />
            {/* )} */}
            <Route
              path="/view-listing/:slug"
              exact
              element={<ProtectedRouter element={<ViewListing />} />}
            />
            <Route
              path="/task-manager"
              exact
              element={<ProtectedRouter element={<TaskManagerAllProjects />} />}
            />
            <>
              <Route
                path="/all-template"
                exact
                element={
                  <ProtectedRouter element={<TaskManagerAllTemplates />} />
                }
              />
              <Route
                path="/template-task/:slug"
                exact
                element={
                  <ProtectedRouter element={<TaskManagerTemplateTask />} />
                }
              />
            </>
            <Route
              path="/task-manager/:slug"
              exact
              element={
                <ProtectedRouter element={<SelectedProjectTaskManager />} />
              }
            />
            <Route
              path="/calendar"
              exact
              element={<ProtectedRouter element={<Calendar />} />}
            />
            <Route
              path="/view-interest/:id"
              exact
              element={<ProtectedRouter element={<ViewInterest />} />}
            />
            <Route
              path="/interests"
              exact
              element={<ProtectedRouter element={<Interests />} />}
            />
            <Route
              path="/team-folder"
              exact
              element={<ProtectedRouter element={<TeamFolder />} />}
            />
            <Route
              path="/team-folder/company/:id"
              exact
              element={<ProtectedRouter element={<CompanyFolderDetail />} />}
            />
            <Route
              path="/team-folder/:id"
              exact
              element={<ProtectedRouter element={<ViewTeamFolderDetail />} />}
            />
            <Route
              path="/team-folder/broker/:id"
              exact
              element={<ProtectedRouter element={<BrokerFolderDetail />} />}
            />
            <Route
              path="/team-folder/listing/:id"
              exact
              element={<ProtectedRouter element={<ListingFolderDetail />} />}
            />
            <Route
              path="/email"
              exact
              element={<ProtectedRouter element={<Email />} />}
            />
            <Route
              path="/email-templates"
              exact
              element={<ProtectedRouter element={<Marketing />} />}
            />
            <Route
              path="/messages"
              exact
              element={<ProtectedRouter element={<Messages />} />}
            />

            <Route
              path="/contact-us"
              exact
              element={<ProtectedRouter element={<ContactUs />} />}
            />
            {isAdmin && (
              <>
                <Route
                  path="/free-evaluation"
                  exact
                  element={<ProtectedRouter element={<FreeEvaluation />} />}
                />
                <Route
                  path="/preferred-business"
                  exact
                  element={<ProtectedRouter element={<PrefferedBusiness />} />}
                />
                <Route
                  path="/preferred-business/:id"
                  exact
                  element={
                    <ProtectedRouter element={<PrefferedBusinessDetail />} />
                  }
                />

                <Route
                  path="/all-user"
                  exact
                  element={<ProtectedRouter element={<AllUser />} />}
                />
                <Route
                  path="/user-detail/:slug"
                  exact
                  element={<ProtectedRouter element={<UserDetail />} />}
                />
                <Route
                  path="/all-broker"
                  exact
                  element={<ProtectedRouter element={<AllBroker />} />}
                />
                <Route
                  path="/broker-detail/:slug"
                  exact
                  element={<ProtectedRouter element={<BrokerDetail />} />}
                />
                <Route
                  path="/outside-users"
                  exact
                  element={<ProtectedRouter element={<OutsideUsers />} />}
                />
                <Route
                  path="/admin-users"
                  exact
                  element={<ProtectedRouter element={<AdminUsers />} />}
                />
                {/* same route for two pages for admin roles and outside user roles */}
                <Route
                  path="/admin-user-detail/:slug"
                  exact
                  element={
                    <ProtectedRouter
                      element={
                        <OutsideUserDetail title={"Admin User Detail"} />
                      }
                    />
                  }
                />
                <Route
                  path="/outside-user-detail/:slug"
                  exact
                  element={<ProtectedRouter element={<OutsideUserDetail />} />}
                />

                <Route
                  path="/free-evaluation"
                  exact
                  element={<ProtectedRouter element={<FreeEvaluation />} />}
                />
                <Route
                  path="/preferred-business"
                  exact
                  element={<ProtectedRouter element={<PrefferedBusiness />} />}
                />
                <Route
                  path="/preferred-business/:id"
                  exact
                  element={
                    <ProtectedRouter element={<PrefferedBusinessDetail />} />
                  }
                />
                {/* cms and cruds */}

                {isAllowCMS && (
                  <>
                    <Route
                      path="/categories"
                      exact
                      element={<ProtectedRouter element={<Categories />} />}
                    />
                    {/* <Route
                      path="/faqs"
                      exact
                      element={<ProtectedRouter element={<Faqs />} />}
                    />
                    <Route
                      path="/reviews"
                      exact
                      element={<ProtectedRouter element={<HomeReviews />} />}
                    />
                    <Route
                      path="/our-team"
                      exact
                      element={<ProtectedRouter element={<OurTeam />} />}
                    />
                    <Route
                      path="/core-values"
                      exact
                      element={<ProtectedRouter element={<CoreValues />} />}
                    /> */}

                    {/* <Route
                      path="/cms/home"
                      exact
                      element={<ProtectedRouter element={<HomeCms />} />}
                    /> */}
                    {/* <Route
                      path="/cms/about"
                      exact
                      element={<ProtectedRouter element={<AboutCms />} />}
                    /> */}

                    {/* <Route
                      path="/cms/contact-us"
                      exact
                      element={<ProtectedRouter element={<ContactUsCms />} />}
                    /> */}

                    {/* <Route
                      path="/cms/footer"
                      exact
                      element={<ProtectedRouter element={<FooterCms />} />}
                    /> */}
                    {/* <Route
                      path="/cms/sell-your-business"
                      exact
                      element={
                        <ProtectedRouter element={<SellYourBusinessCms />} />
                      }
                    /> */}

                    <Route
                      path="/cms/buy-a-business"
                      exact
                      element={<ProtectedRouter element={<BuyABusiness />} />}
                    />
                    {/* <Route
                      path="/cms/services"
                      exact
                      element={<ProtectedRouter element={<Services />} />}
                    /> */}
                    {/* <Route
                      path="/services"
                      exact
                      element={<ProtectedRouter element={<ServicesCrud />} />}
                    /> */}

                    {/* <Route
                      path="/cms/careers"
                      exact
                      element={<ProtectedRouter element={<CareerCms />} />}
                    /> */}
                  </>
                )}

                <Route
                  path="/groups"
                  exact
                  element={<ProtectedRouter element={<Groups />} />}
                />
              </>
            )}
            {isBroker && (
              <>
                <Route
                  path="/all-user"
                  exact
                  element={<ProtectedRouter element={<AllUser />} />}
                />
                <Route
                  path="/user-detail/:slug"
                  exact
                  element={<ProtectedRouter element={<UserDetail />} />}
                />
                <Route
                  path="/outside-users"
                  exact
                  element={<ProtectedRouter element={<OutsideUsers />} />}
                />
                <Route
                  path="/outside-user-detail/:slug"
                  exact
                  element={<ProtectedRouter element={<OutsideUserDetail />} />}
                />
                <Route
                  path="/all-broker"
                  exact
                  element={<ProtectedRouter element={<AllBroker />} />}
                />
                <Route
                  path="/admin-users"
                  exact
                  element={<ProtectedRouter element={<AdminUsers />} />}
                />
              </>
            )}
            <Route
              path="/agreement-templates/liquorAPA"
              exact
              element={<ProtectedRouter element={<LiquorAPA />} />}
            />
            <Route
              path="/agreement-templates/standardAPA"
              exact
              element={<ProtectedRouter element={<StandardAPA />} />}
            />
            <Route
              path="/agreement-templates/listingAPA"
              exact
              element={<ProtectedRouter element={<ListingAPA />} />}
            />
            <Route
              path="/update-password"
              exact
              element={<ProtectedRouter element={<UpdatePassword />} />}
            />
            <Route path="/update-profile" element={<EditProfile />} />
            <Route path="/update-profile/:id" element={<EditInterestsProfile />} />
            <Route
              path="/support-chat"
              element={<ProtectedRouter element={<GuestMessages />} />}
            />
            {isOnlySuperAdmin ? (
              <Route
                path="/manage-admins"
                exact
                element={<ProtectedRouter element={<ManageAdmins />} />}
              />
            ) : (
              <></>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </RuntimeDataProvider>
  );
}

export default App;
