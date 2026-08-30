import { create } from 'zustand';

export interface IDialogButton {
  text: string;
  onPress?: () => void;
  mode?: 'text' | 'outlined' | 'contained';
  textColor?: string;
}

export interface IDialogOptions {
  title?: string;
  message: string;
  buttons?: IDialogButton[];
  cancelable?: boolean;
  onDismiss?: () => void;
}

interface IDialogState {
  visible: boolean;
  options: IDialogOptions | null;
}

interface IDialogActions {
  showDialog: (options: IDialogOptions) => void;
  hideDialog: () => void;
}

export const useDialogStore = create<IDialogState & IDialogActions>(set => ({
  visible: false,
  options: null,
  showDialog: options => set({ visible: true, options }),
  hideDialog: () => set({ visible: false, options: null }),
}));

export const showAppDialog = (
  titleOrMessage: string,
  messageOrButtons?: string | IDialogButton[],
  buttons?: IDialogButton[],
  options?: Partial<IDialogOptions>,
) => {
  let title: string | undefined;
  let message: string;
  let dialogButtons: IDialogButton[] | undefined;

  if (typeof messageOrButtons === 'string') {
    title = titleOrMessage;
    message = messageOrButtons;
    dialogButtons = buttons;
  } else if (Array.isArray(messageOrButtons)) {
    title = undefined;
    message = titleOrMessage;
    dialogButtons = messageOrButtons;
  } else {
    title = undefined;
    message = titleOrMessage;
    dialogButtons = buttons;
  }

  useDialogStore.getState().showDialog({
    title,
    message,
    buttons: dialogButtons,
    ...options,
  });
};

export const hideAppDialog = () => {
  useDialogStore.getState().hideDialog();
};
