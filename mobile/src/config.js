import Constants from "expo-constants";

const getLocalHostUrl = () => {
  const debuggerHost = Constants.manifest?.debuggerHost;
  if (!debuggerHost) {
    return null;
  }

  const host = debuggerHost.split(":")[0];
  return `http://${host}:5001/api`;
};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://wmtproject.onrender.com/api";

export const APP_NAME = "Crave Bites";
