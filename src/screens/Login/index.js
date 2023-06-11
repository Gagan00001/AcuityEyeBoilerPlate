import React, { useCallback, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import moment from "moment";
import get from "lodash/get";
import { Form as AntdForm } from "antd";
import CryptoJS from "crypto-js";

import Form from "../../components/Form";
import Image from "../../components/Image";
import Error from "../../components/Error";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import Input from "../../components/Form/Input";
import Notification from "../../components/Notification";

import { apiUrls } from "../../api/constants";
import { formId, UiRoutes } from "../../lib/constants";
import formFieldValuesParser from "../../lib/formFieldValuesParser";

import "./login.scss";
import useRedirect from "../../hooks/useRedirect";

const loginEncryptData = (data) => {
  const key = CryptoJS.enc.Utf8.parse("9882252788320914");
  const iv = CryptoJS.enc.Utf8.parse("6620025811581602");
  return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

const parser = (data) => {
  const { email } = data;
  const splittedEmail = email.split("@");
  if (splittedEmail.length > 1) {
    return formFieldValuesParser(
      {
        ...data,
        email: loginEncryptData(data?.email),
        password: loginEncryptData(data?.password),
        Offset: loginEncryptData(moment().utcOffset()),
      },
      {
        toBeRemove: ["captchaFormItem"],
      }
    );
  }
  return formFieldValuesParser(
    {
      ...data,
      email: loginEncryptData(`${splittedEmail[0]}@acuityeyegroup.com`),
      password: loginEncryptData(data?.password),
    },
    {
      toBeRemove: ["captchaFormItem"],
    }
  );
};

function Login(props) {
  // const {
  //   getEnums,
  //   setCurrentUserData,
  //   clearLogin,
  //   updateUserSettingsData,
  //   logoutUser,
  // } = props;

  const [form] = AntdForm.useForm();
  const [isLoggedIn, setLoggedIn] = useState(true);
  const { push } = useRedirect();

  const onRequestComplete = useCallback(({ response }) => {
    if (!response.alreadyTokenExist) {
      if (response.accessToken) {
        setLoggedIn(true);
        const token = get(response, "response.accessToken");
        localStorage.setItem("token", token);
        push("/sampleForm");
      }
    } else {
      push("/sampleForm");
    }
    setLoggedIn(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoggedIn(false);
    }
  }, []);

  const onSubmit = useCallback((data) => {
    setLoggedIn(true);
    return parser(data);
  }, []);

  const onRequestFail = useCallback((messages) => {
    setLoggedIn(false);
    Notification({ message: <Error messages={messages} /> });
  }, []);

  return (
    <>
      {isLoggedIn && <Loader />}
      <div className="login-wrap">
        <div className="login-section">
          <div className="login-logo">
            <Image name="login-logo.png" alt="logo" />
          </div>
          <div className="shadow-bbg-1" />
          <div className="shadow-bbg-2" />
          <div className="login-alignment">
            <div className="login-field-wrap">
              <h1>Login to Healthcare</h1>
              <Form
                shouldShowLoader={false}
                form={form}
                section
                formId={formId.LOGIN_FORM}
                url={apiUrls.LOGIN}
                onRequestComplete={onRequestComplete}
                parser={onSubmit}
                onRequestFail={onRequestFail}
              >
                <Input
                  placeholder="Email"
                  label="Email"
                  required
                  labelSpan={0}
                  inputSpan={24}
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "Please enter the valid email-id",
                    },
                  ]}
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Password"
                  required
                  name="password"
                  labelSpan={0}
                  inputSpan={24}
                  applyValidation={false}
                  showInputTooltip={false}
                />
                <Button
                  className="btn btn-success btn-block"
                  data-testid="loginBtn"
                  type="submit"
                >
                  Login
                </Button>
              </Form>
              <Link to={UiRoutes.forgotPassword} className="forget-pass">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// const mapDispatchToProps = (dispatch) => ({
//   getEnums: () => dispatch(getEnumData()),
//   setCurrentUserData: (response, token) =>
//     dispatch(setCurrentData(response, token)),
//   clearLogin: () => dispatch(clearLoginData()),
//   logoutUser: () => dispatch(logout("REQUEST_CANCELLED_SESSION_TIMEOUT")),
//   updateUserSettingsData: (userData) => {
//     const settings = {
//       defaultProviders: { doctor: userData?.providerId },
//       defaultLocations: { location: userData?.locationId },
//     };
//     dispatch(updateUserSettings(settings));
//   },
// });

// export default connect(null, mapDispatchToProps)(Login);

export default Login;
