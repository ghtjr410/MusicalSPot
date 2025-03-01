import { SignInResponseDto } from 'utils/DtoUtil/response/auth';
import React from 'react';
import { ResponseBody } from 'utils/TypeUtil';
import { getDeviceInfo } from 'utils/DeviceInfoUtil/deviceInfoUtil';
import { SignInRequestDto } from 'utils/DtoUtil/request/auth';
import { signInRequest } from 'services/Auth/authService';
// 유저네임 유효성 검사 함수
export const validateUsername = (username: string, setUsernameError: Function) => {
    const usernameError = !username ? '아이디를 입력하세요.' : '';
    setUsernameError(usernameError);
    return usernameError;
};

// 비밀번호 유효성 검사 함수
export const validatePassword = (password: string, setPasswordError: Function) => {
    const passwordError = !password ? '비밀번호를 입력하세요.' : '';
    setPasswordError(passwordError);
    return passwordError;
};

// 유저네임 입력 변경 핸들러 함수
export const handleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setUsername: Function, 
    setUsernameError: Function
) => {
    const { value } = event.target;
    setUsername(value);
    setUsernameError('');
};

// 비밀번호 입력 변경 핸들러 함수
export const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setPassword: Function, 
    setPasswordError: Function
) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordError('');
};

// 유저네임 입력 필드에서 엔터 키를 누를 때 핸들러 함수
export const handleUsernameKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>, 
    username: string, 
    setUsernameError: Function, 
    passwordRef: React.RefObject<HTMLInputElement>
) => {
    if (event.key !== 'Enter') return;
    const usernameError = validateUsername(username, setUsernameError);
    if (usernameError) return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
};

// 비밀번호 입력 필드에서 엔터 키를 누를 때 핸들러 함수
export const handlePasswordKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>, 
    handleLogin: Function
) => {
    if (event.key !== 'Enter') return;
    handleLogin();
};

// 로그인 핸들러 함수
export const handleLogin = (
    username: string, 
    password: string, 
    setUsernameError: Function, 
    setPasswordError: Function, 
    usernameRef: React.RefObject<HTMLInputElement>,
    signInResponse: (responseBody: ResponseBody<SignInResponseDto>) => void
) => {
    const usernameError = validateUsername(username, setUsernameError);
    const passwordError = validatePassword(password, setPasswordError);

    if (usernameError) {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
        return usernameError;
    }

    if (passwordError) return passwordError;
    // 여기서 서버요청해서 accesstoken이랑 refreshtoken 발급받아야함
    // console.log(`${username} - ${password}`);
    // console.log(getDeviceInfo())

    //////////////////////////////////////////////////
    const id:string = username;

    const requestBody: SignInRequestDto = {
        id,
        password,
        deviceInfo: getDeviceInfo(),
        ipAddress: '' };
        // console.log(requestBody);

    signInRequest(requestBody).then(signInResponse);
    return null;
};



/////////////////////////////////////////////////////

