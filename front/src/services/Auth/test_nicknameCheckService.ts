import axios from "axios";
import { NICKNAME_FIND_URL } from "utils/APIUrlUtil/apiUrlUtil";
import { getCookie } from "utils/CookieUtil/cookieUtis";

// 닉네임 있는지 확인
const findNickname = async () => {
    const result = await axios.post(NICKNAME_FIND_URL(), {}, {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    })
    .then(response => response.data)
    .catch(error => {
      // console.error('Error finding nickname', error);
      return null;
    });
    return result;
  };

// 닉네임체크
export const nicknameCheck = (onSuccess: (nickname: string) => void, onFailure: () => void) => {
    findNickname()
      .then(response => {
        if (response?.nickname) {
          onSuccess(response.nickname);
        } else {
          // console.log('Nickname not found.');
          onFailure();
        }
      })
      .catch(error => {
        // console.error('Error occurred while checking nickname', error);
        onFailure();
      });
  };
  

  