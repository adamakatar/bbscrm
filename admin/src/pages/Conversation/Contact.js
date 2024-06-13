import React from 'react';
import styled from 'styled-components';

const Avatar = styled.div`
  width: 35px;
  height: 37px;
  border-radius: 50%;
  background-color: #6c63ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  background-color: ${props => props.color}
`;

const Contact = ({ name, photo, isUnRead }) => {
  const getInitials = (name) => {
    const splitName = name.toUpperCase().split(' ');
    if (splitName.length > 1) {
      return splitName[0][0] + splitName[1][0];
    }
    return splitName[0][0];
  };

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }

    return color;
    /* eslint-enable no-bitwise */
  };

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {photo ? (
        <img src={photo} alt={name} />
      ) : (
        <Avatar color={stringToColor(name)}>{getInitials(name)}</Avatar>
      )}
      <div style={{marginLeft: '10px', fontWeight: isUnRead ? 700 : 400}}>{name}</div>
    </div>
  );
};

export default Contact;