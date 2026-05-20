This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Backend API (dashboard works, phone does not?)

The admin dashboard uses `http://localhost:5000` because the browser runs on the same PC as the API. **A phone or tablet cannot use your PC’s `localhost`** unless you forward the port.

## Physical Android + USB cable (recommended for dev)

1. Connect the phone with USB and enable **USB debugging**.
2. With the device visible to `adb`, run **once per PC reboot** (or whenever reverse drops):

   ```bash
   adb reverse tcp:5000 tcp:5000
   ```

3. Start `server-attendance` on port **5000** on your computer.
4. In `src/config/apiBaseUrl.ts`, keep **`USE_ANDROID_USB_ADB_REVERSE = true`** and leave **`DEV_LAN_HOST`** empty. The app calls `http://127.0.0.1:5000/api` on the phone; `adb reverse` sends that to your PC’s port 5000.

If API calls still fail, run `adb reverse --list` and confirm `tcp:5000 tcp:5000` is listed.

## Emulator / simulator

The app picks the host automatically (`10.0.2.2` on Android emulator, `localhost` on iOS simulator). Start the API on port **5000**.

## Physical device on Wi‑Fi only

Set `USE_ANDROID_USB_ADB_REVERSE = false` and set **`DEV_LAN_HOST`** to your PC’s LAN IPv4 (e.g. `192.168.1.42`). Same Wi‑Fi as the phone; you may need Windows Firewall to allow inbound TCP **5000**.

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
