package com.tejasgajjar.miuiadshelper.opensettings;

import static android.icu.text.DisplayContext.LENGTH_SHORT;

import android.app.Activity;
import android.content.Intent;
import android.content.*;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

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
            Intent intent = new Intent(Intent.ACTION_MAIN);
            intent.setComponent(new ComponentName(pkgName,clsName));
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

    /* constructor */
    public OpenSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
}