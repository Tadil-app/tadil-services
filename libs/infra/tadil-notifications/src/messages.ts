export type OrderPushEvent =
  /** A paid order is open to the tailors of its area. */
  | 'tailor.orderAvailable'
  /** An admin gave the order to one tailor. */
  | 'tailor.orderAssigned'
  /** The order needs a driver to bring it from the customer to the tailor. */
  | 'courier.pickupAvailable'
  /** The tailor finished: the order needs a driver back to the customer. */
  | 'courier.returnAvailable';

export type PushLocale = 'ar' | 'en' | 'ur' | 'hi' | 'bn';

const LOCALES: readonly PushLocale[] = ['ar', 'en', 'ur', 'hi', 'bn'];

type Texts = Record<OrderPushEvent, { title: string; body: string }>;

// `{ref}` is the order reference, e.g. TAD-123456.
const MESSAGES: Record<PushLocale, Texts> = {
  ar: {
    'tailor.orderAvailable': {
      title: 'طلب جديد متاح',
      body: 'الطلب {ref} بانتظار خياط في منطقتك. افتح التطبيق لقبوله.',
    },
    'tailor.orderAssigned': {
      title: 'تم إسناد طلب جديد إليك',
      body: 'تم إسناد الطلب {ref} إليك.',
    },
    'courier.pickupAvailable': {
      title: 'طلب توصيل جديد',
      body: 'الطلب {ref} بحاجة إلى استلام من العميل.',
    },
    'courier.returnAvailable': {
      title: 'طلب إرجاع جديد',
      body: 'الطلب {ref} جاهز لدى الخياط وبحاجة إلى توصيله للعميل.',
    },
  },
  en: {
    'tailor.orderAvailable': {
      title: 'New order available',
      body: 'Order {ref} is waiting for a tailor in your area. Open the app to accept it.',
    },
    'tailor.orderAssigned': {
      title: 'New order assigned to you',
      body: 'Order {ref} has been assigned to you.',
    },
    'courier.pickupAvailable': {
      title: 'New delivery request',
      body: 'Order {ref} needs a pickup from the customer.',
    },
    'courier.returnAvailable': {
      title: 'New return delivery',
      body: 'Order {ref} is ready at the tailor and needs to go back to the customer.',
    },
  },
  ur: {
    'tailor.orderAvailable': {
      title: 'نیا آرڈر دستیاب ہے',
      body: 'آرڈر {ref} آپ کے علاقے میں درزی کا منتظر ہے۔ قبول کرنے کے لیے ایپ کھولیں۔',
    },
    'tailor.orderAssigned': {
      title: 'نیا آرڈر آپ کو دیا گیا',
      body: 'آرڈر {ref} آپ کو دے دیا گیا ہے۔',
    },
    'courier.pickupAvailable': {
      title: 'نئی ڈیلیوری کی درخواست',
      body: 'آرڈر {ref} کو گاہک سے اٹھانا ہے۔',
    },
    'courier.returnAvailable': {
      title: 'نئی واپسی ڈیلیوری',
      body: 'آرڈر {ref} درزی کے پاس تیار ہے اور گاہک تک پہنچانا ہے۔',
    },
  },
  hi: {
    'tailor.orderAvailable': {
      title: 'नया ऑर्डर उपलब्ध है',
      body: 'ऑर्डर {ref} आपके क्षेत्र में दर्ज़ी का इंतज़ार कर रहा है। स्वीकार करने के लिए ऐप खोलें।',
    },
    'tailor.orderAssigned': {
      title: 'आपको नया ऑर्डर सौंपा गया',
      body: 'ऑर्डर {ref} आपको सौंपा गया है।',
    },
    'courier.pickupAvailable': {
      title: 'नई डिलीवरी रिक्वेस्ट',
      body: 'ऑर्डर {ref} को ग्राहक से पिकअप करना है।',
    },
    'courier.returnAvailable': {
      title: 'नई वापसी डिलीवरी',
      body: 'ऑर्डर {ref} दर्ज़ी के पास तैयार है और ग्राहक तक पहुँचाना है।',
    },
  },
  bn: {
    'tailor.orderAvailable': {
      title: 'নতুন অর্ডার এসেছে',
      body: 'অর্ডার {ref} আপনার এলাকায় একজন দর্জির অপেক্ষায় আছে। গ্রহণ করতে অ্যাপ খুলুন।',
    },
    'tailor.orderAssigned': {
      title: 'আপনাকে নতুন অর্ডার দেওয়া হয়েছে',
      body: 'অর্ডার {ref} আপনাকে দেওয়া হয়েছে।',
    },
    'courier.pickupAvailable': {
      title: 'নতুন ডেলিভারি অনুরোধ',
      body: 'অর্ডার {ref} গ্রাহকের কাছ থেকে তুলতে হবে।',
    },
    'courier.returnAvailable': {
      title: 'নতুন ফেরত ডেলিভারি',
      body: 'অর্ডার {ref} দর্জির কাছে প্রস্তুত, গ্রাহকের কাছে পৌঁছে দিতে হবে।',
    },
  },
};

export function toPushLocale(value: string | null | undefined): PushLocale {
  return LOCALES.find((locale) => locale === value) ?? 'ar';
}

export function orderPushText(
  event: OrderPushEvent,
  locale: string | null | undefined,
  reference: string
): { title: string; body: string } {
  const texts = MESSAGES[toPushLocale(locale)][event];
  return { title: texts.title, body: texts.body.replace('{ref}', reference) };
}
