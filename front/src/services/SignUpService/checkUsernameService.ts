// services/checkUsernameService.ts
import { ChangeEvent, KeyboardEvent, RefObject } from 'react';
import { IdCheckRequestDto } from 'utils/DtoUtil/request/auth';
import { ResponseBody } from 'utils/TypeUtil';
import { IdCheckResponseDto } from 'utils/DtoUtil/response/auth';
import { ResponseCode } from 'utils/TypeUtil/enums';
import { idCheckRequest } from 'services/Auth/authService';

export const validateUsernameFormat = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z\d]{5,20}$/;
  return usernameRegex.test(username);
};

export const onIdChangeHandler = (
  event: ChangeEvent<HTMLInputElement>,
  setUsername: (username: string) => void,
  setIdMessage: (message: string) => void,
  setIdCheck: (check: boolean) => void,
  setIdError: (error: boolean) => void // 추가
) => {
  const { value } = event.target;
  setUsername(value);
  setIdMessage('');
  setIdCheck(false);
  setIdError(!validateUsernameFormat(value)); // 형식 유효성 검사
};

export const onIdKeyDownHandler = (
  event: KeyboardEvent<HTMLInputElement>,
  onIdButtonClickHandler: () => void
) => {
  if (event.key !== 'Enter') return;
  onIdButtonClickHandler();
};

export const onIdButtonClickHandler = async (
  username: string,
  setIdError: (error: boolean) => void,
  setIdMessage: (message: string) => void,
  setIdCheck: (check: boolean) => void,
  usernameRef: RefObject<HTMLInputElement>,
  passwordRef: RefObject<HTMLInputElement>
) => {
  if (!validateUsernameFormat(username)) {
    setIdError(true);
    setIdMessage('아이디는 5-20자의 영어 대소문자와 숫자를 포함해야 합니다.');
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
    return;
  }

  // console.log(`onIdButtonClickHandler 아이디 도착${username}`);
  if (!username) return;
  const requestBody: IdCheckRequestDto = { id: username };
  // console.log('Request Body:', requestBody);

  try {
    const response = await idCheckRequest(requestBody);
    // console.log('Response:', response);
    idCheckResponse(response, setIdError, setIdMessage, setIdCheck, usernameRef, passwordRef);
  } catch (error) {
    // console.error('Request Failed:', error);
  }
};

const idCheckResponse = (
  responseBody: ResponseBody<IdCheckResponseDto>,
  setIdError: (error: boolean) => void,
  setIdMessage: (message: string) => void,
  setIdCheck: (check: boolean) => void,
  usernameRef: RefObject<HTMLInputElement>,
  passwordRef: RefObject<HTMLInputElement>
) => {
  if (!responseBody) return;

  const { code } = responseBody;

  switch (code) {
    case ResponseCode.VAILDATION_FAIL:
      alert('아이디를 입력하세요.');
      break;
    case ResponseCode.DUPLICATE_ID:
      setIdError(true);
      setIdMessage('이미 사용 중인 아이디입니다.');
      setIdCheck(false);
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
      break;
    case ResponseCode.DATABASE_ERROR:
      alert('데이터베이스 오류입니다.');
      break;
    case ResponseCode.SUCCEESS:
      setIdError(false);
      setIdMessage('사용 가능한 아이디입니다.');
      setIdCheck(true);
      if (passwordRef.current) {
        passwordRef.current.focus();
      }
      break;
    default:
      // console.error('Unknown response code:', code);
  }
};