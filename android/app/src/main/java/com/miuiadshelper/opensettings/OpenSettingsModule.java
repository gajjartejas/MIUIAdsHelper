package com.miuiadshelper.opensettings;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.*;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class OpenSettingsModule extends ReactContextBaseJavaModule {

    @Override
    public String getName() {
        /**
         * return the string name of the NativeModule which represents this class in JavaScript
         * In JS access this module through React.NativeModules.OpenSettings
         */
        return "OpenSettings";
    }

    @ReactMethod
    public void openNetworkSettings(String pkgName, String clsName, Callback cb) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            cb.invoke(false);
            return;
        }
        try {
            Intent intent = new Intent();
            intent.setComponent(new ComponentName(pkgName, clsName));
            currentActivity.startActivity(intent);
            cb.invoke(true);
        } catch (Exception e) {
            cb.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void openNotificationSettings(String pkgName, Callback cb) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            cb.invoke(false);
            return;
        }
        Intent intent;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, pkgName);
        } else {
            intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + pkgName));
        }
        try {
            currentActivity.startActivity(intent);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(currentActivity,"test",Toast.LENGTH_SHORT);
        }
    }

    @ReactMethod
    public WritableMap readMIVersion(Promise promise) {
        try {
            @SuppressLint("PrivateApi") final Class<?> propertyClass = Class.forName("android.os.SystemProperties");
            final Method method = propertyClass.getMethod("get", String.class);
            final String versionCode = (String) method.invoke(propertyClass, "ro.miui.ui.version.code");
            final String versionName = (String) method.invoke(propertyClass, "ro.miui.ui.version.name");

            WritableMap map = Arguments.createMap();
            map.putString("versionCode", versionCode);
            map.putString("versionName", versionName);

            promise.resolve(map);
        } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
            promise.reject(e);
        }
        return null;
    }

    /* constructor */
    public OpenSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
}