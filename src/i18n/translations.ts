import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  loginTitle: string;
  loginSubtitle: string;
  signInWithGoogle: string;
  demoLogin: string;
  logout: string;
  signedInAs: string;
  gpayEarnings: string;
  cashEarnings: string;
  grandTotal: string;
  totalSalesCount: string;
  avgBill: string;
  gpayVsCashRatio: string;
  newEntry: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  gpayAmount: string;
  cashAmount: string;
  totalBill: string;
  paidAllGpay: string;
  paidAllCash: string;
  splitEqually: string;
  submitSale: string;
  transactionsList: string;
  time: string;
  description: string;
  actions: string;
  delete: string;
  clearDayData: string;
  clearDayConfirm: string;
  downloadPdf: string;
  sendWhatsapp: string;
  searchPlaceholder: string;
  allPayments: string;
  gpayOnly: string;
  cashOnly: string;
  splitOnly: string;
  theme: string;
  language: string;
  light: string;
  dark: string;
  system: string;
  noTransactions: string;
  shopName: string;
  shopOwner: string;
  shopPhone: string;
  whatsappTarget: string;
  shopAddress: string;
  editShop: string;
  save: string;
  cancel: string;
  close: string;
  saleRecorded: string;
  dailyReportTitle: string;
  salesCount: string;
  total: string;
  realtimeGoogleNotice: string;
  whatsappSentNotice: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "KiranaTrack",
    appSubtitle: "Daily Grocery Earnings & Payment Register",
    loginTitle: "Grocery Shop Register",
    loginSubtitle: "Track daily sales, cash & G-Pay split, and send reports to WhatsApp",
    signInWithGoogle: "Sign in with Google",
    demoLogin: "Instant Login (Bypass)",
    logout: "Logout",
    signedInAs: "Signed in as",
    gpayEarnings: "Total G-Pay Earnings",
    cashEarnings: "Total Hand Cash",
    grandTotal: "Grand Total Earnings",
    totalSalesCount: "Total Bills",
    avgBill: "Avg. Sale",
    gpayVsCashRatio: "G-Pay vs Cash Split",
    newEntry: "New Sale Entry",
    descriptionLabel: "Bill / Customer Description",
    descriptionPlaceholder: "e.g., General groceries, Customer bill, Provisions",
    gpayAmount: "G-Pay Amount (₹)",
    cashAmount: "Hand Cash Amount (₹)",
    totalBill: "Total Bill Amount (₹)",
    paidAllGpay: "All G-Pay",
    paidAllCash: "All Cash",
    splitEqually: "50/50 Split",
    submitSale: "Record Sale Entry",
    transactionsList: "Today's Transactions",
    time: "Time",
    description: "Description",
    actions: "Action",
    delete: "Delete",
    clearDayData: "Clear Day's Data",
    clearDayConfirm: "Are you sure you want to clear all transactions recorded today? This action cannot be undone.",
    downloadPdf: "Download Daily PDF",
    sendWhatsapp: "Send Report to WhatsApp (6380412552)",
    searchPlaceholder: "Search by description or amount...",
    allPayments: "All Payments",
    gpayOnly: "G-Pay Only",
    cashOnly: "Cash Only",
    splitOnly: "Split Payments",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    system: "System",
    noTransactions: "No sales recorded yet today. Fill in the form above to record your first sale!",
    shopName: "Shop Name",
    shopOwner: "Shopkeeper / Owner",
    shopPhone: "Contact Phone",
    whatsappTarget: "WhatsApp Number",
    shopAddress: "Shop Address / Location",
    editShop: "Shop Profile",
    save: "Save Changes",
    cancel: "Cancel",
    close: "Close",
    saleRecorded: "Sale recorded successfully!",
    dailyReportTitle: "DAILY SALES & EARNINGS REPORT",
    salesCount: "Bills",
    total: "Total",
    realtimeGoogleNotice: "Sign in with your Google Account in real-time.",
    whatsappSentNotice: "Opening WhatsApp with your daily report...",
  },
  te: {
    appName: "కిరాణా ట్రాక్ (KiranaTrack)",
    appSubtitle: "కిరాణా షాప్ రోజువారీ ఆదాయం & చెల్లింపుల రిజిస్టర్",
    loginTitle: "కిరాణా దుకాణం రిజిస్టర్",
    loginSubtitle: "రోజువారీ అమ్మకాలు, జి-పే & నగదు లెక్కలు మరియు వాట్సాప్ రిపోర్ట్",
    signInWithGoogle: "గూగుల్ తో సైన్ ఇన్ అవ్వండి",
    demoLogin: "తక్షణ లాగిన్",
    logout: "లాగ్ అవుట్",
    signedInAs: "లాగిన్ అయిన యూజర్",
    gpayEarnings: "మొత్తం జి-పే ఆదాయం",
    cashEarnings: "మొత్తం చేతి నగదు",
    grandTotal: "ఈ రోజు మొత్తం ఆదాయం",
    totalSalesCount: "మొత్తం బిల్లులు",
    avgBill: "సగటు బిల్లు",
    gpayVsCashRatio: "జి-పే vs నగదు నిష్పత్తి",
    newEntry: "కొత్త విక్రయం నమోదు",
    descriptionLabel: "బిల్లు / కస్టమర్ వివరణ",
    descriptionPlaceholder: "ఉదా: సాధారణ కిరాణా వస్తువులు, కస్టమర్ బిల్లు",
    gpayAmount: "జి-పే మొత్తం (₹)",
    cashAmount: "చేతి నగదు మొత్తం (₹)",
    totalBill: "మొత్తం బిల్లు (₹)",
    paidAllGpay: "మొత్తం జి-పే",
    paidAllCash: "మొత్తం నగదు",
    splitEqually: "50/50 సమాన విభజన",
    submitSale: "అమ్మకం నమోదు చేయండి",
    transactionsList: "ఈ రోజు లావాదేవీలు",
    time: "సమయం",
    description: "వివరణ",
    actions: "చర్య",
    delete: "తొలగించు",
    clearDayData: "ఈ రోజు డేటాను క్లియర్ చేయండి",
    clearDayConfirm: "ఈ రోజు నమోదైన అన్ని లావాదేవీలను తొలగించాలనుకుంటున్నారా?",
    downloadPdf: "PDF డౌన్‌లోడ్",
    sendWhatsapp: "వాట్సాప్‌కు నివేదిక పంపండి (6380412552)",
    searchPlaceholder: "వివరణ ద్వారా శోధించండి...",
    allPayments: "అన్ని చెల్లింపులు",
    gpayOnly: "కేవలం జి-పే",
    cashOnly: "కేవలం నగదు",
    splitOnly: "విభజించబడిన చెల్లింపు",
    theme: "థీమ్",
    language: "భాష",
    light: "లైట్",
    dark: "డార్క్",
    system: "సిస్టమ్",
    noTransactions: "ఈ రోజు ఇంకా ఎలాంటి అమ్మకాలు నమోదు కాలేదు.",
    shopName: "దుకాణం పేరు",
    shopOwner: "షాప్ యజమాని",
    shopPhone: "సంప్రదింపు ఫోన్",
    whatsappTarget: "వాట్సాప్ నంబర్",
    shopAddress: "షాప్ చిరునామా",
    editShop: "షాప్ వివరాలు",
    save: "భద్రపరుచు",
    cancel: "రద్దు చేయి",
    close: "మూసివేయి",
    saleRecorded: "అమ్మకం విజయవంతంగా నమోదైంది!",
    dailyReportTitle: "రోజువారీ అమ్మకాలు మరియు ఆదాయ నివేదిక",
    salesCount: "బిల్లులు",
    total: "మొత్తం",
    realtimeGoogleNotice: "గూగుల్ ఖాతాతో నిజ సమయంలో సైన్ ఇన్ చేయండి.",
    whatsappSentNotice: "వాట్సాప్‌లో నివేదిక తెరవబడుతోంది...",
  }
};
