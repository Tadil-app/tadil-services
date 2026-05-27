export const ur = {
  common: {
    units: {
      cm: "سینٹی میٹر",
      inch: "انچ",
    },
    currencies: {
      sar: "سعودی ریال",
      usd: "$",
    },
    categories: {
      all: "تمام",
      men: "مردانہ",
      women: "خواتین",
      kids: "بچوں کے",
    },
    price: "قیمت",
    avatar: "پروفائل تصویر",
    optional: "اختیاری",
    noAddress: "کوئی پتہ فراہم نہیں کیا گیا",
    buttons: {
      save: "محفوظ کریں",
      cancel: "منسوخ کریں",
      addToCart: "کارٹ میں شامل کریں",
      leave: "چھوڑ دیں",
      change: "تبدیل کریں",
      transfer: "منتقل کریں",
    },
    messages: {
      actionSuccess: "عمل کامیاب رہا",
      actionError: "عمل ناکام رہا",
      confirmReceiptSuccess: "وصولی کی تصدیق ہو گئی! آرڈر اب مکمل ہو گیا ہے!",
      confirmReceiptError: "وصولی کی تصدیق کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
      markReadySuccess: "آرڈر واپسی کے لیے تیار نشان زد کر دیا گیا ہے۔",
      markReadyError: "تیار نشان زد کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
    },
    inputs: {
      imageInput: {
        placeholder: "اپ لوڈ کرنے کے لیے کلک کریں",
        info: "PNG, JPG زیادہ سے زیادہ 10MB",
        sourceModal: {
          title: "ذریعہ منتخب کریں",
          camera: "کیمرہ",
          gallery: "گیلری",
        },
      },
    },
    alerts: {
      unsavedChanges: {
        header: "غیر محفوظ شدہ تبدیلیاں",
        message: "آپ کے پاس غیر محفوظ شدہ تبدیلیاں ہیں۔ کیا آپ واقعی چھوڑنا چاہتے ہیں؟",
      },
      changePhoto: {
        header: "تصویر تبدیل کریں؟",
        message: "اس سے آپ کے تمام موجودہ پوائنٹس ختم ہو جائیں گے۔",
      },
      zoneOptions: {
        header: "زون کے اختیارات",
        addNew: "نئی تبدیلی شامل کریں",
        removeAll: "تمام تبدیلیاں ختم کریں",
      },
      noAlterations: "براہ کرم کم از کم ایک تبدیلی شامل کریں۔",
      itemAdded: "آئٹم کامیابی کے ساتھ کارٹ میں شامل کر دیا گیا۔",
      itemAddedOptions: {
        header: "آئٹم شامل ہو گیا",
        message: "آئٹم کامیابی کے ساتھ کارٹ میں شامل کر دیا گیا ہے۔ آپ آگے کیا کرنا چاہیں گے؟",
        viewCart: "کارٹ دیکھیں",
        continueShopping: "خریداری جاری رکھیں",
      },
    },
    errors: {
      voiceRecorder: {
        permissionDenied: "وائس میسجز ریکارڈ کرنے کے لیے مائیکروفون کی اجازت درکار ہے۔",
        startFailed: "ریکارڈنگ شروع کرنے میں ناکام۔",
        saveFailed: "وائس میسج محفوظ کرنے میں ناکام۔",
      },
      loadModels: "ماڈلز لوڈ کرنے میں ناکام۔",
      loadImages: "ماڈل کی تصاویر لوڈ کرنے میں ناکام۔",
      loadAlterations: "تبدیلیاں لوڈ کرنے میں ناکام۔",
      loadOrders: "آرڈرز لوڈ کرنے میں ناکام۔",
      addToCartFailed: "آئٹم کو کارٹ میں شامل کرنے میں ناکام۔",
      uploadImage: "تصویر اپ لوڈ کرنے میں ناکام۔",
      requiredField: "یہ فیلڈ مطلوبہ ہے",
    },
  },
  login: {
    form: {
      phoneNumber: {
        label: "فون نمبر",
        placeholder: "اپنا فون نمبر درج کریں",
        undefinedErrorMessage: "فون نمبر درکار ہے",
        numericErrorMessage: "فون نمبر ہندسوں میں ہونا چاہیے",
        lengthErrorMessage: "فون نمبر ۱۰ ہندسوں کا ہونا چاہیے",
      },
      signup: {
        title: "اپنی پروفائل مکمل کریں",
        firstName: {
          label: "پہلا نام",
          placeholder: "اپنا پہلا نام درج کریں",
        },
        lastName: {
          label: "آخری نام",
          placeholder: "اپنا آخری نام درج کریں",
        },
      },
      status: {
        pending: "آپ کی لاگ ان کی درخواست ایڈمن کی منظوری کے لیے زیر التوا ہے۔",
        rejected: "آپ کی لاگ ان کی درخواست مسترد کر دی گئی ہے۔",
      },
      buttons: {
        login: "لاگ ان",
        signup: "سائن اپ",
        back: "واپس",
      },
    },
  },
  profileSettings: {
    title: "سیٹنگز",
    profile: {
      title: "پروفائل کا انتظام کریں",
      firstName: "پہلا نام",
      lastName: "آخری نام",
      phoneNumber: "فون نمبر",
      email: "ای میل (اختیاری)",
      addresses: "پتے",
      noAddresses: "کوئی پتہ نہیں ملا",
      addAddress: "پتہ شامل کریں",
      editAddress: "پتہ تبدیل کریں",
      city: "شہر",
      district: "ضلع",
      street: "سڑک",
      updateError: "پروفائل اپ ڈیٹ کرنے میں ناکام",
    },
    preferences: {
      title: "ترجیحات",
      language: "زبان",
      darkTheme: "ڈارک تھیم",
    },
    identity: {
      title: "شناخت",
      logAsTailor: "درزی کے طور پر لاگ ان کریں",
      logAsCustomer: "گاہک کے طور پر لاگ ان کریں",
      logout: "لاگ آؤٹ",
    },
  },
  modelCategory: {
    title: "زمرہ منتخب کریں",
    all: "تمام زمرے",
    men: "مردوں کے لیے",
    women: "خواتین کے لیے",
    kids: "بچوں کے لیے",
  },
  order: {
    history: {
      title: "آرڈر کی پیشرفت",
    },
  },
  orderStatus: {
    all: "تمام",
    pending: "زیر التواء",
    waitingForTailorAssignement: "درزی کے تعین کا انتظار",
    waitingForCourierAssignement: "کوریئر کے تعین کا انتظار",
    waitingForPickupFromCustomer: "گاہک سے پک اپ کا انتظار",
    waitingForDropoffToTailor: "درزی کو پہنچانے کا انتظار",
    inProgress: "جاری ہے",
    waitingForReturnCourierAssignement: "واپسی کوریئر کے تعین کا انتظار",
    waitingForPickupFromTailor: "درزی سے پک اپ کا انتظار",
    waitingForDropoffToCustomer: "گاہک کو پہنچانے کا انتظار",
    done: "مکمل",
  },
  modelMode: {
    title: "موڈ منتخب کریں",
    predefined: {
      title: "موجودہ ماڈلز",
      description: "ہمارے پہلے سے موجود ماڈلز میں سے منتخب کریں",
    },
    custom: {
      title: "کسٹم",
      description: "اپنی تصویر اپ لوڈ کریں",
    },
  },
  predefinedModelsList: {
    title: "ماڈل منتخب کریں",
  },
  customModel: {
    title: "زمرہ منتخب کریں",
    upload: "اپنی تصویر اپ لوڈ کریں",
    instructions: "لباس کے ان حصوں پر کلک کریں جن میں آپ تبدیلی چاہتے ہیں",
    changePhoto: "تصویر تبدیل کریں",
    pointSelection: "کسٹم پوائنٹ سلیکشن",
    categories: {
      dress: "لباس",
      shirt: "قمیض",
      pants: "پتلون",
      sweater: "سویٹر",
      coat: "کوٹ",
      suit: "سوٹ",
    },
  },
  alterationForm: {
    alterationType: "الٹریشن کی قسم منتخب کریں",
    extrasPrice: "اضافی قیمت",
    price: "کل قیمت",
    noMoreAlterations: "اس حصے کے لیے مزید کوئی تبدیلی دستیاب نہیں ہے",
  },
  cart: {
    title: "کارٹ",
    showDetails: "تفصیلات دکھائیں",
    hideDetails: "تفصیلات چھپائیں",
    emptyTitle: "آپ کی کارٹ خالی ہے",
    emptyDescription: "انہیں یہاں دیکھنے کے لیے کچھ تبدیلیاں شامل کریں",
    shopNow: "ابھی خریداری کریں",
    alterations: "تبدیلیاں",
    moreImages: "مزید تصاویر",
    zone: "حصہ (Zone)",
    alteration: "الٹریشن/تبدیلی",
    price: "قیمت",
    itemsCount: "کل اشیاء",
    totalPrice: "کل قیمت",
    clearAll: "سب صاف کریں",
    clearConfirmMessage: "کیا آپ واقعی اپنا کارٹ خالی کرنا چاہتے ہیں؟ اس عمل کو واپس نہیں لیا جا سکتا۔",
    checkout: "چیک آؤٹ",
  },
  cartEdit: {
    title: "کارٹ کی اشیاء تبدیل کریں",
    save: "محفوظ کریں",
    cancel: "منسوخ کریں",
    priceCard: {
      title: "قیمت کی تفصیلات",
      basePrice: "اصل قیمت",
      extrasPrice: "اضافی قیمت",
      totalPrice: "کل قیمت",
    },
  },
  customer: {
    dashboard: {
      title: "میرا ڈیش بورڈ",
      recentOrders: "حالیہ آرڈرز",
      noOrders: "ابھی تک کوئی آرڈر نہیں ہے۔",
    },
    ordersHistory: {
      title: "آرڈر کی تاریخ",
      subtitle: "اپنی تمام سلائی کی درخواستوں کو ٹریک کریں",
      search: "حوالہ کے ذریعے تلاش کریں...",
      noOrders: "آپ کے معیار سے مطابقت رکھنے والے کوئی آرڈر نہیں ملے۔",
    },
    orderDetails: {
      confirmReceipt: "کوریئر سے وصولی کی تصدیق کریں",
      confirmReceiptSuccess: "وصولی کی تصدیق ہو گئی! آرڈر اب مکمل ہو گیا ہے!",
      confirmReceiptError: "وصولی کی تصدیق کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔",
    },
  },
  checkout: {
    address: {
      title: "ڈیلیوری ایڈریس منتخب کریں",
      empty: "آپ نے ابھی تک کوئی پتہ شامل نہیں کیا ہے۔",
      addInProfile: "پروفائل میں پتہ شامل کریں",
    },
    orderInfo: {
      reference: "آرڈر کا حوالہ:",
      totalAmount: "کل رقم:",
    },
    success: {
      title: "آرڈر دے دیا گیا!",
      message: "آپ کا آرڈر نمبر #{reference} کامیابی کے ساتھ دے دیا گیا ہے اور درزی کے تعین کا منتظر ہے۔",
    },
    buttons: {
      proceedToPayment: "ادائیگی کے لیے آگے بڑھیں",
      bypassPayment: "ادائیگی نظر انداز کریں (ٹیسٹنگ)",
    },
  },
  chat: {
    title: "آرڈر چیٹ",
    placeholder: "پیغام لکھیں...",
    recording: "آڈیو ریکارڈ ہو رہی ہے...",
    channels: {
      tailor: "درزی کے ساتھ چیٹ",
      courier: "کوریئر کے ساتھ چیٹ",
    },
    mockMessages: {
      customer: "ہیلو، میرا آرڈر کب تک تیار ہو جائے گا؟",
      tailor: "ہیلو، میں اس پر کام کر رہا ہوں۔ یہ کل تک تیار ہو جانا چاہیے۔",
    }
  },
  tailor: {
    navBar: {
      dashboard: "ہوم",
      orders: "آرڈرز",
      wallet: "والٹ",
    },
    dashboard: {
      title: "خلاصہ",
    },
    orders: {
      title: "آرڈرز کی فہرست",
      subtitle: "اپنے آرڈرز کا انتظام کریں",
      search: "آرڈرز تلاش کریں...",
    },
    wallet: {
      title: "والٹ",
      subtitle: "اپنے والٹ کا انتظام کریں",
      currentBalance: "موجودہ بیلنس",
      income: "کل آمدنی",
      transfers: "کل نکاسی",
      recentTransaction: "حالیہ لین دین",
      payementRecieved: "ادائیگی موصول ہوئی",
      transferSent: "منتقلی بھیجی گئی",
    },
    orderDetails: {
      title: "آرڈر کی تفصیلات",
      reference: "آرڈر کا حوالہ",
      referenceLabel: "حوالہ",
      confirmReceiptFromCourier: "کوریئر سے وصولی کی تصدیق کریں",
      markWorkAsReady: "کام کو تیار نشان زد کریں",
      alterations: {
        title: "تبدیلیاں",
      },
      chat: {
        title: "آرڈر چیٹ",
      },
      acceptOrder: {
        buttonText: "آرڈر قبول کریں",
        successMessage: "آرڈر کامیابی سے قبول کر لیا گیا",
        errorMessage: "آرڈر قبول کرنے میں خرابی",
      },
      declineOrder: {
        buttonText: "آرڈر مسترد کریں",
        successMessage: "آرڈر کامیابی سے مسترد کر دیا گیا",
        errorMessage: "آرڈر مسترد کرنے میں خرابی",
      },
      markAsCompleted: {
        buttonText: "مکمل نشان زد کریں",
        successMessage: "آرڈر کامیابی سے مکمل نشان زد کر دیا گیا",
        errorMessage: "آرڈر مکمل نشان زد کرنے میں خرابی",
      },
    },
  },
  courier: {
    dashboard: {
      noPendingPickups: "کوئی زیر التواء پک اپ دستیاب نہیں ہے",
    },
    orders: {
      noOrders: "کوئی آرڈر نہیں ملا",
      newAssignment: "نئی تفویض",
      returnTrip: "واپسی کا سفر",
    },
    orderDetails: {
      confirmPickup: "پک اپ کی تصدیق کریں",
      confirmPickupFromCustomer: "گاہک سے پک اپ کی تصدیق کریں",
      confirmPickupFromTailor: "درزی سے پک اپ کی تصدیق کریں",
      deliverToTailor: "درزی کو پہنچائیں",
      deliverToCustomer: "گاہک کو پہنچائیں",
      markAsDelivered: "ڈیلیور شدہ نشان زد کریں",
      deliveryAddress: "ڈیلیوری ایڈریس",
    },
  },
  wallet: {
    noTransactions: "کوئی لین دین نہیں ملا",
    payoutRequest: {
      title: "رقم نکالنے کی درخواست",
      amountLabel: "نکالنے کی رقم",
      submit: "درخواست جمع کرائیں",
      success: "رقم نکالنے کی درخواست کامیابی سے جمع کرائی گئی",
      error: "رقم نکالنے کی درخواست جمع کرانے میں ناکام",
      availableBalance: "دستیاب بیلنس",
    },
  },
};
