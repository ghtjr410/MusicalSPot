import { NicknameRequestDto } from 'utils/DtoUtil/request/auth';
import { checkNicknameRequest, createNicknameRequest } from 'services/Auth/authService';
import { ResponseCode } from 'utils/TypeUtil/enums';

export const handleNicknameChange = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setNickname: React.Dispatch<React.SetStateAction<string>>, 
    setNicknameError: React.Dispatch<React.SetStateAction<string>>, 
    setErrorType: React.Dispatch<React.SetStateAction<'error' | 'success' | 'smallError'>>, 
    setIsNicknameAvailable: React.Dispatch<React.SetStateAction<boolean>>) => {
    const nickname = event.target.value;

    // Regular expression for validation: no special characters, no whitespace, length up to 6
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{1,6}$/;
    console.log(`$닉네임 패턴 결과 : ${nicknameRegex}, 현재 인풋 : ${nickname}`)
    if (!nicknameRegex.test(nickname)) {
        setNickname(nickname);
        setNicknameError('닉네임은 공백없이 1~6자 이내의 한글,영문 및 숫자만 가능합니다.');
        setErrorType('error');
        setIsNicknameAvailable(false);
    } else {
        setNickname(nickname);
        setNicknameError('');
        setErrorType('error');
        setIsNicknameAvailable(false);
    }
};

export const checkNicknameAvailability = async (nickname: string, setNicknameError: React.Dispatch<React.SetStateAction<string>>, setErrorType: React.Dispatch<React.SetStateAction<'error' | 'success' | 'smallError'>>, setIsNicknameAvailable: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        if (!nickname) {
            setNicknameError('닉네임을 입력해주세요');
            setErrorType('error');
            setIsNicknameAvailable(false);
            return;
        }
        const requestBody: NicknameRequestDto = { nickname };
        const response = await checkNicknameRequest(requestBody);
        if (response?.code === ResponseCode.SUCCEESS) {
            setNicknameError('닉네임 사용가능');
            setErrorType('success');
            setIsNicknameAvailable(true);
        } else if (response?.code === ResponseCode.DUPLICATE_ID) {
            setNicknameError('이미 존재하는 닉네임입니다.');
            setErrorType('error');
            setIsNicknameAvailable(false);
        } else {
            setNicknameError('닉네임을 입력해주세요');
            setErrorType('error');
            setIsNicknameAvailable(false);
        }
    } catch (error) {
        setNicknameError('Error checking nickname');
        setErrorType('error');
        setIsNicknameAvailable(false);
    }
};

export const handleCreateNickname = async (nickname: string, isNicknameAvailable: boolean, setNicknameError: React.Dispatch<React.SetStateAction<string>>, setErrorType: React.Dispatch<React.SetStateAction<'error' | 'success' | 'smallError'>>, setSuccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!isNicknameAvailable) {
        setNicknameError('먼저 닉네임 중복 확인을 해주세요.');
        setErrorType('error');
        return;
    }

    try {
        const requestBody: NicknameRequestDto = { nickname };
        const response = await createNicknameRequest(requestBody);
        if (response?.code === ResponseCode.SUCCEESS) {
            setSuccessModalOpen(true);  // 닉네임 생성 성공 시 모달 띄우기
        } else {
            setNicknameError('닉네임 생성 중 오류 발생');
            setErrorType('error');
        }
    } catch (error) {
        setNicknameError('닉네임 생성 중 오류 발생');
        setErrorType('error');
    }
};