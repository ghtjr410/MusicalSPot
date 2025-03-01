import { ChangeEvent, KeyboardEvent, RefObject } from 'react';
import { EmailCertificationRequestDto } from 'utils/DtoUtil/request/auth';
import { ResponseBody } from 'utils/TypeUtil';
import { EmailCertificationResponseDto } from 'utils/DtoUtil/response/auth';
import { ResponseCode } from 'utils/TypeUtil/enums';
import { emailCertificationRequest } from 'services/Auth/authService';

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const onEmailChangeHandler = (
  event: ChangeEvent<HTMLInputElement>,
  setEmail: (email: string) => void,
  setEmailMessage: (message: string) => void,
  setEmailError: (error: boolean) => void
) => {
  const { value } = event.target;
  setEmail(value);
  setEmailMessage('');
  setEmailError(false);
};

export const onEmailKeyDownHandler = (
  event: KeyboardEvent<HTMLInputElement>,
  onEmailButtonClickHandler: () => void
) => {
  if (event.key !== 'Enter') return;
  onEmailButtonClickHandler();
};

export const onEmailButtonClickHandler = (
  username: string,
  email: string,
  setEmailError: (error: boolean) => void,
  setEmailMessage: (message: string) => void,
  setIdError: (error: boolean) => void,
  setIdMessage: (message: string) => void,
  setIdCheck: (check: boolean) => void,
  verificationCodeRef: RefObject<HTMLInputElement>
) => {
  if (!username || !email) return;
  const checkedEmail = emailPattern.test(email);
  const id: string = username;
  if (!checkedEmail) {
    setEmailError(true);
    setEmailMessage('이메일 형식이 아닙니다.');
    return;
  }
  const requestBody: EmailCertificationRequestDto = { id, email };
  emailCertificationRequest(requestBody).then(response => emailCertificationResponse(response, setEmailError, setEmailMessage, setIdError, setIdMessage, setIdCheck, verificationCodeRef));
  setEmailError(false);
  setEmailMessage('이메일 전송중...');
};

export const emailCertificationResponse = (
  responseBody: ResponseBody<EmailCertificationResponseDto>,
  setEmailError: (error: boolean) => void,
  setEmailMessage: (message: string) => void,
  setIdError: (error: boolean) => void,
  setIdMessage: (message: string) => void,
  setIdCheck: (check: boolean) => void,
  verificationCodeRef: RefObject<HTMLInputElement>
) => {
  if (!responseBody) return;

  const { code } = responseBody;

  switch (code) {
    case ResponseCode.VAILDATION_FAIL:
      setEmailError(true);
      setIdError(true);
      setIdMessage('아이디를 입력하세요.');
      setEmailMessage('아이디와 이메일을 모두 입력하세요');
      return;
    case ResponseCode.DUPLICATE_ID:
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setEmailError(true);
      setEmailMessage('이메일 전송에 실패했습니다.');
      setIdCheck(false);
      return;
    case ResponseCode.MAIL_FAIL:
      setEmailError(true);
      setEmailMessage('이메일 전송에 실패했습니다.');
      return;
    case ResponseCode.DATABASE_ERROR:
      setEmailError(true);
      setEmailMessage('데이터베이스 오류입니다.');
      return;
    case ResponseCode.SUCCEESS:
      setEmailError(false);
      setEmailMessage('인증번호가 전송되었습니다.');
      if (verificationCodeRef.current) {
        verificationCodeRef.current.focus(); // 인증번호 입력 필드로 포커스를 이동
      }
      break;
    default:
      // console.error('Unknown response code:', code);
  }
};
