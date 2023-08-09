import { useGoogleLogin } from 'vue3-google-login';

const clientId = '94901716497-5e4cor5er6mbn82s8lv7vtup83hfrv0i.apps.googleusercontent.com';

const { signIn } = useGoogleLogin({
  clientId,
});

const onGoogleLoginSuccess = (response) => {
  console.log('Logged in with Google:', response);
};

const onGoogleLoginError = (error) => {
  console.error('Google login error:', error);
};

export { onGoogleLoginSuccess, onGoogleLoginError, signIn };
