import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ZoomMtg from 'react-zoomus-jssdk';

const MeetingComponent = ({ meetingNumber }) => {
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    getSignature();
  }, []);

  const getSignature = async () => {
    try {
      const { data } = await axios.get(`/meetings/${meetingNumber}/signature`);
      setSignature(data.signature);
    } catch (error) {
      console.error('Failed to get signature', error);
    }
  }

  const joinMeeting = async () => {
    ZoomMtg.init({
      leaveUrl: 'http://localhost:3000',
      isSupportAV: true,
      success: function () {
        ZoomMtg.join({
          signature,
          meetingNumber,
          userName: 'Your username',
          apiKey: 'Your API Key',
          userEmail: 'Your email',
          passWord: 'Your password',
          success: function(res){
            console.log('join meeting success');
          },
          error: function(res) {
            console.log('join meeting error');
          }
        });
      },
      error: function(res) {
        console.log('init meeting error');
      }
    });
  }

  return (
    <div>
      <button onClick={joinMeeting}>Join Meeting</button>
    </div>
  )
}

export default MeetingComponent;
