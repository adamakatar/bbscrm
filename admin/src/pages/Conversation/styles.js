export const styles = {
  itemIncoming: {
    //   display: 'flex',
    //   justifyContent: 'flex-start',
    backgroundColor: "#e6f7ff",
    borderRadius: "20px",
    padding: "10px",
    marginBottom: "10px",
    alignItems: "center",
    maxWidth: "80%",
  },
  itemOutgoing: {
    //   display: 'flex',
    //   justifyContent: 'flex-end',
    backgroundColor: "#d9f7be",
    borderRadius: "20px",
    padding: "10px",
    marginBottom: "10px",
    alignItems: "center",
    maxWidth: "80%",
  },
  conversationWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    height: "100%"
  },
  conversationWrapperOutgoing: {
    alignSelf: "flex-end",
  },
};

export const callStyles = {
  itemIncoming: {
    backgroundColor: "#e6f7ff",
    borderRadius: "20px",
    padding: "10px",
    marginBottom: "10px",
    alignItems: "center",
    maxWidth: "100%",
  },
  itemOutgoing: {
    backgroundColor: "#d9f7be",
    borderRadius: "20px",
    padding: "10px",
    marginBottom: "10px",
    alignItems: "center",
    maxWidth: "100%",
  },
  conversationWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  conversationWrapperOutgoing: {
    alignSelf: "flex-end",
  },
  scrollableList: {
    height: "450px",
    overflowY: "scroll",
    scrollbarWidth: "thin",
    scrollbarColor: "darkgrey transparent",
    "::WebkitScrollbar": {
      width: "10px",
    },
    "::WebkitScrollbarThumb": {
      backgroundColor: "darkgrey",
      borderRadius: "4px",
    },
    "::WebkitScrollbarThumb:hover": {
      backgroundColor: "grey",
    },
  },
};

export const DialStyles1 = {
  body: {
    margin: "0",
    color: "#444",
    background: "#2c3e50",
    fontFamily: "Roboto, sans-serif",
    fontSize: "18px",
    fontWeight: "300",
    lineHeight: "18px",
  },
  asterisk: {
    boxSizing: "border-box",
  },
  pullLeft: {
    float: "left",
  },
  pullRight: {
    float: "right",
  },
  clearfixAfter: {
    content: "",
    display: "table",
    clear: "both",
  },
  clearfixBefore: {
    content: "",
    display: "table",
  },
  dialPadWrap: {
    width: "590px",
    height: "500px",
    overflow: "hidden",
    position: "relative",
    margin: "50px auto 0",
    background: "#ecf0f1",
    boxShadow: "0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19)",
  },
  leftPan: {
    padding: "15px",
    top: "0",
    left: "0",
    bottom: "0",
    zIndex: "1",
    width: "255px",
    position: "absolute",
    background: "#75c4b5",
    transition: "width .4s ease-in-out 0s",
  },
  leftPanActive: {
    width: "100%",
  },
  // ... add more styles according to the same pattern ...
};


export const DialStyles = {
  body: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  contacts: {
    width: 255,
    padding: 15,
    backgroundColor: '#75c4b5',
  },
  contactsTitle: {
    textAlign: 'center',
    fontSize: 25,
    lineHeight: 1,
    color: "#eee",
    fontWeight: 400,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottom: "1px solid white"
  },
  numberList: {
    height: 380,
    overflowY: "scroll"
  },
  contactsNumber: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  dial: {
    width: "calc(100% - 255px)",
    padding: 40,
  },
  dialNumberPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  dialNumberPanelItem: {
    width: 85,
    height: 48,
    marginBottom: 20,
    marginHorizon: 2
  },

  dialNumberPanelItemMain: {
    textAlign: 'center',
    lineHeight: 0.85,
    fontSize: 28,
    color: '#444444'
  },
  dialNumberPanelItemSub: {
    textAlign: 'center',
    fontSize: 14,
    color: '#AAAAAA'
  },
  dialNumberPanelItemMainActive: {
    textAlign: 'center',
    lineHeight: 0.85,
    fontSize: 28,
    color: 'white'
  },
  dialNumberPanelItemSubActive: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white'
  },
  numberPanelEmpty: {
    display: 'hidden',
    textAlign: 'right',
    overflowX: 'hidden',
    height: 50,
    padding: "0 15px",
    fontSize: 28,
    fontWeight: 400,
    lineHeight: 50,
    marginBottom: 20
  },
  numberPanel: {
    textAlign: 'right',
    overflowX: 'hidden',
    height: 50,
    padding: "0 15px",
    fontSize: 28,
    fontWeight: 400,
    marginBottom: 20
  },
  functionButtonList: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  iconCenter: {
    width: 85,
    height: 48,
    marginBottom: 20,
    marginHorizon: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contractItem: {
      marginTop: 10,
      marginBottom: 10
  }
};

export const customStyle = {
  noteBtn: {
    width: `45%`,
  }  
}