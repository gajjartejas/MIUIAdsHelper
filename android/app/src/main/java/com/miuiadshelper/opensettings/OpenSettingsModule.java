package com.miuiadshelper.opensettings;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.lang.reflect.Method;
import java.util.List;

public class OpenSettingsModule extends ReactContextBaseJavaModule {

    private static final String TAG = "OpenSettingsModule";

    public OpenSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "OpenSettings";
    }

    @ReactMethod
    public void openNetworkSettings(String pkgName, String clsName, Callback cb) {
        boolean invoked = false;
        Context context = getCurrentActivity();
        if (context == null) {
            context = getReactApplicationContext();
        }

        try {
            if (pkgName == null || pkgName.trim().isEmpty()) {
                if (cb != null) {
                    cb.invoke(false);
                }
                return;
            }

            Intent intent;
            if (clsName != null && !clsName.trim().isEmpty() && !clsName.trim().equalsIgnoreCase("null")) {
                intent = new Intent();
                intent.setComponent(new ComponentName(pkgName.trim(), clsName.trim()));
            } else {
                PackageManager pm = context.getPackageManager();
                intent = pm.getLaunchIntentForPackage(pkgName.trim());
                if (intent == null) {
                    intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    intent.setData(Uri.parse("package:" + pkgName.trim()));
                }
            }

            if (intent == null) {
                if (cb != null) {
                    cb.invoke(false);
                }
                return;
            }

            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            if (cb != null) {
                cb.invoke(true);
                invoked = true;
            }
        } catch (ActivityNotFoundException | SecurityException e) {
            Log.w(TAG, "Activity not found or security exception: " + e.getMessage());
            try {
                Intent fallbackIntent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                fallbackIntent.setData(Uri.parse("package:" + pkgName.trim()));
                fallbackIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(fallbackIntent);
                if (cb != null) {
                    cb.invoke(true);
                    invoked = true;
                }
                return;
            } catch (Exception ex) {
                Log.e(TAG, "Fallback to app details failed: " + ex.getMessage(), ex);
            }
            if (cb != null && !invoked) {
                cb.invoke(false);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error opening activity: " + e.getMessage(), e);
            if (cb != null && !invoked) {
                cb.invoke(false);
            }
        }
    }

    @ReactMethod
    public void openNotificationSettings(String pkgName, Callback cb) {
        boolean invoked = false;
        try {
            Context context = getCurrentActivity();
            if (context == null) {
                context = getReactApplicationContext();
            }

            if (pkgName == null || pkgName.trim().isEmpty()) {
                pkgName = context.getPackageName();
            }

            Intent intent;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                intent.putExtra(Settings.EXTRA_APP_PACKAGE, pkgName);
            } else {
                intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + pkgName));
            }

            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            if (cb != null) {
                cb.invoke(true);
                invoked = true;
            }
        } catch (Exception e) {
            Log.e(TAG, "Error opening notification settings: " + e.getMessage(), e);
            if (cb != null && !invoked) {
                cb.invoke(false);
            }
        }
    }

    @ReactMethod
    public void openAppSettings(String pkgName, Callback cb) {
        boolean invoked = false;
        try {
            Context context = getCurrentActivity();
            if (context == null) {
                context = getReactApplicationContext();
            }

            if (pkgName == null || pkgName.trim().isEmpty()) {
                pkgName = context.getPackageName();
            }

            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + pkgName.trim()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            if (cb != null) {
                cb.invoke(true);
                invoked = true;
            }
        } catch (Exception e) {
            Log.e(TAG, "Error opening app settings: " + e.getMessage(), e);
            if (cb != null && !invoked) {
                cb.invoke(false);
            }
        }
    }

    @ReactMethod
    public void openAppDetailsSettings(String pkgName, Callback cb) {
        openAppSettings(pkgName, cb);
    }

    @ReactMethod
    public void readMIVersion(Promise promise) {
        try {
            @SuppressLint("PrivateApi") final Class<?> propertyClass = Class.forName("android.os.SystemProperties");
            final Method method = propertyClass.getMethod("get", String.class);
            String versionCode = (String) method.invoke(propertyClass, "ro.miui.ui.version.code");
            String versionName = (String) method.invoke(propertyClass, "ro.miui.ui.version.name");

            if (versionCode == null || versionCode.isEmpty()) {
                versionCode = (String) method.invoke(propertyClass, "ro.mi.os.version.code");
            }
            if (versionName == null || versionName.isEmpty()) {
                versionName = (String) method.invoke(propertyClass, "ro.mi.os.version.name");
            }

            WritableMap map = Arguments.createMap();
            map.putString("versionCode", versionCode != null ? versionCode : "");
            map.putString("versionName", versionName != null ? versionName : "");

            promise.resolve(map);
        } catch (Exception e) {
            Log.e(TAG, "Error reading MI/HyperOS version: " + e.getMessage(), e);
            promise.reject("MIUI_VERSION_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void isPackageInstalled(String pkgName, Promise promise) {
        try {
            if (pkgName == null || pkgName.trim().isEmpty()) {
                promise.resolve(false);
                return;
            }
            PackageManager pm = getReactApplicationContext().getPackageManager();
            pm.getPackageInfo(pkgName.trim(), 0);
            promise.resolve(true);
        } catch (PackageManager.NameNotFoundException e) {
            promise.resolve(false);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void checkInstalledPackages(ReadableArray packageNames, Promise promise) {
        try {
            PackageManager pm = getReactApplicationContext().getPackageManager();
            WritableMap result = Arguments.createMap();
            if (packageNames != null) {
                for (int i = 0; i < packageNames.size(); i++) {
                    String pkg = packageNames.getString(i);
                    if (pkg != null && !pkg.trim().isEmpty()) {
                        try {
                            pm.getPackageInfo(pkg.trim(), 0);
                            result.putBoolean(pkg.trim(), true);
                        } catch (PackageManager.NameNotFoundException e) {
                            result.putBoolean(pkg.trim(), false);
                        } catch (Exception e) {
                            result.putBoolean(pkg.trim(), false);
                        }
                    }
                }
            }
            promise.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Error checking installed packages: " + e.getMessage(), e);
            promise.reject("CHECK_PACKAGES_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void checkItemsAvailability(ReadableArray items, Promise promise) {
        try {
            Context context = getCurrentActivity();
            if (context == null) {
                context = getReactApplicationContext();
            }
            PackageManager pm = context.getPackageManager();
            WritableMap result = Arguments.createMap();

            if (items != null) {
                for (int i = 0; i < items.size(); i++) {
                    ReadableMap item = items.getMap(i);
                    if (item == null) continue;

                    int id = item.getInt("id");
                    boolean isAvailable = false;

                    if (item.hasKey("paths")) {
                        ReadableArray paths = item.getArray("paths");
                        if (paths != null && paths.size() > 0) {
                            for (int j = 0; j < paths.size(); j++) {
                                ReadableMap path = paths.getMap(j);
                                String pkgName = path.hasKey("package") && !path.isNull("package") ? path.getString("package") : null;
                                String clsName = path.hasKey("activity") && !path.isNull("activity") ? path.getString("activity") : null;

                                if (isCallable(pm, pkgName, clsName)) {
                                    isAvailable = true;
                                    break;
                                }
                            }
                        }
                    }

                    result.putBoolean(String.valueOf(id), isAvailable);
                }
            }
            promise.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Error checking items availability: " + e.getMessage(), e);
            promise.reject("CHECK_ITEMS_ERROR", e.getMessage(), e);
        }
    }

    private boolean isCallable(PackageManager pm, String pkgName, String clsName) {
        if (pkgName == null || pkgName.trim().isEmpty()) {
            return false;
        }
        String trimmedPkg = pkgName.trim();
        try {
            PackageInfo info = pm.getPackageInfo(trimmedPkg, 0);
            if (info == null) {
                return false;
            }
            return info.applicationInfo == null || info.applicationInfo.enabled;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        } catch (Exception ignored) {
            return false;
        }
    }
}