[] Change REACT_BASE_URL in client/editor/.env to the easymeme69.com one
[] Test the apk by running "npm run create-install-debug-build" in the cordova directory
[] Increase the version and the version-code (!) in cordova/config.xml
[] Create a release-bundle (.aab) by running "npm run create-release-bundle"
[] Sign the release-bundle by running "npm run sign-release-bundle"
[] Move the bundle (cordova/platforms/android/app/build/outputs/bundle/release/app-release.aab) into store/google-play/releases/release-.../
[] Create a new release in the Google Play Developer Console
[] Comment REACT_BASE_URL in client/editor/.env