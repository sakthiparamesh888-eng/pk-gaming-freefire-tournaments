import OneSignal from 'react-onesignal';

export async function initOneSignal() {
  await OneSignal.init({
    appId: "57c0366b-731d-43a5-bb8b-946524660701",
    safari_web_id: "",
    allowLocalhostAsSecureOrigin: true,
    notifyButton: { enable: false },
  });

  // Ask user for notification permission
  OneSignal.showSlidedownPrompt();
}
