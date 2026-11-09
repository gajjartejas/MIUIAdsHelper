package com.miuiadshelper.opensettings;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

public class OpenSettingsModule extends ReactContextBaseJavaModule {
    private static final String TAG = "OpenSettingsModule";
    private static final Pattern PACKAGE_NAME = Pattern.compile("[A-Za-z_][A-Za-z0-9_]*(\\.[A-Za-z_][A-Za-z0-9_]*)*");

    public OpenSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "OpenSettings";
    }

    private interface SettingsLaunch {
        boolean launch(Activity activity) throws PackageManager.NameNotFoundException;
    }

    private void openSettings(Callback callback, SettingsLaunch launch) {
        boolean scheduled = UiThreadUtil.runOnUiThread(() -> {
            boolean opened = false;
            try {
                Activity activity = getReactApplicationContext().getCurrentActivity();
                // Background launches can be silently blocked by Android. Never report
                // success without a live foreground Activity initiating the request.
                if (activity != null && !activity.isFinishing() && !activity.isDestroyed()
                        && getReactApplicationContext().getLifecycleState() == LifecycleState.RESUMED) {
                    opened = launch.launch(activity);
                }
            } catch (PackageManager.NameNotFoundException | RuntimeException error) {
                // Expected for manufacturer screens that are missing or not exported.
                Log.w(TAG, "Settings destination unavailable: " + error.getClass().getSimpleName());
            }
            // Keep bridge invocation outside launch error handling: a callback exception
            // must never cause a second invocation of React Native's single-use callback.
            completeCallback(callback, opened);
        });
        if (!scheduled) completeCallback(callback, false);
    }

    private static void completeCallback(Callback callback, boolean opened) {
        if (callback == null) return;
        try {
            callback.invoke(opened);
        } catch (RuntimeException error) {
            // A React bridge torn down during a reload must not crash the UI thread.
            // This callback has already been invoked; never retry it.
            Log.w(TAG, "Settings callback bridge is unavailable");
        }
    }

    private static String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() || trimmed.equalsIgnoreCase("null") ? null : trimmed;
    }

    private String resolvePackage(String value, boolean defaultToSelf) {
        if (defaultToSelf && (value == null || value.trim().isEmpty())) {
            return getReactApplicationContext().getPackageName();
        }
        String name = normalize(value);
        return name != null && PACKAGE_NAME.matcher(name).matches() ? name : null;
    }

    private boolean isPackagePresent(PackageManager pm, String name) {
        if (name == null) return false;
        try {
            // Disabled applications remain installed and can be re-enabled from App info.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                pm.getPackageInfo(name, PackageManager.PackageInfoFlags.of(0));
            } else {
                pm.getPackageInfo(name, 0);
            }
            return true;
        } catch (PackageManager.NameNotFoundException | RuntimeException ignored) {
            return false;
        }
    }

    private static Intent appDetailsIntent(String name) {
        return new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.fromParts("package", name, null));
    }

    private static boolean startActivity(Activity activity, Intent intent) {
        if (intent == null) return false;
        try {
            activity.startActivity(intent);
            return true;
        } catch (RuntimeException error) {
            Log.w(TAG, "Cannot open settings destination: " + error.getClass().getSimpleName());
            return false;
        }
    }

    @ReactMethod
    public void openNetworkSettings(String pkgName, String clsName, Callback callback) {
        openSettings(callback, activity -> {
            String name = resolvePackage(pkgName, false);
            if (name == null) return false;
            String className = normalize(clsName);
            if (className != null) {
                if (className.startsWith(".")) className = name + className;
                Intent intent = new Intent().setComponent(new ComponentName(name, className));
                // Do not pre-resolve or fall back here. JavaScript must be able to try
                // all configured explicit activities before choosing App info.
                return startActivity(activity, intent);
            }
            PackageManager pm = activity.getPackageManager();
            if (!isPackagePresent(pm, name)) return false;
            Intent intent = pm.getLaunchIntentForPackage(name);
            return startActivity(activity, intent == null ? appDetailsIntent(name) : intent);
        });
    }

    @ReactMethod
    public void openNotificationSettings(String pkgName, Callback callback) {
        openSettings(callback, activity -> {
            String name = resolvePackage(pkgName, true);
            if (!isPackagePresent(activity.getPackageManager(), name)) return false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                        .putExtra(Settings.EXTRA_APP_PACKAGE, name);
                if (startActivity(activity, intent)) return true;
            }
            return startActivity(activity, appDetailsIntent(name));
        });
    }

    @ReactMethod
    public void openAppSettings(String pkgName, Callback callback) {
        openSettings(callback, activity -> {
            String name = resolvePackage(pkgName, true);
            if (!isPackagePresent(activity.getPackageManager(), name)) return false;
            return startActivity(activity, appDetailsIntent(name));
        });
    }

    @ReactMethod
    public void openAppDetailsSettings(String pkgName, Callback callback) {
        openAppSettings(pkgName, callback);
    }

    @ReactMethod
    public void readMIVersion(Promise promise) {
        try {
            @SuppressLint("PrivateApi") final Class<?> propertyClass = Class.forName("android.os.SystemProperties");
            final Method method = propertyClass.getMethod("get", String.class);
            String versionCode = (String) method.invoke(null, "ro.miui.ui.version.code");
            String versionName = (String) method.invoke(null, "ro.miui.ui.version.name");
            if (versionCode == null || versionCode.isEmpty()) {
                versionCode = (String) method.invoke(null, "ro.mi.os.version.code");
            }
            if (versionName == null || versionName.isEmpty()) {
                versionName = (String) method.invoke(null, "ro.mi.os.version.name");
            }
            WritableMap map = Arguments.createMap();
            map.putString("versionCode", versionCode != null ? versionCode : "");
            map.putString("versionName", versionName != null ? versionName : "");
            promise.resolve(map);
        } catch (Exception error) {
            promise.reject("MIUI_VERSION_ERROR", "MIUI/HyperOS version is unavailable", error);
        }
    }

    @ReactMethod
    public void isPackageInstalled(String pkgName, Promise promise) {
        promise.resolve(isPackagePresent(getReactApplicationContext().getPackageManager(), resolvePackage(pkgName, false)));
    }

    @ReactMethod
    public void checkInstalledPackages(ReadableArray packageNames, Promise promise) {
        try {
            PackageManager pm = getReactApplicationContext().getPackageManager();
            Map<String, Boolean> cache = new HashMap<>();
            WritableMap result = Arguments.createMap();
            if (packageNames != null) {
                for (int i = 0; i < packageNames.size(); i++) {
                    if (packageNames.getType(i) != ReadableType.String) continue;
                    String name = resolvePackage(packageNames.getString(i), false);
                    if (name != null) result.putBoolean(name, packagePresentCached(pm, name, cache));
                }
            }
            promise.resolve(result);
        } catch (RuntimeException error) {
            promise.reject("CHECK_PACKAGES_ERROR", "Could not check package availability", error);
        }
    }

    private boolean packagePresentCached(PackageManager pm, String name, Map<String, Boolean> cache) {
        if (name == null) return false;
        Boolean present = cache.get(name);
        if (present == null) {
            present = isPackagePresent(pm, name);
            cache.put(name, present);
        }
        return present;
    }

    @ReactMethod
    public void checkItemsAvailability(ReadableArray items, Promise promise) {
        try {
            PackageManager pm = getReactApplicationContext().getPackageManager();
            Map<String, Boolean> cache = new HashMap<>();
            WritableMap result = Arguments.createMap();
            if (items != null) {
                for (int i = 0; i < items.size(); i++) {
                    if (items.getType(i) != ReadableType.Map) continue;
                    ReadableMap item = items.getMap(i);
                    if (item == null || !item.hasKey("id") || item.getType("id") != ReadableType.Number) continue;
                    double id = item.getDouble("id");
                    if (Double.isNaN(id) || id < 0 || id > Integer.MAX_VALUE || id != Math.rint(id)) continue;
                    boolean available = false;
                    if (item.hasKey("paths") && item.getType("paths") == ReadableType.Array) {
                        ReadableArray paths = item.getArray("paths");
                        if (paths != null) {
                            for (int j = 0; j < paths.size(); j++) {
                                if (paths.getType(j) != ReadableType.Map) continue;
                                ReadableMap path = paths.getMap(j);
                                if (path == null || !path.hasKey("package") || path.getType("package") != ReadableType.String) continue;
                                String name = resolvePackage(path.getString("package"), false);
                                // This feeds an "installed" badge, not a guarantee that an
                                // individual manufacturer Activity is externally launchable.
                                if (packagePresentCached(pm, name, cache)) {
                                    available = true;
                                    break;
                                }
                            }
                        }
                    }
                    result.putBoolean(String.valueOf((int) id), available);
                }
            }
            promise.resolve(result);
        } catch (RuntimeException error) {
            promise.reject("CHECK_ITEMS_ERROR", "Could not check guide availability", error);
        }
    }
}
