package com.miuiadshelper.opensettings;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.JavaOnlyMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.common.LifecycleState;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockedConstruction;
import org.mockito.MockedStatic;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class OpenSettingsModuleTest {
    private ReactApplicationContext context;
    private Activity activity;
    private PackageManager pm;
    private OpenSettingsModule module;
    private Callback callback;
    private MockedStatic<UiThreadUtil> ui;
    private MockedStatic<Log> log;
    private MockedStatic<Arguments> arguments;
    private MockedStatic<Uri> uris;
    private MockedConstruction<Intent> intents;
    private MockedConstruction<ComponentName> components;
    private final List<List<?>> componentArguments = new ArrayList<>();

    @Before
    public void setUp() throws Exception {
        context = mock(ReactApplicationContext.class);
        activity = mock(Activity.class);
        pm = mock(PackageManager.class);
        callback = mock(Callback.class);
        when(context.getCurrentActivity()).thenReturn(activity);
        when(context.getLifecycleState()).thenReturn(LifecycleState.RESUMED);
        when(context.getPackageManager()).thenReturn(pm);
        when(context.getPackageName()).thenReturn("com.tejasgajjar.miuiadshelper");
        when(activity.getPackageManager()).thenReturn(pm);
        // Android's stub SDK has SDK_INT=0; production's API 33+ overload is
        // compiled too, while these local tests exercise the legacy PM contract.
        when(pm.getPackageInfo(anyString(), anyInt())).thenReturn(mock(PackageInfo.class));
        ui = mockStatic(UiThreadUtil.class);
        ui.when(() -> UiThreadUtil.runOnUiThread(any(Runnable.class))).thenAnswer(call -> {
            call.<Runnable>getArgument(0).run();
            return true;
        });
        log = mockStatic(Log.class);
        arguments = mockStatic(Arguments.class);
        arguments.when(Arguments::createMap).thenAnswer(call -> new JavaOnlyMap());
        uris = mockStatic(Uri.class);
        uris.when(() -> Uri.fromParts(anyString(), anyString(), isNull())).thenReturn(mock(Uri.class));
        intents = mockConstruction(Intent.class, (intent, construction) -> {
            when(intent.setComponent(any())).thenReturn(intent);
            when(intent.putExtra(anyString(), anyString())).thenReturn(intent);
        });
        components = mockConstruction(ComponentName.class, (component, construction) -> {
            componentArguments.add(construction.arguments());
        });
        module = new OpenSettingsModule(context);
    }

    @After
    public void tearDown() {
        if (components != null) components.close();
        if (intents != null) intents.close();
        if (uris != null) uris.close();
        if (arguments != null) arguments.close();
        if (log != null) log.close();
        if (ui != null) ui.close();
    }

    @Test
    public void normalizesExplicitComponentAndDispatchesOnUiThread() {
        module.openNetworkSettings(" com.miui.player ", " .SettingsActivity ", callback);
        ui.verify(() -> UiThreadUtil.runOnUiThread(any(Runnable.class)));
        assertEquals("com.miui.player", componentArguments.get(0).get(0));
        assertEquals("com.miui.player.SettingsActivity", componentArguments.get(0).get(1));
        verify(activity).startActivity(intents.constructed().get(0));
        verify(callback).invoke(true);
        verifyNoMoreInteractions(callback);
    }

    @Test
    public void inaccessibleActivityFailsWithoutOpeningAppInfoPrematurely() {
        doThrow(new SecurityException()).when(activity).startActivity(any(Intent.class));
        module.openNetworkSettings("com.miui.player", "com.miui.player.Restricted", callback);
        assertEquals(1, intents.constructed().size());
        verify(callback).invoke(false);
        verifyNoMoreInteractions(callback);
    }

    @Test
    public void missingActivityFailsAndCanBeFollowedByAnotherAttempt() {
        doThrow(ActivityNotFoundException.class).doNothing().when(activity).startActivity(any(Intent.class));
        module.openNetworkSettings("com.miui.player", "Missing", callback);
        verify(callback).invoke(false);
        Callback next = mock(Callback.class);
        module.openNetworkSettings("com.miui.player", "Available", next);
        verify(next).invoke(true);
    }

    @Test
    public void missingPackageNeverOpensAnEmptyAppInfoScreen() throws Exception {
        when(pm.getPackageInfo("missing.package", 0)).thenThrow(PackageManager.NameNotFoundException.class);
        module.openAppSettings("missing.package", callback);
        verify(activity, never()).startActivity(any());
        verify(callback).invoke(false);
    }

    @Test
    public void installedPackageWithoutLauncherOpensAppInfo() {
        module.openNetworkSettings("com.miui.player", null, callback);
        uris.verify(() -> Uri.fromParts("package", "com.miui.player", null));
        verify(activity).startActivity(any(Intent.class));
        verify(callback).invoke(true);
    }

    @Test
    public void nullActivityAndBackgroundStateAreNotReportedAsSuccess() {
        when(context.getCurrentActivity()).thenReturn(null);
        module.openAppSettings("com.miui.player", callback);
        verify(callback).invoke(false);
        when(context.getCurrentActivity()).thenReturn(activity);
        when(context.getLifecycleState()).thenReturn(LifecycleState.BEFORE_RESUME);
        Callback background = mock(Callback.class);
        module.openAppSettings("com.miui.player", background);
        verify(background).invoke(false);
        verify(activity, never()).startActivity(any());
    }

    @Test
    public void destroyedActivityDoesNotStartSettings() {
        when(activity.isDestroyed()).thenReturn(true);
        module.openAppSettings("com.miui.player", callback);
        verify(activity, never()).startActivity(any());
        verify(callback).invoke(false);
    }

    @Test
    public void rejectedUiDispatchStillCompletesCallback() {
        ui.when(() -> UiThreadUtil.runOnUiThread(any(Runnable.class))).thenReturn(false);
        module.openAppSettings("com.miui.player", callback);
        verify(callback).invoke(false);
        verifyNoMoreInteractions(callback);
    }

    @Test
    public void callbackExceptionIsNeverRetried() {
        doThrow(new IllegalStateException("Closed bridge")).when(callback).invoke(true);
        module.openAppSettings("com.miui.player", callback);
        verify(callback).invoke(true);
        verifyNoMoreInteractions(callback);
    }

    @Test
    public void invalidPackageInputDoesNotLaunchSettings() {
        module.openNetworkSettings(" null ", "Settings", callback);
        verify(activity, never()).startActivity(any());
        verify(callback).invoke(false);
    }

    @Test
    public void rechecksForegroundActivityWhenQueuedLaunchActuallyRuns() {
        org.mockito.ArgumentCaptor<Runnable> queued = org.mockito.ArgumentCaptor.forClass(Runnable.class);
        ui.when(() -> UiThreadUtil.runOnUiThread(queued.capture())).thenReturn(true);
        module.openAppSettings("com.miui.player", callback);
        verifyNoInteractions(callback);
        when(context.getCurrentActivity()).thenReturn(null);
        queued.getValue().run();
        verify(activity, never()).startActivity(any());
        verify(callback).invoke(false);
    }

    @Test
    public void disabledApplicationIsStillAvailableForAppInfo() throws Exception {
        PackageInfo info = mock(PackageInfo.class);
        info.applicationInfo = mock(android.content.pm.ApplicationInfo.class);
        info.applicationInfo.enabled = false;
        when(pm.getPackageInfo("com.miui.player", 0)).thenReturn(info);
        Promise promise = mock(Promise.class);
        module.isPackageInstalled("com.miui.player", promise);
        verify(promise).resolve(true);
        module.openAppSettings("com.miui.player", callback);
        verify(callback).invoke(true);
    }

    @Test
    public void malformedPathsDoNotDiscardValidGuidesAndPackageQueriesAreCached() throws Exception {
        JavaOnlyArray paths = JavaOnlyArray.of(null, 123, JavaOnlyMap.of("package", 123),
                JavaOnlyMap.of("package", "com.miui.player"));
        JavaOnlyArray input = JavaOnlyArray.of(null, "invalid", JavaOnlyMap.of("id", "bad"),
                JavaOnlyMap.of("id", 1, "paths", paths),
                JavaOnlyMap.of("id", 2, "paths", paths));
        Promise promise = mock(Promise.class);
        module.checkItemsAvailability(input, promise);
        org.mockito.ArgumentCaptor<Object> result = org.mockito.ArgumentCaptor.forClass(Object.class);
        verify(promise).resolve(result.capture());
        JavaOnlyMap map = (JavaOnlyMap) result.getValue();
        assertTrue(map.getBoolean("1"));
        assertTrue(map.getBoolean("2"));
        verify(pm, times(1)).getPackageInfo("com.miui.player", 0);
    }
}
