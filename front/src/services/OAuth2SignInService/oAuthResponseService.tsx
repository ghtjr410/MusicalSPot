import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams }   from 'react-router-dom'
import axios from 'axios';
import { SNS_DEVICE_INFO } from 'utils/APIUrlUtil/apiUrlUtil';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';

export default function OAuth() {
    const { navigateToHome } = useNavigateHelper();
  const { token, expirationTime, refreshToken, refreshExpirationTime } = useParams();
//   console.log("여기까진옴")
  const [cookie, setCookie] = useCookies();
  const navigate = useNavigate();
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

useEffect(() => {

    
    // //////////////////////////////
    if (!token || !expirationTime || !refreshToken || !refreshExpirationTime) return;

    const accessExpires = new Date(Number(expirationTime));
    const refreshExpires = new Date(Number(refreshExpirationTime));

    setCookie('accessToken', token, { expires: accessExpires, path: '/' });
    setCookie('refreshToken', refreshToken, { expires: refreshExpires, path: '/' });

    const getDeviceInfo = () => {
        return navigator.userAgent;
    };
    const sendTokenAndDeviceInfo = async () => {
        try {
            if (isRequestInProgress) return;
            setIsRequestInProgress(true);

            const deviceInfo = getDeviceInfo();
            const params = new URLSearchParams();
            params.append('deviceInfo', deviceInfo);
            const response = await axios.post(SNS_DEVICE_INFO(), params, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Refresh-Token': refreshToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                navigateToHome();
            } else {
                // console.error('Failed to send device info');
            }
        } catch (error) {
            alert("안댐");
            // console.error('Error sending device info:', error);
        } finally {
            setIsRequestInProgress(false);
        }
    };
    sendTokenAndDeviceInfo();
}, [token, expirationTime, refreshToken, refreshExpirationTime]);

 
  return (
    <></>
  )
}
