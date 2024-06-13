import React from 'react';
import { Modal } from 'react-bootstrap';
import { BsFillTelephoneFill, BsFillBackspaceFill } from 'react-icons/bs';
import clsx from 'clsx';
import Contact from '../../pages/Conversation/Contact';

const ContactList = ({ userInfos, dialNumber, setDialNumber, classes, DialStyles }) => {
  const filteredContacts = userInfos.map(item => {
    item.contact = item.contact?.slice(0, 1) === "+" ? item.contact : `+1${item.contact}`;
    return item;
  }).filter(item => item.contact.includes(dialNumber));

  return (
    <div style={DialStyles.contacts}>
      <h1 style={DialStyles.contactsTitle}>CONTACTS</h1>
      <div style={DialStyles.numberList}>
        {filteredContacts.map(item =>
          <div key={item._id} className={classes.contractItem} onClick={() => setDialNumber(item.contact)}>
            <Contact name={item.firstName + " " + item.lastName} />
          </div>
        )}
      </div>
    </div>
  );
};

const DialPad = ({ dialNumber, keys, dialNumebrIndex, setDialNumebrIndex, onPushNumber, onFunction, classes, DialStyles }) => {
  return (
    <div style={DialStyles.dial}>
      <h4 style={dialNumber === "" ? DialStyles.numberPanelEmpty : DialStyles.numberPanel}>{dialNumber}</h4>
      <div style={DialStyles.dialNumberPanel}>
        {keys.map(item =>
          <div
            key={item._id}
            className={clsx(
              classes.dialItemCommon,
              dialNumebrIndex === item.main ? classes.dialItemActive : classes.dialItemUnActive
            )}
            style={DialStyles.dialNumberPanelItem}
            onMouseEnter={() => setDialNumebrIndex(item.main)}
            onMouseLeave={() => setDialNumebrIndex(null)}
            onClick={() => onPushNumber(item)}
          >
            <h5 style={dialNumebrIndex === item.main ? DialStyles.dialNumberPanelItemMainActive : DialStyles.dialNumberPanelItemMain}>
              {item.main}
            </h5>
            <h6 style={dialNumebrIndex === item.main ? DialStyles.dialNumberPanelItemSubActive : DialStyles.dialNumberPanelItemSub}>
              {item.sub}
            </h6>
          </div>
        )}
      </div>
      <div style={DialStyles.functionButtonList}>
        <div
          className={clsx(
            classes.dialItemCommon,
            dialNumebrIndex === 'dial' ? classes.dialItemActive : classes.dialItemUnActive
          )}
          style={DialStyles.iconCenter}
          onMouseEnter={() => setDialNumebrIndex('dial')}
          onMouseLeave={() => setDialNumebrIndex(null)}
          onClick={() => onFunction('dial')}
        >
          <BsFillTelephoneFill size={24} />
        </div>
        <div
          className={clsx(
            classes.dialItemCommon,
            dialNumebrIndex === 'back' ? classes.dialItemActive : classes.dialItemUnActive
          )}
          style={DialStyles.iconCenter}
          onMouseEnter={() => setDialNumebrIndex('back')}
          onMouseLeave={() => setDialNumebrIndex(null)}
          onClick={() => onFunction('back')}
        >
          <BsFillBackspaceFill size={24} />
        </div>
      </div>
    </div>
  );
};

function DialModal({ isOpen, close, userInfos, dialNumber, setDialNumber, keys, setDialNumebrIndex, dialNumebrIndex, onPushNumber, onFunction, classes, DialStyles }) {
  return (
    <Modal show={isOpen} onHide={close} centered>
      <Modal.Body className={classes.modalBody}>
        <div style={DialStyles.body}>
          <ContactList 
            userInfos={userInfos} 
            dialNumber={dialNumber} 
            setDialNumber={setDialNumber} 
            classes={classes} 
            DialStyles={DialStyles} 
          />
          <DialPad 
            dialNumber={dialNumber} 
            keys={keys} 
            dialNumebrIndex={dialNumebrIndex} 
            setDialNumebrIndex={setDialNumebrIndex} 
            onPushNumber={onPushNumber} 
            onFunction={onFunction} 
            classes={classes} 
            DialStyles={DialStyles} 
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DialModal;
