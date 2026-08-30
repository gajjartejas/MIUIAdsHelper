import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { AppTheme } from 'app/models/theme';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import { useDialogStore } from 'app/store/dialogStore';

const CommonDialog = () => {
  const { colors } = useTheme<AppTheme>();
  const largeScreenMode = useLargeScreenMode();
  const visible = useDialogStore(state => state.visible);
  const options = useDialogStore(state => state.options);
  const hideDialog = useDialogStore(state => state.hideDialog);

  const handleDismiss = useCallback(() => {
    const onDismissCallback = options?.onDismiss;
    hideDialog();
    if (onDismissCallback) {
      onDismissCallback();
    }
  }, [hideDialog, options]);

  if (!visible || !options) {
    return null;
  }

  const buttons =
    options.buttons && options.buttons.length > 0
      ? options.buttons
      : [{ text: 'OKAY', onPress: () => {} }];

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={handleDismiss}
        style={[styles.dialog, largeScreenMode && styles.cardTablet, { backgroundColor: colors.surface }]}>
        {!!options.title && (
          <Dialog.Title style={[styles.title, { color: colors.text }]}>
            {options.title}
          </Dialog.Title>
        )}
        <Dialog.Content>
          <Text variant="bodyMedium" style={[styles.message, { color: `${colors.text}DD` }]}>
            {options.message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          {buttons.map((btn, idx) => (
            <Button
              key={`${btn.text}-${idx}`}
              mode={btn.mode || 'text'}
              textColor={btn.textColor || colors.primary}
              labelStyle={styles.buttonLabel}
              style={styles.actionButton}
              onPress={() => {
                hideDialog();
                if (btn.onPress) {
                  btn.onPress();
                }
              }}>
              {btn.text}
            </Button>
          ))}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
  },
  cardTablet: {
    width: '60%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 4,
  },
  actionButton: {
    minWidth: 80,
    marginHorizontal: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default memo(CommonDialog);
