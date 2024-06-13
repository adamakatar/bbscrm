import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { AfterLoginHeader } from "../Header/AfterLoginHeader";
import SideBar from "../SideBar";
import Drawer from "react-modern-drawer";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import classes from "./SideBarSkeleton.module.css";

const SideBarSkeleton = ({ heading, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    isMobileViewHook(setIsMobile);
  }, [window.innerWidth]);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  return (
    <>
      <style>{`
        .drawerContainer{
          width:320px !important;
        }
        @media (max-width:768px){
          .drawerContainer{
            width:290px !important;
          }
        }
    `}</style>
      <Container fluid className="g-0">
        <Row className="g-0">
          <div className={[!isMobile && classes.sidebarDiv].join(" ")}>
            {!isMobile ? (
              <SideBar/>
            ) : (
              <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction="left"
                className="drawerContainer">
                <SideBar />
              </Drawer>
            )}
          </div>
          <div className={[!isMobile && classes.contentDiv].join(" ")}>
            {isMobile && (
              <GiHamburgerMenu
                className={[classes.GiHamburgerMenu]}
                onClick={() => {
                  toggleDrawer();
                }}
              />
            )}
            <AfterLoginHeader heading={heading} />
            {children}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SideBarSkeleton;
