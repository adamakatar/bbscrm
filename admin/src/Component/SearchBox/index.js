import React from 'react';
import { Card, InputGroup, Form, DropdownButton, Dropdown, ListGroup } from 'react-bootstrap';
import Contact from '../../pages/Conversation/Contact';
import { useSelector } from 'react-redux';

const DropdownItemComponent = ({ handleDropdownClick, item }) => (
  <Dropdown.Item onClick={() => handleDropdownClick(item.value)}>
    {item.label}
  </Dropdown.Item>
);

const UserListItem = ({ user, index, handleUserClick, callStyles }) => {
  const { user: loggedUser } = useSelector(
    (state) => state?.authReducer
  );

  const isUnRead = !user.readUserIds.includes(loggedUser._id);
  return (
    <ListGroup.Item
      key={user._id}
      style={index % 2 === 0 ? callStyles.itemOutgoing : callStyles.itemIncoming}
      onClick={() => handleUserClick(user)}
    >
      <Form.Check
        inline
        label={<Contact name={user.firstName + " " + user.lastName} isUnRead={isUnRead} />}
        name="search-check"
        type="radio"
        id={`inline-radio-${index + 1}`}
      />
    </ListGroup.Item>
  );
}

const UserList = ({ filteredUsers, handleUserClick, callStyles }) => (
  <ListGroup style={callStyles.scrollableList}>
    {filteredUsers && filteredUsers.map((user, index) => 
      <UserListItem 
        user={user} 
        index={index} 
        handleUserClick={handleUserClick} 
        callStyles={callStyles} 
      />
    )}
  </ListGroup>
);

function SearchBox({ 
  setSearchTerm, 
  handleDropdownClick, 
  filteredUsers, 
  handleUserClick, 
  classes, 
  callStyles
}) {
  const dropdownItems = [
    { value: 'all', label: 'All' },
    { value: 'broker', label: 'Brokers' },
    { value: 'buyer/seller', label: 'Buyer/Seller' },
    { value: 'admin', label: 'Admin User' },
    { value: 'outside-user', label: 'Outside User' },
    { value: 'unread', label: 'Unread' }
  ];

  return (
    <Card className={classes.search_box}>
      <Card.Body>
        <InputGroup className="mb-3">
          <Form.Control
            aria-label="Search"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownButton
            variant="outline-secondary"
            title=""
            id="input-group-dropdown-2"
            align="end"
          >
            {dropdownItems.map(item => 
              <DropdownItemComponent 
                handleDropdownClick={handleDropdownClick} 
                item={item} 
              />
            )}
          </DropdownButton>
        </InputGroup>
        <UserList 
          filteredUsers={filteredUsers} 
          handleUserClick={handleUserClick} 
          callStyles={callStyles} 
        />
      </Card.Body>
    </Card>
  );
}

export default SearchBox;
