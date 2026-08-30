package com.miuiadshelper.opensettings;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
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
import com.facebook.react.bridge.WritableMap;

import java.lang.reflect.Method;

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
        try {
            Context context = getCurrentActivity();
            if (context == null) {
                context = getReactApplicationContext();
            }

            if (pkgName == null || pkgName.trim().isEmpty()) {
                if (cb != null) {
                    cb.invoke(false);
                }
                return;
            }

            Intent intent;
            if (clsName != null && !clsName.trim().isEmpty()) {
                intent = new Intent();
                intent.setComponent(new ComponentName(pkgName.trim(), clsName.trim()));
            } else {
                PackageManager pm = context.getPackageManager();
                intent = pm.getLaunchIntentForPackage(pkgName.trim());
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
            intent.setData(Uri.parse("package:" + pkgName));
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
}