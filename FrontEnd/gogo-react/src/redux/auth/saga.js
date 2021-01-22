import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../helpers/Firebase';
import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from '../actions';

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
} from './actions';

import { adminRoot, currentUser } from '../../constants/defaultValues';
import { setCurrentUser } from '../../helpers/Utils';
import axiosInstance from '../../helpers/axiosInstance';

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (
  customer_email,
  customer_password,
  using_google
) => {
  try {
    const values = { customer_email, customer_password, using_google };
    const result = await axiosInstance.post('/tutor/users/login', { values });
    return result.data;
  } catch (err) {
    try {
      const result = err.response;
      return result;
    } catch (error) {
      return error;
    }
  }
};

function* loginWithEmailPassword({ payload }) {
  const {
    customer_email,
    customer_password = '',
    using_google = false,
  } = payload.user.values;
  const { history, toggleClick } = payload.user;
  // console.log(payload);
  try {
    const loginUser = yield call(
      loginWithEmailPasswordAsync,
      customer_email,
      customer_password,
      using_google
    );
    console.log(loginUser);
    if (loginUser.success) {
      const item = { uid: loginUser.token, user: loginUser.user };
      setCurrentUser(item);
      yield put(loginUserSuccess(item));
      history.push('/app/mydashboard');
    } else {
      toggleClick();
      yield put(loginUserError(loginUser.error));
    }
  } catch (error) {
    toggleClick();
    yield put(
      loginUserError(
        JSON.stringify(error) || 'Unable to proceed..Please Try Again'
      )
    );
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (values) => {
  try {
    const result = await axiosInstance.post('/tutor/users', { values });
    return result.data;
  } catch (error) {
    try {
      const result = error.response;
      return result;
    } catch (err) {
      return err;
    }
  }
};

function* registerWithEmailPassword({ payload }) {
  // const { email, password } = payload.user;
  const { history } = payload.user;
  // console.log(payload);
  try {
    const values = payload.user.values;
    const registerUser = yield call(registerWithEmailPasswordAsync, values);
    console.log(registerUser);
    if (registerUser.success) {
      const item = { uid: registerUser.token, user: registerUser.user };
      setCurrentUser(item);
      yield put(registerUserSuccess(item));
      history.push('/app/mydashboard');
    } else {
      console.log(registerUser.error, 'here');
      try {
        yield put(registerUserError(registerUser.data.error));
      } catch (error) {
        try {
          yield put(registerUserError(registerUser.error));
        } catch (error) {
          yield put(registerUserError('Unable to proceed...please try again'));
        }
      }
    }
  } catch (error) {
    console.log(error, typeof error, error.message, JSON.stringify(error));
    yield put(
      registerUserError(
        JSON.stringify(error) || 'Unable to proceed..Please Try Again'
      )
    );
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
  await auth
    .signOut()
    .then((user) => user)
    .catch((error) => error);
  history.push(adminRoot);
};

function* logout({ payload }) {
  const { history } = payload;
  setCurrentUser();
  yield call(logoutAsync, history);
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
  try {
    const values = { email };
    const result = await axiosInstance.post('/tutor/users/forgotPassword', {
      values,
    });
    return result.data;
  } catch (error) {
    try {
      const result = error.response;
      return result;
    } catch (err) {
      return err;
    }
  }

  // return await auth
  //   .sendPasswordResetEmail(email)
  //   .then((user) => user)
  //   .catch((error) => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  // console.log(payload)
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    console.log(forgotPasswordStatus);
    if (forgotPasswordStatus.success) {
      yield put(forgotPasswordSuccess('success'));
    } else {
      yield put(forgotPasswordError(forgotPasswordStatus.data.error));
    }
  } catch (error) {
    yield put(
      forgotPasswordError(
        JSON.stringify(error) || 'Unable to proceed..Please Try Again'
      )
    );
  }
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
  try {
    const values = { email: resetPasswordCode, newPassword };
    const result = await axiosInstance.post('/tutor/users/reset-password', {
      values,
    });
    return result.data;
  } catch (error) {
    try {
      const result = error.response;
      return result;
    } catch (err) {
      return err;
    }
  }
  // return await auth
  //   .confirmPasswordReset(resetPasswordCode, newPassword)
  //   .then((user) => user)
  //   .catch((error) => error);
};

function* resetPassword({ payload }) {
  const { newPassword, resetPasswordCode } = payload;
  // console.log(payload);
  try {
    const resetPasswordStatus = yield call(
      resetPasswordAsync,
      resetPasswordCode,
      newPassword
    );
    console.log(resetPasswordStatus);
    if (resetPasswordStatus.success) {
      yield put(resetPasswordSuccess('success'));
    } else {
      yield put(resetPasswordError(resetPasswordStatus.data.error));
    }
  } catch (error) {
    yield put(
      resetPasswordError(
        JSON.stringify(error) || 'Unable to proceed..Please Try Again'
      )
    );
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgotPassword),
    fork(watchResetPassword),
  ]);
}
