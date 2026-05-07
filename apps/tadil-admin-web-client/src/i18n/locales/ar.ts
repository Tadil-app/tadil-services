export const ar = {
  nav: {
    informations: "البيانات المطلوبة",
    alterations: "التعديلات",
    extras: "إضافات",
    models: "النماذج",
    users: "المستخدمين",
  },
  common: {
    currencies: {
      ras: "ر.س",
      usd: "$",
    },
    tableHeaders: {
      id: "المعرّف",
      englishName: "الاسم الإنجليزي",
      arabicName: "الاسم العربي",
      hindiName: "الاسم الهندي",
      bengaliName: "الاسم البنغالي",
      urduName: "الاسم الأردي",
      value: "القيمة",
      unit: "الوحدة",
      price: "السعر",
      actions: "الإجراءات",
    },
    inputs: {
      englishName: {
        label: "الاسم الإنجليزي",
        placeholder: "أدخل الاسم الإنجليزي",
        errorMessage: "الاسم الإنجليزي مطلوب",
      },
      arabicName: {
        label: "الاسم العربي",
        placeholder: "أدخل الاسم العربي",
        errorMessage: "الاسم العربي مطلوب",
      },
      hindiName: {
        label: "الاسم الهندي",
        placeholder: "أدخل الاسم الهندي",
        errorMessage: "الاسم الهندي مطلوب",
      },
      bengaliName: {
        label: "الاسم البنغالي",
        placeholder: "أدخل الاسم البنغالي",
        errorMessage: "الاسم البنغالي مطلوب",
      },
      urduName: {
        label: "الاسم الأردي",
        placeholder: "أدخل الاسم الأردي",
        errorMessage: "الاسم الأردي مطلوب",
      },
      category: {
        options: {
          all: "الجميع",
          men: "الرجال",
          women: "النساء",
          kids: "الاطفال",
        },
        label: "الفئة",
        placeholder: "اختر الفئة",
        errorMessage: "الفئة مطلوبة",
        validation: {
          required: "الفئة مطلوبة",
        },
      },
      unit: {
        label: "الوحدة (اختياري)",
        placeholder: "اختر الوحدة",
        errorMessage: "الوحدة مطلوبة",
        options: {
          cm: "سم",
          inch: "انش",
        },
      },
      infoType: {
        label: "نوع البيانات",
        placeholder: "اختر نوع البيانات",
        errorMessage: "نوع البيانات مطلوب",
        options: {
          text: "نص",
          number: "رقم",
          selectMenu: "قائمة اختيارات",
          checkbox: "خانة اختيار",
          required: "مطلوب",
          optional: "اختياري",
        },
      },
      imageFile: {
        label: "الصورة",
        placeholder: "اختر صورة",
        errorMessage: "الصورة مطلوبة",
      },
      price: {
        label: "السعر",
        placeholder: "0.00",
        errorMessage: "السعر مطلوب",
      },
      sections: {
        label: "الأقسام",
        placeholder: "اختر الأقسام",
        errorMessage: "الأقسام مطلوبة",
      },
      informations: {
        label: "البيانات",
        placeholder: "اختر البيانات",
        errorMessage: "البيانات مطلوبة",
      },
      alterations: {
        label: "التعديلات",
        placeholder: "اختر التعديلات",
        errorMessage: "التعديلات مطلوبة",
      },
      extras: {
        label: "الاضافات",
        placeholder: "اختر الاضافات",
        errorMessage: "الاضافات مطلوبة",
      },
      userRole: {
        label: "نوع المستخدم",
        placeholder: "اختر نوع المستخدم",
        errorMessage: "نوع المستخدم مطلوب",
      },
      phone: {
        label: "رقم الجوال",
        placeholder: "اختر رقم الجوال",
        undefinedErrorMessage: "رقم الجوال مطلوب",
        numericErrorMessage: "رقم الجوال يجب ان يكون رقم",
        lengthErrorMessage: "رقم الجوال يجب ان يكون 10 رقم",
      },
      firstName: {
        label: "الاسم الاول",
        placeholder: "اختر الاسم الاول",
        errorMessage: "الاسم الاول مطلوب",
      },
      lastName: {
        label: "الاسم الاخير",
        placeholder: "اختر الاسم الاخير",
        errorMessage: "الاسم الاخير مطلوب",
      },
      email: {
        label: "البريد الالكتروني",
        placeholder: "اختر البريد الالكتروني",
        errorMessage: "البريد الالكتروني مطلوب",
      },
    },
    buttons: {
      cancel: "إلغاء",
      add: "إضافة",
      save: "حفظ",
      delete: "حذف",
      confirm: "تاكيد",
    },
  },
  informations: {
    noInformations: {
      title: "لا توجد بيانات متاحة",
      subTitle: "أضف بيانات للبدء",
    },
    addNewInformationModal: {
      title: "إضافة بيانات جديدة",
      success: "تم إنشاء البيانات بنجاح",
      error: "حدث خطأ أثناء إضافة البيانات",
    },
    editInformationModal: {
      title: "تعديل البيانات",
      success: "تم تحديث البيانات بنجاح",
      error: "حدث خطأ أثناء تحديث البيانات",
    },
    deleteInformation: {
      title: "هل أنت متأكد من أنك تريد حذف هذه البيانات؟",
      confirmMessage: "هل أنت متأكد من أنك تريد حذف هذه البيانات؟",
      success: "تم حذف البيانات بنجاح",
      error: "حدث خطأ أثناء حذف البيانات",
    },
  },
  models: {
    noModels: {
      title: "لا توجد نماذج متاحة",
      subTitle: "أضف نموذجًا للبدء",
    },
    modelsListCard: {
      sections: "الأقسام",
    },
    noModelSelected: {
      title: "لم يتم اختيار أي نموذج",
      subTitle: "اختر نموذجًا من القائمة",
    },
    addNewModelModal: {
      title: "إضافة نموذج جديد",
      success: "تم إنشاء النموذج بنجاح",
      error: "حدث خطأ أثناء إنشاء نموذج جديد",
    },
    editModel: {
      title: "أسماء النموذج",
      success: "تم تحديث النموذج بنجاح",
      error: "حدث خطأ أثناء تحديث النموذج",
    },
    deleteModel: {
      confirmMessage: "هل أنت متأكد من أنك تريد حذف هذا النموذج؟",
      deleteButton: "حذف النموذج",
      success: "تم حذف النموذج بنجاح",
      error: "حدث خطأ أثناء حذف النموذج",
    },
    images: {
      deleteImage: {
        confirmMessage: "هل أنت متأكد من أنك تريد حذف هذه الصورة؟",
        deleteButton: "حذف الصورة",
        success: "تم حذف الصورة بنجاح",
        error: "حدث خطأ أثناء حذف الصورة",
      },
    },
    sections: {
      title: "الأقسام",
      createSection: {
        addNewSection: "إضافة قسم جديد",
        drawTitle: "رسم القسم",
        formTitle: "تفاصيل القسم",
        coordinatesPlaceholder: "ارسم على الصورة واختر 3 نقاط على الأقل",
        coordinatesValidated: "تم اختيار القسم بنجاح",
        success: "تم إنشاء القسم بنجاح",
        error: "حدث خطأ أثناء إنشاء القسم",
      },
      editSection: {
        drawTitle: "تعديل رسم القسم",
        formTitle: "تعديل تفاصيل القسم",
        success: "تم تحديث القسم بنجاح",
        error: "حدث خطأ أثناء تحديث القسم",
      },
      deleteSection: {
        confirmMessage: "هل أنت متأكد من أنك تريد حذف هذا القسم؟",
        success: "تم حذف القسم بنجاح",
        error: "حدث خطأ أثناء حذف القسم",
      },
    },
  },
  alterations: {
    noAlterations: {
      title: "لا توجد تعديلات متاحة",
      subTitle: "أضف تعديل للبدء",
    },
    addNewAlterationModal: {
      title: "إضافة تعديل جديد",
      success: "تم إنشاء التعديل بنجاح",
      error: "حدث خطأ أثناء إنشاء تعديل جديد",
    },
    editAlterationModal: {
      title: "تعديل البيانات",
      success: "تم تحديث البيانات بنجاح",
      error: "حدث خطأ أثناء تحديث البيانات",
    },
    deleteAlteration: {
      confirmMessage: "هل أنت متأكد من أنك تريد حذف هذه البيانات؟",
      success: "تم حذف البيانات بنجاح",
      error: "حدث خطأ أثناء حذف البيانات",
    },
  },
  extras: {
    noExtras: {
      title: "لا توجد إضافات متاحة",
      subTitle: "أضف إضافة للبدء",
    },
    addNewExtraModal: {
      title: "إضافة إضافة جديدة",
      success: "تم إنشاء الإضافة بنجاح",
      error: "حدث خطأ أثناء إنشاء إضافة جديدة",
    },
    editExtraModal: {
      title: "تعديل الإضافة",
      success: "تم تحديث الإضافة بنجاح",
      error: "حدث خطأ أثناء تحديث الإضافة",
    },
    deleteExtra: {
      confirmMessage: "هل أنت متأكد أنك تريد حذف هذه الإضافة؟",
      success: "تم حذف الإضافة بنجاح",
      error: "حدث خطأ أثناء حذف الإضافة",
    },
  },
  users: {
    roles: {
      tailor: "مصمم",
      customer: "عميل",
      courier: "موزع",
    },
    tableHeaders: {
      firstName: "الاسم الاول",
      lastName: "الاسم الاخير",
      phone: "رقم الهاتف",
      email: "البريد الالكتروني",
    },
    addNewUserModal: {
      title: "اضافة مستخدم جديد",
      success: "تم انشاء المستخدم بنجاح",
      error: "حدث خطاء في انشاء المستخدم",
    },
    editUserModal: {
      title: "تعديل المستخدم",
      success: "تم تحديث المستخدم بنجاح",
      error: "حدث خطاء في تحديث المستخدم",
    },
    deleteUser: {
      confirmMessage: "هل انت متاكد من حذف هذا المستخدم؟",
      success: "تم حذف المستخدم بنجاح",
      error: "حدث خطاء في حذف المستخدم",
    },
  },
  toast: {
    showDetails: "عرض التفاصيل",
    hideDetails: "اخفاء التفاصيل",
  },
};
