// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

let strings = new LocalizedStrings({
  en: {
    ads_step_0_appname: 'Music',
    ads_step_0_title: 'Mi Music App',
    ads_step_0_subtitle: 'Mi Music Player is the MIUI native music player which is designed just for Mi Fans.',
    ads_step_0_detail:
      'Mi Music Player is the MIUI native music player which is designed just for Mi Fans. With Mi Music, playing local songs will be much easier.',
    ads_step_0_steps: '1. Open the Mi Music app.\n2. Go to Music app Settings.\n3. Tap on Advanced Settings.\n4. Turn off Recommendations.',
    ads_step_0_specialNote: '',

    ads_step_1_appname: 'MI Video',
    ads_step_1_title: 'MI Video App',
    ads_step_1_subtitle: 'Mi Video Player is the MIUI native video player which is designed just for Mi Fans.',
    ads_step_1_detail:
      'Mi Video Player is the MIUI native video player which is designed just for Mi Fans. With Mi Video, playing local videos will be much easier.',
    ads_step_1_steps: '1. Open the MI Video app.\n2. In Account tab Tap on Settings\n3. Turn off Recommendations.',
    ads_step_1_specialNote: '',

    ads_step_2_appname: 'Themes',
    ads_step_2_title: 'Themes App',
    ads_step_2_subtitle: 'Themes app is the MIUI native theming app which is designed just for Mi Fans.',
    ads_step_2_detail: 'Themes app is the MIUI native theming app which is designed just for Mi Fans.',
    ads_step_2_steps: '1. Open the Theme app.\n2. In last tab Tap on Settings\n3. Turn off Recommendations.',
    ads_step_2_specialNote: 'You have to manually find ads setting.',

    ads_step_3_appname: 'File Manager',
    ads_step_3_title: 'Mi File Manager app',
    ads_step_3_subtitle:
      'Mi File Manager is a free, secure tool that helps you find file faster, manage files easily, and share them offline with others',
    ads_step_3_detail:
      'Mi File Manager is a free, secure tool that helps you find file faster, manage files easily, and share them offline with others',
    ads_step_3_steps:
      '1. Open Mi File Manager app.\n2. Tap on three horizontal lines at the top corner of Mi File Explorer.\n3. Go to Settings and About.\n4. Turn off Recommendations.',
    ads_step_3_specialNote: 'You have to manually find ads setting.',

    ads_step_4_appname: 'Browser',
    ads_step_4_title: 'Mi Browser',
    ads_step_4_subtitle: 'Mi Browser is an app from the category browsing, whose license is free which is available in english',
    ads_step_4_detail: 'Mi Browser is an app from the category browsing, whose license is free which is available in english',
    ads_step_4_steps:
      '1. Open Mi Browser.\n2. Open MIUI Browser Settings.\n3. Go to Advanced > Top sites order. If Top sites order option is missing, then look ever option until you find the recommendations option.\n4. Turn off Receive recommendations.',
    ads_step_4_specialNote: '',

    ads_step_5_appname: 'Downloads',
    ads_step_5_title: 'Downloads App',
    ads_step_5_subtitle: 'Mi Downloads app is the MIUI native downloader which is designed just for Mi Fans.',
    ads_step_5_detail: 'Mi Downloads app is the MIUI native downloader which is designed just for Mi Fans.',
    ads_step_5_steps: '1. Open Downloads app.\n2. Tap on three dots at the top corner.\n3. Go to Settings.\n4. Turn off Show recommended content.',
    ads_step_5_specialNote: 'You have to manually find ads setting.',

    ads_step_6_appname: 'Security',
    ads_step_6_title: 'Security App',
    ads_step_6_subtitle: 'Mi Security app is default security app which is designed for Mi fans.',
    ads_step_6_detail: 'Mi Security app is default security app which is designed for Mi fans.',
    ads_step_6_steps:
      '1. Open Mi Security App.\n2. Tap on Settings Gear Icon in the top corner.\n3. Under Recommendations turn off Receive recommendations.',
    ads_step_6_specialNote: '',

    ads_step_7_appname: 'Security',
    ads_step_7_title: 'Cleaner app',
    ads_step_7_subtitle: 'Mi Security app is part of Mi security app which is designed for Mi fans.',
    ads_step_7_detail: 'Mi Security app is part of Mi security app which is designed for Mi fans.',
    ads_step_7_steps:
      '1. Open Mi Security app.\n2. Tap on the Settings icon in the top corner.\n3. Tap on Cleaner under Feature Settings.\n4. Turn off Receive recommendations.',
    ads_step_7_specialNote: '',

    ads_step_8_appname: 'Security',
    ads_step_8_title: 'App Lock',
    ads_step_8_subtitle: 'App Lock protect your app with password or fingerprint.',
    ads_step_8_detail: 'Applock is part of Mi security app which is designed for Mi fans.',
    ads_step_8_steps:
      '1. Open Mi Security app.\n2.Tap on the App Lock.\n3. Tap on the Settings icon in the top corner.\n3. Turn off Receive recommendations.',
    ads_step_8_specialNote: '',

    ads_step_9_appname: 'Security',
    ads_step_9_title: 'Boost Speed App',
    ads_step_9_subtitle: 'Boost Speed App is part of Mi security aap which is designed to clean memory cache.',
    ads_step_9_detail: 'Boost Speed App is part of Mi security aap which is designed to clean memory cache.',
    ads_step_9_steps:
      '1. Open Mi Security app.\n2.Tap on the Boost speed.\n3. Tap on the Settings icon in the top corner.\n4. Turn off Receive recommendations.',
    ads_step_9_specialNote: '',

    ads_step_10_appname: 'Security',
    ads_step_10_title: 'Manage Apps App',
    ads_step_10_subtitle: 'Manage Apps App is part of Mi security aap which is designed to uninstall apps.',
    ads_step_10_detail: 'Manage Apps App is part of Mi security aap which is designed to uninstall apps.',
    ads_step_10_steps:
      '1. Open Mi Security app.\n2.Tap on the Manage apps.\n3. Tap on the three dots and then tap on Settings icon in the top corner.\n4. Turn off Receive recommendations.',
    ads_step_10_specialNote: '',

    ads_step_11_appname: 'MSA app',
    ads_step_11_title: 'MSA app',
    ads_step_11_subtitle: 'MiuiDeamon is spyware fron Xiaomi. It collects a lot of your data and sends it to Xiaomi servers.',
    ads_step_11_detail:
      'MiuiDeamon is spyware fron Xiaomi. It collects a lot of your data and sends it to Xiaomi servers. MSA is Xiaomi advertising app that shows ad notifications and is a security risk aswell',
    ads_step_11_steps:
      '1.Go to Settings\n2. Go to Additional settings or Password & Security\n3. Authorization and revocation \n4. Tap on MSA AND MiuiDeamon\n5. Revoke authorization',
    ads_step_11_specialNote: 'You have to manually find ads setting.',

    ads_step_12_appname: 'Setting',
    ads_step_12_title: 'Advertising Identifier',
    ads_step_12_subtitle: "When the recommendations are off, you'll still see the same quality of ads as when its on",
    ads_step_12_detail:
      "When the recommendations are off, you'll still see the same quality of ads as when its on, but they wont be basen on your behaviour data or your personal information.",
    ads_step_12_steps: '1. Open Settings app.\n2. Go to Additional Settings > Privacy > Ad services.\n3. Turn off Personalized Ad Recommendation.',
    ads_step_12_specialNote: '',

    ads_step_13_appname: 'App Folder',
    ads_step_13_title: 'App Folder',
    ads_step_13_subtitle: 'Disable Promoted apps toggle. This has to be done to every folder...',
    ads_step_13_detail: 'Disable Promoted apps toggle. This has to be done to every folder.',
    ads_step_13_steps:
      '1. Tap on the folder in which you want to disable ads/ Promoted apps.\n2. Tap on Folder Name.\n3. Disable Promoted apps toggle. This has to be done to every folder on MIUI.',
    ads_step_13_specialNote: 'Only applicable to MIUI default launcher.\nYou have to manually find your folder.',

    ads_step_14_appname: 'Recent Apps',
    ads_step_14_title: 'Recent Apps',
    ads_step_14_subtitle: 'Disable suggestions from Homescreen & Recents menu.',
    ads_step_14_detail: 'Disable suggestions from Homescreen & Recents menu.',
    ads_step_14_steps: '1. Open System Setting\n2. Navigate to Home screen & Recents\n3. Turn off Show suggestions.',
    ads_step_14_specialNote: '',

    ads_step_15_appname: 'Google Apps',
    ads_step_15_title: 'Google Apps Privacy',
    ads_step_15_subtitle: 'Disable usage & diagnostics, advertising id and personalisation.',
    ads_step_15_detail: 'Reset or disable advertising id, disable debug logging for ads and disable usage & diagnostics',
    ads_step_15_steps: '1. Open System Setting\n2. Navigate to Google\n3. Choose Appropriate option.',
    ads_step_15_specialNote: '',

    ads_step_16_appname: 'Personalized Ad Recommendations',
    ads_step_16_title: 'Disabling Personalized Ad Recommendations and User Data Collection',
    ads_step_16_subtitle: 'Disabling Personalized Ad Recommendations and User Data Collection.',
    ads_step_16_detail:
      'Personalized Ad Recommendation would allow the operating system to analyze your phone usage and behavior thus throwing ads and pop-up recommendations based on what you’ve searched for in the past or by how you use your Xiaomi Smartphone.',
    ads_step_16_steps: '1. Open System Setting\n2. Navigate to Password & security\n3. Tap on Privacy',
    ads_step_16_specialNote: '',

    ads_step_17_appname: 'Glance for Mi',
    ads_step_17_title: 'Lock Screen Ads',
    ads_step_17_subtitle: 'All the ads that appear on the lockscreen.',
    ads_step_17_detail: 'All the ads that appear on the lockscreen can be disabled by following two simple steps.',
    ads_step_17_steps:
      '1. Open System Setting\n2. Navigate to Always-on display & Lock screen\n3. Tap on Glance for Mi\n4. Tap on Privacy Policy\n5. Turn off Recommended for you.',
    ads_step_17_specialNote: '',

    iap_navigation_title: 'Unlock dark theme',
    iap_title: 'Thanks you for installing MIUIAdsHelper',
    iap_desc: 'You can show your appreciation for my work by making a small donation. This will help me to continue work on this app.',
    iap_item_1: 'Cup of Tea',
    iap_item_1_desc: 'Buy me a cup of tea',
    iap_item_2: 'Pizza',
    iap_item_2_desc: 'Buy me a Pizza',
    iap_item_3: 'Lunch',
    iap_item_3_desc: 'Buy me a Lunch',
    iap_item_4: 'Above All Items',
    iap_item_4_desc: 'Buy me above all items',
    iap_buy: 'BUY',
    iap_purchased_already: 'You have already purchased!',
    iap_purchased_success: 'Congratulations, Purchase successful!',

    about_change_language: 'Change Language',
    about_rate_playstore: 'Rate app on Playstore',
    about_terms_service: 'Terms of service',
    about_privacy_policy: 'Privacy Policy',
    about_credits: 'Credits',
    about_copy_right_name: 'Gajjar Tejas',
    about_copy_right: 'Copyright 2020-2021',
    about_github: 'Contribute on Github',
    about_russian_translation: 'Thanks to the user Heathcliff for the Russian language translation.',
    ads_detail_app_not_available: 'Probably this application is not installed on your phone!',
    ads_detail_desc: 'Description',
    ads_detail_open: 'Open',
    ads_detail_settings: 'Settings',
    ads_detail_steps: 'Steps',
    navigator_screen_title_home: 'Home',
    navigator_screen_title_about: 'About',
    navigator_screen_title_detail: 'Detail',
    navigator_screen_title_language: 'Select Language',
    navigator_screen_title_theme: 'Select Theme',
    navigator_screen_title_license: 'License',
  },
  ru: {
    ads_step_0_appname: 'Музыка',
    ads_step_0_title: 'Mi Музыка Приложение',
    ads_step_0_subtitle:
      'Mi Музыка Плеер - это собственный музыкальный проигрыватель Miui, разработанный специально для поклонников Mi. С Mi Музыка играть местные песни будет намного проще.',
    ads_step_0_detail:
      'Mi Музыка Плеер - это собственный музыкальный проигрыватель Miui, разработанный специально для поклонников Mi. С Mi Музыка играть местные песни будет намного проще.',
    ads_step_0_steps:
      '1 Откройте Mi Музыка приложение.\n2. Зайдите в настройки приложения.\n3. Зайдите в расширенные настройки.\n4. Выключите опцию "Показывать рекламу"',
    ads_step_0_specialNote: '',

    ads_step_1_appname: 'Mi Видео',
    ads_step_1_title: 'Mi Видео Приложение',
    ads_step_1_subtitle:
      'Mi Видеоплеер - это собственный видео проигрыватель Miui, разработанный специально для поклонников Mi. С Mi Видео проигрывать местные видео будет намного проще.',
    ads_step_1_detail:
      'Mi Видеоплеер - это собственный видео проигрыватель Miui, разработанный специально для поклонников Mi. С Mi Видео проигрывать местные видео будет намного проще.',
    ads_step_1_steps: '1. Откройте Mi Видеоплеер приложение.\n2. В вкладке аккаунта нажмите настройки\n3. Выключите рекомендации',
    ads_step_1_specialNote: '',

    ads_step_2_appname: 'Темы',
    ads_step_2_title: 'Темы приложение',
    ads_step_2_subtitle: 'Темы приложения - это собственное приложения тематики Miui, разработанное специально для поклонников Mi.',
    ads_step_2_detail: 'Темы приложения - это собственное приложения тематики Miui, разработанное специально для поклонников.',
    ads_step_2_steps: '1.Откройте приложения Темы.\n2. Нажмите на последнюю вкладку настройки\n3. Нажмите выключить рекомендации ',
    ads_step_2_specialNote: 'Вы должны найти настройки рекламы вручную',

    ads_step_3_appname: 'Проводник',
    ads_step_3_title: 'Mi Проводник',
    ads_step_3_subtitle:
      'Mi Проводник это бесплатный безопасный инструмент, который поможет вам быстрее находить файлы, проще управлять файлами и делиться ими без подключения к интернету с другими',
    ads_step_3_detail:
      'Mi Проводник  это бесплатный безопасный инструмент, который поможет вам быстрее находить файлы, проще управлять файлами и делиться ими без подключения к интернету с другими',
    ads_step_3_steps:
      '1. Откройте приложение  Мi проводник.\n2. Нажмите на три горизонтальные линии в верхнем углу проводника.\n3. Зайдите в настройки информация.\n4. Выключите рекомендации.',
    ads_step_3_specialNote: ' Вы должны вручную найти параметры рекламы.',

    ads_step_4_appname: 'Браузер',
    ads_step_4_title: 'Mi Браузер',
    ads_step_4_subtitle: 'Mi Браузер - это приложение из категории просмотра, лицензия на которое предоставляется бесплатно на английском языке.',
    ads_step_4_detail: 'Mi Browser - это приложение из категории просмотра, лицензия на которое предоставляется бесплатно на английском языке. ',
    ads_step_4_steps:
      '1. Откройте Мi Браузер.\n2. Перейдите в MIUI настройки браузера.\n3. Перейдите в расширенные>порядок верхних сайтов. если параметр порядка верхних сайтов отсутствует, ищите все варианты, пока не найдете вариант рекомендаций.\n4. Выключите опцию получать рекомендации.',
    ads_step_4_specialNote: '',

    ads_step_5_appname: 'Загрузки',
    ads_step_5_title: 'Приложение Загрузки',
    ads_step_5_subtitle: 'Приложение Mi Загрузки - это встроенный загрузчик MIUI, предназначенный только для поклонников Mi.',
    ads_step_5_detail: 'Приложение Mi Загрузки - это встроенный загрузчик MIUI, предназначенный только для поклонников Mi.',
    ads_step_5_steps:
      '1. Откройте приложение Загрузки.\n2.Нажмите на три точки в верхнем углу экрана.\n3. Зайдите в настройки.\n4. Выключите опцию получать рекомендации .',
    ads_step_5_specialNote: 'Вы должны вручную найти параметры рекламы',

    ads_step_6_appname: 'Безопасность',
    ads_step_6_title: 'Приложение Безопасности',
    ads_step_6_subtitle: 'Приложение безопасности Mi - это приложение безопасности по умолчанию, разработанное для фанатов Mi.',
    ads_step_6_detail: 'Приложение безопасности Mi - это приложение безопасности по умолчанию, разработанное для фанатов Mi.',
    ads_step_6_steps:
      '1. Откройте приложение безопасности Мi.\n2. Нажмите значок шестеренки в верхней части экрана.\n3. Пролистайте вниз и найдете опцию получать рекомендации.',
    ads_step_6_specialNote: '',

    ads_step_7_appname: 'Очистка',
    ads_step_7_title: 'Приложение Mi Очистка',
    ads_step_7_subtitle: 'Приложение Mi Очистка это приложение безопасности по умолчанию, разработанное для фанатов Mi.',
    ads_step_7_detail: 'Приложение Mi Очистка это приложение безопасности по умолчанию, разработанное для фанатов Mi.',
    ads_step_7_steps: '1. Откройте приложение Очистки.\n2. Нажмите на шестеренку в верхнем углу экрана .\n3. Выключите опцию получать рекомендации.',
    ads_step_7_specialNote: '',

    ads_step_8_appname: 'Защита',
    ads_step_8_title: 'Приложение Защиты',
    ads_step_8_subtitle: 'Блокировка приложений является частью приложения безопасности Mi, разработанного для фанатов Mi.',
    ads_step_8_detail: 'Блокировка приложений является частью приложения безопасности Mi, разработанного для фанатов Mi.',
    ads_step_8_steps:
      '1. Откройте Mi приложение защиты.\n2.Нажмите на блокировку приложение.\n3. Зайдите в настройки в верхнем углу экрана.\n4. Выключите показывать рекомендации .',
    ads_step_8_specialNote: '',

    ads_step_9_appname: 'Приложение Ускорения',
    ads_step_9_title: 'Приложение Ускорения',
    ads_step_9_subtitle: 'Приложение Ускорение - часть приложения безопасности Mi, предназначенного для очистки кеша памяти.',
    ads_step_9_detail: 'Приложение Ускорение - часть приложения безопасности Mi, предназначенного для очистки кеша памяти.',
    ads_step_9_steps:
      '1.  Откройте приложение Безопасности Mi .\n2.Нажмите на ускорение \n3. Нажмите на шестеренку в верхнем углу экрана.\n4. Выключите рекомендации.',
    ads_step_9_specialNote: 'Приложение Ускорения',

    ads_step_10_appname: '',
    ads_step_10_title: 'Приложение для управления приложениями ',
    ads_step_10_subtitle: 'Приложение Manage Apps является частью приложения безопасности Mi, которое предназначено для удаления приложений.',
    ads_step_10_detail: 'Приложение Manage Apps является частью приложения безопасности Mi, которое предназначено для удаления приложений.',
    ads_step_10_steps:
      '1. Откройте приложение Mi Безопасности .\n2. Нажмите на Управление приложениями. \n3. Нажмите на три точки в верхнем углу экрана \n4. Нажмите выключить рекомендации',
    ads_step_10_specialNote: '',

    ads_step_11_appname: 'Приложение MSA ',
    ads_step_11_title: 'Приложение MSA ',
    ads_step_11_subtitle: 'Miui Daemon - шпионское ПО от Xiaomi. Он собирает много ваших данных и отправляет их на серверы Xiaomi.',
    ads_step_11_detail:
      'Miui Daemon - шпионское ПО от Xiaomi. Он собирает много ваших данных и отправляет их на серверы Xiaomi. MSA - это рекламное приложение Xiaomi, которое показывает рекламные уведомления и также представляет угрозу безопасности. ',
    ads_step_11_steps:
      '1.  Зайдите в настройки\n2. Перейдите к дополнительным настройкам \n3. Авторизация и отзывы \n4. Нажмите на MSA И MiuiDeamon \n5.Отмените авторизацию ',
    ads_step_11_specialNote: 'Вы должны вручную найти настройку рекламы.',

    ads_step_12_appname: 'Настройки',
    ads_step_12_title: 'Рекламный идентификатор',
    ads_step_12_subtitle: 'Когда рекомендации отключены, вы по-прежнему будете видеть рекламу того же качества, что и при ее включении. ',
    ads_step_12_detail:
      'Когда рекомендации отключены, вы по-прежнему будете видеть рекламу того же качества, что и при ее включении, но они не будут основаны на данных о вашем поведении или вашей личной информации.',
    ads_step_12_steps:
      '1. Зайдите в настройки.\n2. Перейдите к дополнительным настройкам > Приватность > Рекламные услуги .\n3. Отключите персонализированные рекомендации по рекламе.',
    ads_step_12_specialNote: '',

    ads_step_13_appname: 'Папка приложения',
    ads_step_13_title: 'Папка приложения ',
    ads_step_13_subtitle: 'Отключите переключатель "Продвигаемые приложения". Это нужно сделать с каждой папкой .',
    ads_step_13_detail: 'Отключите переключатель "Продвигаемые приложения". Это нужно сделать с каждой папкой.',
    ads_step_13_steps:
      '1. Нажмите на папку, в которой вы хотите отключить рекламу / Продвигаемые приложения. \n2. Нажмите на имя папки. \n3. Отключить переключатель "Продвигаемые приложения" . Это нужно сделать для каждой папки на MIUI.',
    ads_step_13_specialNote: 'Применимо только к пусковой установке по умолчанию MIUI.  Вы должны вручную найти свою папку .',

    ads_step_14_appname: 'Недавние приложения ',
    ads_step_14_title: 'Недавние приложения ',
    ads_step_14_subtitle: 'Отключить предложения из меню "Главный экран" и "Недавние" .',
    ads_step_14_detail: 'Отключить предложения из меню «Главный экран» и «Недавние». ',
    ads_step_14_steps: '1. Откройте системные настройки \n2. Перейдите к главному экрану и недавним \n3. Отключите Показать предложения .',
    ads_step_14_specialNote: '',

    ads_step_15_appname: 'Приложения Google',
    ads_step_15_title: 'Конфиденциальность приложений Google',
    ads_step_15_subtitle: 'Отключите использование и диагностику, идентификатор рекламы и персонализацию.',
    ads_step_15_detail:
      'Сбросьте или отключите идентификатор рекламы, отключите ведение журнала отладки для рекламы и отключите использование и диагностику.',
    ads_step_15_steps: '1. Откройте Настройки системы\n2. Перейдите в Google\n3. Выберите Подходящий вариант.',
    ads_step_15_specialNote: '',

    ads_step_16_appname: 'Персонализированные Рекомендации По рекламе',
    ads_step_16_title: 'Отключение Персонализированных Рекламных Рекомендаций и сбора Пользовательских данных',
    ads_step_16_subtitle: 'Отключение Персонализированных рекламных Рекомендаций и Сбора Пользовательских данных.',
    ads_step_16_detail:
      'Персонализированные рекомендации по рекламе позволят операционной системе анализировать использование и поведение вашего телефона, таким образом, предоставляя рекламные объявления и всплывающие рекомендации, основанные на том, что вы искали в прошлом, или на том, как вы используете свой смартфон Xiaomi.',
    ads_step_16_steps: '1. Откройте Настройки системы\n2. Перейдите к разделу Пароль и безопасность\n3. Нажмите на Конфиденциальность',
    ads_step_16_specialNote: '',

    ads_step_17_appname: 'Взгляд на Ми',
    ads_step_17_title: 'Блокировка Рекламы На Экране',
    ads_step_17_subtitle: 'Все объявления, которые появляются на экране блокировки.',
    ads_step_17_detail: 'Все объявления, которые появляются на экране блокировки, можно отключить, выполнив два простых шага.',
    ads_step_17_steps:
      '1. Откройте Настройки системы\n2. Перейдите к постоянно включенному экрану отображения и блокировки\n3. Нажмите "Взгляд", чтобы найти Mi\n4. Нажмите на Политику конфиденциальности\n5. Выключите рекомендованное для вас.',
    ads_step_17_specialNote: '',

    iap_navigation_title: 'Разблокируйте темную тему',
    iap_title: 'Спасибо вам за установку MIUIAdsHelper',
    iap_desc:
      'Вы можете выразить свою признательность за мою работу, сделав небольшое пожертвование. Это поможет мне продолжить работу над этим приложением.',
    iap_item_1: 'Чашка чая',
    iap_item_1_desc: 'Купи мне чашку чая',
    iap_item_2: 'Пицца',
    iap_item_2_desc: 'Купи мне пиццу',
    iap_item_3: 'Обед',
    iap_item_3_desc: 'Купи мне ланч',
    iap_item_4: 'Выше Всех Пунктов',
    iap_item_4_desc: 'Купи мне прежде всего предметы',
    iap_buy: 'ПОКУПАТЬ',
    iap_purchased_already: 'Вы уже сделали покупку!',
    iap_purchased_success: 'Поздравляем, покупка удачная!',

    about_change_language: 'Изменить язык ',
    about_rate_playstore: 'Оцените приложение в Плей Маркете ',
    about_terms_service: 'Условия использования ',
    about_privacy_policy: 'Политика конфиденциальности',
    about_credits: 'Кредиты ',
    about_copy_right_name: 'Gajjar Tejas',
    about_copy_right: 'Авторские права 2020-2021',
    about_github: 'Добавить на Github ',
    about_russian_translation: 'Спасибо пользователю Heathcliff за перевод на русский язык.',
    ads_detail_app_not_available: 'Возможно это приложение не установлено на вашем телефоне! ',
    ads_detail_desc: 'Описание',
    ads_detail_open: 'Открыть',
    ads_detail_settings: 'Настройки',
    ads_detail_steps: 'Шаги',
    navigator_screen_title_home: 'Начало',
    navigator_screen_title_about: 'Насчет',
    navigator_screen_title_detail: 'Детали',
    navigator_screen_title_language: 'Выберите язык',
    navigator_screen_title_theme: 'Выберите тему ',
    navigator_screen_title_license: 'Лицензия',
  },
});

export default strings;
