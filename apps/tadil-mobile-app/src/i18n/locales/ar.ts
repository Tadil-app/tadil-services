export const ar = {
  common: {
    units: {
      cm: "سم",
      inch: "بوصة",
    },
    currencies: {
      sar: "ر.س",
      usd: "$",
    },
    categories: {
      all: "الكل",
      men: "رجالي",
      women: "نسائي",
      kids: "أطفال",
    },
    price: "السعر",
    optional: "اختياري",
    buttons: {
      save: "حفظ",
      cancel: "إلغاء",
      addToCart: "أضف إلى السلة",
      transfer: "تحويل",
      leave: "مغادرة",
      change: "تغيير",
    },
    inputs: {
      imageInput: {
        placeholder: "اضغط للرفع",
        info: "PNG, JPG حتى 10 ميجابايت",
        sourceModal: {
          title: "اختر المصدر",
          camera: "الكاميرا",
          gallery: "المعرض",
        },
      },
    },
    alerts: {
      unsavedChanges: {
        header: "تغييرات غير محفوظة",
        message: "لديك تعديلات غير محفوظة. هل أنت متأكد أنك تريد المغادرة؟",
      },
      changePhoto: {
        header: "تغيير الصورة؟",
        message: "سيؤدي هذا إلى إزالة جميع النقاط الحالية.",
      },
      zoneOptions: {
        header: "خيارات المنطقة",
        addNew: "إضافة تعديل جديد",
        removeAll: "إزالة جميع التعديلات",
      },
      noAlterations: "يرجى إضافة تعديل واحد على الأقل.",
      itemAdded: "تم إضافة القطعة إلى السلة بنجاح.",
    },
    errors: {
      voiceRecorder: {
        permissionDenied: "مطلوب إذن الميكروفون لتسجيل الرسائل الصوتية.",
        startFailed: "فشل بدء التسجيل.",
        saveFailed: "فشل حفظ الرسالة الصوتية.",
      },
      loadModels: "فشل تحميل النماذج.",
      loadImages: "فشل تحميل صور النموذج.",
      loadAlterations: "فشل تحميل التعديلات.",
      loadOrders: "فشل تحميل الطلبات.",
      addToCartFailed: "فشل إضافة القطعة إلى السلة.",
      uploadImage: "فشل رفع الصورة.",
      requiredField: "هذا الحقل مطلوب",
    },
  },
  login: {
    form: {
      phoneNumber: {
        label: "رقم الجوال",
        placeholder: "ادخل رقم الجوال",
        undefinedErrorMessage: "رقم الجوال مطلوب",
        numericErrorMessage: "رقم الجوال يجب ان يكون رقم",
        lengthErrorMessage: "رقم الجوال يجب ان يكون 10 رقم",
      },
      signup: {
        title: "أكمل ملفك الشخصي",
        firstName: {
          label: "الاسم الأول",
          placeholder: "أدخل اسمك الأول",
        },
        lastName: {
          label: "الاسم الأخير",
          placeholder: "أدخل اسمك الأخير",
        },
      },
      status: {
        pending: "طلب تسجيل الدخول الخاص بك قيد انتظار موافقة المسؤول.",
        rejected: "تم رفض طلب تسجيل الدخول الخاص بك.",
      },
      buttons: {
        login: "تسجيل الدخول",
        signup: "إنشاء حساب",
        back: "رجوع",
      },
    },
  },
  profileSettings: {
    title: "الاعدادات",
    profile: {
      title: "ادارة الملف الشخصي",
      firstName: "الاسم الأول",
      lastName: "الاسم الأخير",
      phoneNumber: "رقم الجوال",
      email: "البريد الالكتروني (اختياري)",
      addresses: "العناوين",
      noAddresses: "لا يوجد عناوين",
      addAddress: "إضافة عنوان",
      editAddress: "تعديل العنوان",
      city: "المدينة",
      district: "الحي",
      street: "الشارع",
    },
    preferences: {
      title: "التفضيلات",
      language: "اللغة",
      darkTheme: "الوضع الداكن",
    },
    identity: {
      title: "الهوية",
      logAsTailor: "تسجيل الدخول كخياط",
      logAsCustomer: "تسجيل الدخول كعميل",
      logout: "تسجيل الخروج",
    },
  },
  modelCategory: {
    title: "اختر الفئة",
    all: "جميع الفئات",
    men: "تعديل ملابس رجال",
    women: "تعديل ملابس نساء",
    kids: "تعديل ملابس اطفال",
  },
  orderStatus: {
    all: "الكل",
    pending: "قيد الانتظار",
    waitingForTailorAssignement: "في انتظار تعيين الخياط",
    waitingForCourierAssignement: "في انتظار تعيين المندوب",
    waitingForPickupFromCustomer: "في انتظار الاستلام من العميل",
    waitingForDropoffToTailor: "في انتظار التسليم للخياط",
    inProgress: "قيد التنفيذ",
    waitingForReturnCourierAssignement: "في انتظار تعيين مندوب الإرجاع",
    waitingForPickupFromTailor: "في انتظار الاستلام من الخياط",
    waitingForDropoffToCustomer: "في انتظار التسليم للعميل",
    done: "مكتمل",
  },
  modelMode: {
    title: "اختر النمط",
    predefined: {
      title: "نماذج جاهزة",
      description: "اختر من نماذجنا الجاهزة",
    },
    custom: {
      title: "مخصص",
      description: "ارفع صورة للتعديل",
    },
  },
  predefinedModelsList: {
    title: "النماذج",
  },
  customModel: {
    title: "اختر الفئة",
    upload: "ارفع صورتك",
    instructions: "اضغط على أجزاء قطعة الملابس التي ترغب في تعديلها",
    changePhoto: "تغيير الصورة",
    pointSelection: "اختيار نقطة مخصصة",
    categories: {
      dress: "فستان",
      shirt: "قميص",
      pants: "بنطال",
      sweater: "سترة",
      coat: "معطف",
      suit: "بدلة",
    },
  },
  alterationForm: {
    alterationType: "اختر نوع التعديل",
    extrasPrice: "تكلفة اضافية",
    price: "السعر الإجمالي",
    noMoreAlterations: "لا توجد تعديلات إضافية متاحة لهذا القسم",
  },
  cart: {
    title: "السلة",
    showDetails: "عرض التفاصيل",
    hideDetails: "إخفاء التفاصيل",
    emptyTitle: "سلتك فارغة",
    emptyDescription: "أضف بعض التعديلات لتراها هنا",
    shopNow: "تسوق الآن",
    alterations: "تعديلات",
    moreImages: "صور إضافية",
    zone: "المنطقة",
    alteration: "التعديل",
    price: "السعر",
    itemsCount: "إجمالي القطع",
    totalPrice: "السعر الإجمالي",
    clearAll: "مسح الكل",
    checkout: "الدفع",
  },
  cartEdit: {
    title: "تعديل القطعة",
    save: "حفظ",
    cancel: "الغاء",
    priceCard: {
      title: "تفاصيل السعر",
      basePrice: "السعر الاساسي",
      extrasPrice: "تكلفة اضافية",
      totalPrice: "السعر الإجمالي",
    },
  },
  customer: {
    dashboard: {
      title: "لوحة التحكم الخاصة بي",
      recentOrders: "الطلبات الحديثة",
    },
    ordersHistory: {
      title: "سجل الطلبات",
      subtitle: "تتبع طلبات التعديل الخاصة بك",
      search: "بحث برقم المرجع...",
    },
  },
  chat: {
    placeholder: "اكتب رسالة...",
    recording: "جاري التسجيل...",
    mockMessages: {
      customer: "مرحباً، هل يمكنك فعل هذا؟",
      tailor: "نعم بالطبع، يمكننا فعل ذلك من أجلك.",
    },
  },
  tailor: {
    navBar: {
      dashboard: "الملخص",
      orders: "الطلبات",
      wallet: "المحفظة",
    },
    dashboard: {
      title: "الملخص",
    },
    orders: {
      title: "قائمة الطلبات",
      subtitle: "ادارة الطلبات",
      search: "ابحث عن الطلبات...",
    },
    wallet: {
      title: "المحفظة",
      subtitle: "ادارة المحفظة",
      currentBalance: "الرصيد الحالي",
      income: "الدخل",
      transfers: "التحويلات",
      recentTransaction: "المعاملات الحديثة",
      payementRecieved: "الدفعات المستلمة",
      transferSent: "التحويلات المرسلة",
    },
    orderDetails: {
      title: "تفاصيل الطلب",
      reference: "الرقم التعريفي",
      referenceLabel: "المرجع",
      alterations: {
        title: "التعديلات",
      },
      chat: {
        title: "الدردشة مع العميل",
      },
      acceptOrder: {
        buttonText: "قبول الطلب",
        successMessage: "تم قبول الطلب بنجاح",
        errorMessage: "حدث خطأ اثناء قبول الطلب",
      },
      declineOrder: {
        buttonText: "رفض الطلب",
        successMessage: "تم رفض الطلب بنجاح",
        errorMessage: "حدث خطأ اثناء رفض الطلب",
      },
      markOrderAsCompleted: {
        buttonText: "انهاء الطلب",
        successMessage: "تم انهاء الطلب بنجاح",
        errorMessage: "حدث خطأ اثناء انهاء الطلب",
      },
    },
  },
};
