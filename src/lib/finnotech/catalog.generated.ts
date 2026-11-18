/* eslint-disable */
/** Auto-generated from Finnotech OpenAPI — do not edit by hand. Re-run scripts/generate-catalog.js */
import type { FinnotechService, ServiceCategory } from "./types";

export const serviceCategories: ServiceCategory[] = [
  {
    "id": "billing",
    "title": "استعلام قبض",
    "icon": "bolt"
  },
  {
    "id": "kyc",
    "title": "احراز هویت و شناخت مشتری",
    "icon": "shieldCheck"
  },
  {
    "id": "vehicle",
    "title": "استعلام خودرو",
    "icon": "car"
  },
  {
    "id": "inquiry",
    "title": "استعلام و تبدیل بانکی",
    "icon": "refresh"
  },
  {
    "id": "credit",
    "title": "تسهیلات و اعتبارسنجی",
    "icon": "chart"
  },
  {
    "id": "device",
    "title": "شناخت دستگاه",
    "icon": "setting"
  },
  {
    "id": "sayad",
    "title": "چک صیادی",
    "icon": "search"
  },
  {
    "id": "kyb",
    "title": "شناخت کسب‌وکار (KYB)",
    "icon": "folder"
  },
  {
    "id": "account",
    "title": "سرویس‌های بر پایه حساب",
    "icon": "wallet"
  },
  {
    "id": "sms",
    "title": "پیامک و رمز یکبار مصرف",
    "icon": "messages"
  },
  {
    "id": "postal",
    "title": "کد پستی",
    "icon": "pin"
  },
  {
    "id": "signature",
    "title": "امضای دیجیتال",
    "icon": "shieldNote"
  },
  {
    "id": "promissory",
    "title": "سفته الکترونیکی",
    "icon": "letter"
  }
];

export const finnotechServices: FinnotechService[] = [
  {
    "id": "billing-inquiry-request-submit",
    "operationId": "billingInquiryRequestSubmit",
    "title": "استعلام قبض ناهمگام (مرحله ۱) — ثبت درخواست",
    "category": "billing",
    "icon": "bolt",
    "grantType": "client_credentials",
    "scope": "billing:billing-inquiry-request:post",
    "method": "POST",
    "path": "/billing/v2/clients/{clientId}/billingInquiryRequest",
    "flow": "generic",
    "fields": [
      {
        "name": "type",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "نوع",
        "enum": [
          "Water",
          "Electricity",
          "Electricity-standard",
          "Gas",
          "GasByBillId",
          "Tel",
          "TelNow",
          "Mobile",
          "MobileNow"
        ],
        "placeholder": "Mobile"
      },
      {
        "name": "parameter",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "پارامتر استعلام",
        "placeholder": "09222223344"
      },
      {
        "name": "secondParameter",
        "in": "body",
        "required": false,
        "kind": "select",
        "label": "پارامتر دوم",
        "enum": [
          "MCI",
          "MTN",
          "RIGHTEL"
        ],
        "placeholder": "MCI"
      }
    ],
    "responseFields": [
      {
        "key": "requestId",
        "label": "شناسه درخواست"
      },
      {
        "key": "status",
        "label": "status"
      }
    ]
  },
  {
    "id": "billing-inquiry-status-poll",
    "operationId": "billingInquiryStatusPoll",
    "title": "استعلام قبض ناهمگام (مرحله ۲) — دریافت نتیجه",
    "category": "billing",
    "icon": "bolt",
    "grantType": "client_credentials",
    "scope": "billing:billing-inquiry-status:post",
    "method": "POST",
    "path": "/billing/v2/clients/{clientId}/billingInquiryStatus",
    "flow": "generic",
    "fields": [
      {
        "name": "requestId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه درخواست",
        "placeholder": "e3e9fa28-ed42-42b1-b15a-c55bb0961b92"
      }
    ],
    "responseFields": []
  },
  {
    "id": "billing-inquiry-cc-get",
    "operationId": "billingInquiryCcGet",
    "title": "استعلام قبض",
    "category": "billing",
    "icon": "bolt",
    "grantType": "client_credentials",
    "scope": "billing:cc-inquiry:get",
    "method": "GET",
    "path": "/billing/v2/clients/{clientId}/billingInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "type",
        "in": "query",
        "required": true,
        "kind": "select",
        "label": "نوع",
        "enum": [
          "Water",
          "Electricity",
          "Electricity-standard",
          "Gas",
          "GasByBillId",
          "Tel",
          "TelNow",
          "Mobile",
          "MobileNow"
        ],
        "placeholder": "Tel"
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "پارامتر استعلام",
        "placeholder": "02177689361"
      },
      {
        "name": "secondParameter",
        "in": "query",
        "required": false,
        "kind": "select",
        "label": "پارامتر دوم",
        "enum": [
          "MCI",
          "MTN",
          "RIGHTEL"
        ],
        "placeholder": "MCI"
      }
    ],
    "responseFields": [
      {
        "key": "Amount",
        "label": "Amount"
      },
      {
        "key": "BillId",
        "label": "BillId"
      },
      {
        "key": "PayId",
        "label": "PayId"
      },
      {
        "key": "Date",
        "label": "Date"
      }
    ]
  },
  {
    "id": "billing-detail-inquiry-cc-get",
    "operationId": "billingDetailInquiryCcGet",
    "title": "استعلام قبوض با جزئیات",
    "category": "billing",
    "icon": "bolt",
    "grantType": "client_credentials",
    "scope": "billing:cc-inquiry-detail:get",
    "method": "GET",
    "path": "/billing/v2/clients/{clientId}/detailBillingInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "type",
        "in": "query",
        "required": true,
        "kind": "select",
        "label": "نوع",
        "enum": [
          "Water",
          "Electricity",
          "Electricity-support",
          "Gas"
        ],
        "placeholder": "Electricity"
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "پارامتر استعلام",
        "placeholder": "02177689361"
      }
    ],
    "responseFields": [
      {
        "key": "Amount",
        "label": "Amount"
      },
      {
        "key": "BillId",
        "label": "BillId"
      },
      {
        "key": "PayId",
        "label": "PayId"
      },
      {
        "key": "Date",
        "label": "Date"
      }
    ]
  },
  {
    "id": "billing-bill-history-inquiry-get",
    "operationId": "billingBillHistoryInquiryGet",
    "title": "استعلام تاریخچه قبض",
    "category": "billing",
    "icon": "bolt",
    "grantType": "client_credentials",
    "scope": "billing:bill-history-inquiry:get",
    "method": "GET",
    "path": "/billing/v2/clients/{clientId}/billHistoryInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "type",
        "in": "query",
        "required": true,
        "kind": "select",
        "label": "نوع",
        "enum": [
          "Electricity",
          "Gas"
        ],
        "placeholder": "Gas"
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "پارامتر استعلام",
        "placeholder": "02177689361"
      }
    ],
    "responseFields": []
  },
  {
    "id": "kyc-identification-inquiry",
    "operationId": "kycIdentificationInquiry",
    "title": "استعلام اطلاعات هویتی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:identification-inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/identificationInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1356/02/23"
      }
    ],
    "responseFields": [
      {
        "key": "firstName",
        "label": "نام"
      },
      {
        "key": "lastName",
        "label": "نام خانوادگی"
      },
      {
        "key": "birthDate",
        "label": "تاریخ تولد"
      },
      {
        "key": "fatherName",
        "label": "نام پدر"
      },
      {
        "key": "deathStatus",
        "label": "deathStatus"
      },
      {
        "key": "nationalId",
        "label": "کد ملی"
      },
      {
        "key": "gender",
        "label": "جنسیت"
      },
      {
        "key": "identityNo",
        "label": "identityNo"
      },
      {
        "key": "identitySeri",
        "label": "identitySeri"
      },
      {
        "key": "identitySerial",
        "label": "identitySerial"
      },
      {
        "key": "officeName",
        "label": "officeName"
      },
      {
        "key": "officeCode",
        "label": "officeCode"
      }
    ]
  },
  {
    "id": "kyc-iban-owner-verification-get",
    "operationId": "kycIbanOwnerVerificationGet",
    "title": "تطبیق شماره شبا و کد ملی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:iban-owner-verification:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/ibanOwnerVerification",
    "flow": "generic",
    "fields": [
      {
        "name": "nid",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "6661111111"
      },
      {
        "name": "iban",
        "in": "query",
        "required": true,
        "kind": "iban",
        "label": "شماره شبا",
        "placeholder": "IR111111111111111111111111"
      }
    ],
    "responseFields": [
      {
        "key": "isValid",
        "label": "isValid"
      }
    ]
  },
  {
    "id": "kyc-card-owner-verification-post",
    "operationId": "kycCardOwnerVerificationPost",
    "title": "تطبیق شماره کارت و کد ملی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:card-owner-verification:post",
    "method": "POST",
    "path": "/kyc/v2/clients/{clientId}/cardOwnerVerification",
    "flow": "generic",
    "fields": [
      {
        "name": "card",
        "in": "body",
        "required": true,
        "kind": "card",
        "label": "شماره کارت"
      },
      {
        "name": "nid",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      }
    ],
    "responseFields": [
      {
        "key": "isValid",
        "label": "isValid"
      }
    ]
  },
  {
    "id": "kyc-identity-bank-account-verification-post",
    "operationId": "kycIdentityBankAccountVerificationPost",
    "title": "استعلام تطبیق اطلاعات هویتی و بانکی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:identity-bank-account-verification:post",
    "method": "POST",
    "path": "/kyc/v2/clients/{clientId}/identityBankAccountVerification",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      },
      {
        "name": "iban",
        "in": "body",
        "required": true,
        "kind": "iban",
        "label": "شماره شبا"
      },
      {
        "name": "cardNumber",
        "in": "body",
        "required": true,
        "kind": "card",
        "label": "شماره کارت"
      },
      {
        "name": "accountNumber",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "accountNumber"
      }
    ],
    "responseFields": [
      {
        "key": "nationalCode",
        "label": "کد ملی"
      },
      {
        "key": "ibanMatch",
        "label": "ibanMatch"
      },
      {
        "key": "cardNumberMatch",
        "label": "cardNumberMatch"
      },
      {
        "key": "accountNumberMatch",
        "label": "accountNumberMatch"
      },
      {
        "key": "isMatched",
        "label": "isMatched"
      }
    ]
  },
  {
    "id": "kyc-iban-owner-birthdate-verification-get",
    "operationId": "kycIbanOwnerBirthdateVerificationGet",
    "title": "تطبیق شماره شبا، کد ملی و تاریخ تولد",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:iban-owner-birthdate-verification:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/ibanOwnerBirthdateVerification",
    "flow": "generic",
    "fields": [
      {
        "name": "nid",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "6661111111"
      },
      {
        "name": "iban",
        "in": "query",
        "required": true,
        "kind": "iban",
        "label": "شماره شبا",
        "placeholder": "IR111111111111111111111111"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1356/02/23"
      }
    ],
    "responseFields": [
      {
        "key": "isValid",
        "label": "isValid"
      }
    ]
  },
  {
    "id": "kyc-third-party-insurance-inquiry",
    "operationId": "kycThirdPartyInsuranceInquiry",
    "title": "استعلام سوابق بیمه‌نامه شخص ثالث",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "kyc:thirdParty-insurance-inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/thirdPartyInsuranceInquiry",
    "flow": "plate",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "plateNumber",
        "in": "query",
        "required": true,
        "kind": "plate",
        "label": "شماره پلاک",
        "placeholder": "911715950"
      }
    ],
    "responseFields": [
      {
        "key": "carGroupCode",
        "label": "carGroupCode"
      },
      {
        "key": "companyCode",
        "label": "companyCode"
      },
      {
        "key": "companyName",
        "label": "companyName"
      },
      {
        "key": "countLossAmount",
        "label": "countLossAmount"
      },
      {
        "key": "cylCnt",
        "label": "cylCnt"
      },
      {
        "key": "disFnYrNum",
        "label": "disFnYrNum"
      },
      {
        "key": "disFnYrPrcnt",
        "label": "disFnYrPrcnt"
      },
      {
        "key": "endDate",
        "label": "endDate"
      },
      {
        "key": "issueDate",
        "label": "issueDate"
      },
      {
        "key": "mapUsageName",
        "label": "mapUsageName"
      },
      {
        "key": "mapVehicleSystemName",
        "label": "mapVehicleSystemName"
      },
      {
        "key": "modelCii",
        "label": "modelCii"
      }
    ]
  },
  {
    "id": "kyc-ocr-verification-post",
    "operationId": "kycOcrVerificationPost",
    "title": "خواندن اطلاعات کارت ملی با OCR",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:ocr-verification:post",
    "method": "POST",
    "path": "/kyc/v2/clients/{clientId}/ocr",
    "flow": "upload",
    "fields": [
      {
        "name": "cardImage",
        "in": "body",
        "required": true,
        "kind": "file",
        "label": "تصویر رو یا پشت کارت ملی (jpg)"
      },
      {
        "name": "type",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "نوع",
        "enum": [
          "uploadCardFront",
          "uploadCardBack"
        ]
      }
    ],
    "responseFields": []
  },
  {
    "id": "kyc-compare-video-with-national-card-image-post",
    "operationId": "kycCompareVideoWithNationalCardImagePost",
    "title": "انطباق ویدئو و عکس کارت ملی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:compare-video-with-national-card-image:post",
    "method": "POST",
    "path": "/kyc/v2/clients/{clientId}/compareVideoWithNationalCardImage",
    "flow": "upload",
    "fields": [
      {
        "name": "video",
        "in": "body",
        "required": true,
        "kind": "file",
        "label": "ویدیوی کاربر به صورت فایل با حجم حداکثر پنج مگابایت"
      },
      {
        "name": "nationalCode",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0024143331"
      },
      {
        "name": "birthDate",
        "in": "body",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1371/06/18"
      },
      {
        "name": "serialNumber",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "serialNumber",
        "placeholder": "1R29366454"
      }
    ],
    "responseFields": [
      {
        "key": "faceVerification",
        "label": "faceVerification"
      },
      {
        "key": "trackingCode",
        "label": "trackingCode"
      }
    ]
  },
  {
    "id": "kyc-compare-live-video-with-national-card-post",
    "operationId": "kycCompareLiveVideoWithNationalCardPost",
    "title": "انطباق ویدئو زنده با عکس کارت ملی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:compare-live-video-with-national-card-image:post",
    "method": "POST",
    "path": "/kyc/v2/clients/{clientId}/compareLiveVideoWithNationalCard",
    "flow": "upload",
    "fields": [
      {
        "name": "video",
        "in": "body",
        "required": true,
        "kind": "file",
        "label": "ویدیوی کاربر به صورت فایل با حجم حداکثر پنج مگابایت"
      },
      {
        "name": "nationalCode",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0024143331"
      },
      {
        "name": "birthDate",
        "in": "body",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1371/06/18"
      },
      {
        "name": "serialNumber",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "serialNumber",
        "placeholder": "1R29366454"
      },
      {
        "name": "speechText",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "متن مورد انتظار برای خوانش در ویدیو (اختیاری)",
        "placeholder": "سلام سلام همگی سلام"
      }
    ],
    "responseFields": [
      {
        "key": "faceVerification",
        "label": "faceVerification"
      },
      {
        "key": "liveness",
        "label": "liveness"
      },
      {
        "key": "speechSimilarity",
        "label": "speechSimilarity"
      },
      {
        "key": "printLiveness",
        "label": "printLiveness"
      },
      {
        "key": "replayLiveness",
        "label": "replayLiveness"
      },
      {
        "key": "trackingCode",
        "label": "trackingCode"
      }
    ]
  },
  {
    "id": "kyc-mobile-card-verification-post",
    "operationId": "kycMobileCardVerificationPost",
    "title": "تطبیق شماره کارت و شماره موبایل",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:mobile-card-verification:post",
    "method": "POST",
    "path": "/kyc/v2/clients/{clientId}/mobileCardVerification",
    "flow": "generic",
    "fields": [
      {
        "name": "mobile",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل"
      },
      {
        "name": "card",
        "in": "body",
        "required": true,
        "kind": "card",
        "label": "شماره کارت"
      }
    ],
    "responseFields": [
      {
        "key": "isValid",
        "label": "isValid"
      }
    ]
  },
  {
    "id": "kyc-military-inquiry-get",
    "operationId": "kycMilitaryInquiryGet",
    "title": "استعلام وضعیت نظام وظیفه",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:military-inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/militaryInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1356/02/23"
      }
    ],
    "responseFields": [
      {
        "key": "conversationId",
        "label": "conversationId"
      },
      {
        "key": "type",
        "label": "نوع"
      },
      {
        "key": "isAllowed",
        "label": "isAllowed"
      },
      {
        "key": "condition",
        "label": "condition"
      },
      {
        "key": "conditionDescription",
        "label": "conditionDescription"
      }
    ]
  },
  {
    "id": "kyc-cc-sana-inquiry-get",
    "operationId": "kycCcSanaInquiryGet",
    "title": "استعلام ثنا",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:cc-sana-inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/cc/sanaInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "idCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "کد شناسایی — حقیقی کد ملی، حقوقی شناسه ملی",
        "placeholder": "1125478963"
      },
      {
        "name": "idType",
        "in": "query",
        "required": true,
        "kind": "select",
        "label": "نوع کد شناسایی — حقیقی ۱، حقوقی ۲",
        "enum": [
          "1",
          "2"
        ],
        "placeholder": "1"
      }
    ],
    "responseFields": [
      {
        "key": "registered",
        "label": "registered"
      },
      {
        "key": "message",
        "label": "متن پیامک"
      }
    ]
  },
  {
    "id": "kyc-cc-tax-inquiry-get",
    "operationId": "kycCcTaxInquiryGet",
    "title": "استعلام بدهی مالیاتی",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "client_credentials",
    "scope": "kyc:tax-Inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/cc/taxInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "nid",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "6661111111"
      }
    ],
    "responseFields": [
      {
        "key": "nationalId",
        "label": "کد ملی"
      }
    ]
  },
  {
    "id": "kyc-sms-tax-inquiry-get",
    "operationId": "kycSmsTaxInquiryGet",
    "title": "استعلام پیامکی بدهی مالیاتی",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "authorization_sms",
    "scope": "kyc:sms-tax-Inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/sms/taxInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "nid",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "6661111111"
      }
    ],
    "responseFields": [
      {
        "key": "nationalId",
        "label": "کد ملی"
      }
    ]
  },
  {
    "id": "kyc-license-check-inquiry-post",
    "operationId": "kycLicenseCheckInquiryPost",
    "title": "استعلام گواهینامه و وضعیت",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "kyc:cc-license-check-inquiry:post",
    "method": "POST",
    "path": "/kyc/v2/clients/{clientId}/licenseCheckInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalID",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      },
      {
        "name": "mobile",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل"
      }
    ],
    "responseFields": []
  },
  {
    "id": "kyc-death-status-inquiry-get",
    "operationId": "kycDeathStatusInquiryGet",
    "title": "استعلام وضعیت حیات",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:death-status-inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/deathStatusInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1356/02/23"
      }
    ],
    "responseFields": [
      {
        "key": "deathStatus",
        "label": "deathStatus"
      },
      {
        "key": "trackingCode",
        "label": "trackingCode"
      }
    ]
  },
  {
    "id": "kyc-foreigner-id-inquiry-get",
    "operationId": "kycForeignerIdInquiryGet",
    "title": "استعلام اتباع خارجی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "kyc:foreigner-id-inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/foreignerIdInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "foreignerId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شناسه تبعه"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1356/02/23"
      }
    ],
    "responseFields": [
      {
        "key": "firstName",
        "label": "نام"
      },
      {
        "key": "lastName",
        "label": "نام خانوادگی"
      },
      {
        "key": "fullName",
        "label": "نام کامل"
      },
      {
        "key": "fatherName",
        "label": "نام پدر"
      },
      {
        "key": "ancestorName",
        "label": "ancestorName"
      },
      {
        "key": "gender",
        "label": "جنسیت"
      },
      {
        "key": "nationality",
        "label": "nationality"
      },
      {
        "key": "identificationDocumentTypeTitle",
        "label": "identificationDocumentTypeTitle"
      },
      {
        "key": "identificationDocumentNumber",
        "label": "identificationDocumentNumber"
      }
    ]
  },
  {
    "id": "kyc-drivers-risk-inquiry-get",
    "operationId": "kycDriversRiskInquiryGet",
    "title": "استعلام ریسک رانندگان",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "kyc:drivers-risk-inquiry:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/driversRiskInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1356/02/23"
      },
      {
        "name": "personType",
        "in": "query",
        "required": false,
        "kind": "select",
        "label": "نوع شخص — حقیقی ۱ (پیش‌فرض)، حقوقی ۲",
        "enum": [
          "1",
          "2"
        ],
        "placeholder": "1"
      },
      {
        "name": "agentCode",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "کد نمایندگی",
        "placeholder": "1"
      }
    ],
    "responseFields": [
      {
        "key": "score",
        "label": "score"
      }
    ]
  },
  {
    "id": "kyc-transaction-credit-inquiry-request-get",
    "operationId": "kycTransactionCreditInquiryRequestGet",
    "title": "استعلام اعتبار معاملاتی (مرحله ۱) — درخواست",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "kyc:transaction-credit-inquiry-request:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/transactionCreditInquiryRequest",
    "flow": "custom",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09123456789"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "inquiryTrackId",
        "label": "inquiryTrackId"
      }
    ]
  },
  {
    "id": "kyc-transaction-credit-inquiry-verify-post",
    "operationId": "kycTransactionCreditInquiryVerifyPost",
    "title": "استعلام اعتبار معاملاتی (مرحله ۲) — صحت‌سنجی OTP",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "kyc:transaction-credit-inquiry-verify:post",
    "method": "POST",
    "path": "/kyc/v2/clients/{clientId}/transactionCreditInquiryVerify",
    "flow": "custom",
    "fields": [
      {
        "name": "nationalCode",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "11111111111"
      },
      {
        "name": "otp",
        "in": "body",
        "required": true,
        "kind": "otp",
        "label": "کد تایید",
        "placeholder": "12345"
      },
      {
        "name": "inquiryTrackId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد پیگیری مرحله اول",
        "placeholder": "00000"
      }
    ],
    "responseFields": [
      {
        "key": "inquiryTrackId",
        "label": "inquiryTrackId"
      }
    ]
  },
  {
    "id": "kyc-transaction-credit-inquiry-report-get",
    "operationId": "kycTransactionCreditInquiryReportGet",
    "title": "استعلام اعتبار معاملاتی (مرحله ۳) — دریافت گزارش",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "kyc:transaction-credit-inquiry-report:get",
    "method": "GET",
    "path": "/kyc/v2/clients/{clientId}/transactionCreditInquiryReport",
    "flow": "custom",
    "fields": [
      {
        "name": "inquiryTrackId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شناسه پیگیری دریافتی از مرحله درخواست یا صحت‌سنجی",
        "placeholder": "INQUIRY_TRACKID"
      },
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "hasHistory",
        "label": "hasHistory"
      },
      {
        "key": "title",
        "label": "title"
      }
    ]
  },
  {
    "id": "kyd-device-ownership-history-get",
    "operationId": "kydDeviceOwnershipHistoryGet",
    "title": "تاریخچه مالکیت دستگاه",
    "category": "device",
    "icon": "setting",
    "grantType": "client_credentials",
    "scope": "kyd:device-ownership-history:get",
    "method": "GET",
    "path": "/kyd/v2/clients/{clientId}/deviceOwnershipHistory",
    "flow": "generic",
    "fields": [
      {
        "name": "imei",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شماره IMEI دستگاه",
        "placeholder": "356938035643809"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-ac-sayad-issue-cheque-post-cheque-post",
    "operationId": "credit_v2_clients_clientId_ac_sayadIssueCheque_post_cheque_post",
    "title": "ثبت چک صیادی",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:ac-sayad-issue-cheque:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/ac/sayadIssueCheque",
    "flow": "otp",
    "fields": [
      {
        "name": "accountOwners",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست صاحبان حساب"
      },
      {
        "name": "receivers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست دریافت کنندگان چک"
      },
      {
        "name": "signers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست امضاکنندگان چک"
      },
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "9727000174850598"
      },
      {
        "name": "seriesNo",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شماره سری",
        "placeholder": "1017"
      },
      {
        "name": "serialNo",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "سریال",
        "placeholder": "029973"
      },
      {
        "name": "fromIban",
        "in": "body",
        "required": true,
        "kind": "iban",
        "label": "شماره شبا دارنده چک",
        "placeholder": "IR810620000000101000007007"
      },
      {
        "name": "amount",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "مبلغ",
        "placeholder": "100000"
      },
      {
        "name": "description",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شرح ثبت چک",
        "placeholder": "تست"
      },
      {
        "name": "dueDate",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "تاریخ سررسید چک",
        "placeholder": "14001027"
      },
      {
        "name": "toIban",
        "in": "body",
        "required": false,
        "kind": "iban",
        "label": "شماره شبا مقصد (اختیاری)",
        "placeholder": "IR760620000000400037910008"
      },
      {
        "name": "bankCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد بانک مبدا",
        "placeholder": "62"
      },
      {
        "name": "branchCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد شعبه مبدا",
        "placeholder": "6202976"
      },
      {
        "name": "chequeType",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نوع چک. ۱ عادی، ۲ بانکی، ۳ رمزدار",
        "placeholder": "1"
      },
      {
        "name": "chequeMedia",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "نوع حامل چک (اختیاری، پیش‌فرض ۱). ۱ کاغذی، ۲ دیجیتال",
        "placeholder": "1"
      },
      {
        "name": "reason",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "بابت : [اطلاعات بیشتر](/oak-reason-description.html)",
        "placeholder": "1"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "referenceId",
        "label": "referenceId"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-sms-sayad-issue-cheque-post-cheque-post",
    "operationId": "credit_v2_clients_clientId_sms_sayadIssueCheque_post_cheque_post",
    "title": "ثبت چک صیادی (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-sayad-issue-cheque:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/sms/sayadIssueCheque",
    "flow": "otp",
    "fields": [
      {
        "name": "accountOwners",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست صاحبان حساب"
      },
      {
        "name": "receivers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست دریافت کنندگان چک"
      },
      {
        "name": "signers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست امضاکنندگان چک"
      },
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "9727000174850598"
      },
      {
        "name": "seriesNo",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شماره سری",
        "placeholder": "1017"
      },
      {
        "name": "serialNo",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "سریال",
        "placeholder": "029973"
      },
      {
        "name": "fromIban",
        "in": "body",
        "required": true,
        "kind": "iban",
        "label": "شماره شبا دارنده چک",
        "placeholder": "IR810620000000101000007007"
      },
      {
        "name": "amount",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "مبلغ",
        "placeholder": "100000"
      },
      {
        "name": "description",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شرح ثبت چک",
        "placeholder": "تست"
      },
      {
        "name": "dueDate",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "تاریخ سررسید چک",
        "placeholder": "14001027"
      },
      {
        "name": "toIban",
        "in": "body",
        "required": false,
        "kind": "iban",
        "label": "شماره شبا مقصد (اختیاری)",
        "placeholder": "IR760620000000400037910008"
      },
      {
        "name": "bankCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد بانک مبدا",
        "placeholder": "62"
      },
      {
        "name": "branchCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد شعبه مبدا",
        "placeholder": "6202976"
      },
      {
        "name": "chequeType",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نوع چک. ۱ عادی، ۲ بانکی، ۳ رمزدار",
        "placeholder": "1"
      },
      {
        "name": "chequeMedia",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "نوع حامل چک (اختیاری، پیش‌فرض ۱). ۱ کاغذی، ۲ دیجیتال",
        "placeholder": "1"
      },
      {
        "name": "reason",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "بابت : [اطلاعات بیشتر](/oak-reason-description.html)",
        "placeholder": "1"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "referenceId",
        "label": "referenceId"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-ac-sayad-transfer-cheque-post-cheque-post",
    "operationId": "credit_v2_clients_clientId_ac_sayadTransferCheque_post_cheque_post",
    "title": "انتقال چک صیادی",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:ac-sayad-transfer-cheque:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/ac/sayadTransferCheque",
    "flow": "otp",
    "fields": [
      {
        "name": "holder",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "مشخصات صاحب چک (دارنده فعلی)"
      },
      {
        "name": "receivers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست دریافت کنندگان چک"
      },
      {
        "name": "signers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست امضاکنندگان چک"
      },
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "3720000100764013"
      },
      {
        "name": "acceptTransfer",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "acceptTransfer",
        "placeholder": "1"
      },
      {
        "name": "toIban",
        "in": "body",
        "required": false,
        "kind": "iban",
        "label": "شماره شبا مقصد",
        "placeholder": "IR760620000000203236980008"
      },
      {
        "name": "transferDate",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "تاریخ انتقال چک",
        "placeholder": "14001203300500"
      },
      {
        "name": "description",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شرح انتقال چک",
        "placeholder": "تست"
      },
      {
        "name": "reason",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "بابت : [اطلاعات بیشتر](/oak-reason-description.html)",
        "placeholder": "POSA"
      },
      {
        "name": "giveBack",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "giveBack",
        "placeholder": "0"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "referenceId",
        "label": "referenceId"
      },
      {
        "key": "resultCode",
        "label": "resultCode"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-cheque-color-inquiry-legal-get-credit-cheque-color-inquiry",
    "operationId": "credit_v2_clients_clientId_chequeColorInquiryLegal_get_credit_chequeColorInquiry",
    "title": "استعلام وضعیت رنگ چک حقوقی",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:cheque-color-inquiry-legal:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/chequeColorInquiryLegal",
    "flow": "generic",
    "fields": [
      {
        "name": "idCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "National ID or Sayad ID (شناسه ملی یا صیاد)"
      }
    ],
    "responseFields": [
      {
        "key": "chequeColor",
        "label": "chequeColor"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-cheque-color-inquiry-get-cheque-color-inquiry-get",
    "operationId": "credit_v2_clients_clientId_chequeColorInquiry_get_chequeColorInquiry_get",
    "title": "استعلام وضعیت رنگ چک",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:cheque-color-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/chequeColorInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "idCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "National ID or Sayad ID (شناسه ملی یا صیاد)"
      }
    ],
    "responseFields": [
      {
        "key": "chequeColor",
        "label": "chequeColor"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-cleared-cheque-get-cleared-cheque-get",
    "operationId": "credit_v2_clients_clientId_clearedCheque_get_clearedCheque_get",
    "title": "استعلام چک رفع سو اثر شده",
    "category": "sayad",
    "icon": "search",
    "grantType": "client_credentials",
    "scope": "credit:cleared-cheque:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/clearedCheque",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      },
      {
        "name": "personType",
        "in": "query",
        "required": true,
        "kind": "select",
        "label": "نوع شخص؛ ۱ حقیقی و ۲ حقوقی",
        "enum": [
          "1",
          "2"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "firstName",
        "label": "نام"
      },
      {
        "key": "lastName",
        "label": "نام خانوادگی"
      },
      {
        "key": "nid",
        "label": "کد ملی"
      },
      {
        "key": "personType",
        "label": "personType"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-sms-cleared-cheque-get-sms-cleared-cheque-get",
    "operationId": "credit_v2_clients_clientId_smsClearedCheque_get_smsClearedCheque_get",
    "title": "استعلام چک رفع سو اثر شده (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-cleared-cheque:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/smsClearedCheque",
    "flow": "otp",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      },
      {
        "name": "personType",
        "in": "query",
        "required": true,
        "kind": "select",
        "label": "نوع شخص؛ ۱ حقیقی و ۲ حقوقی",
        "enum": [
          "1",
          "2"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "firstName",
        "label": "نام"
      },
      {
        "key": "lastName",
        "label": "نام خانوادگی"
      },
      {
        "key": "nid",
        "label": "کد ملی"
      },
      {
        "key": "personType",
        "label": "personType"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-cheque-status-inquiry-post-inquiry-post",
    "operationId": "credit_v2_clients_clientId_chequeStatusInquiry_post_inquiry_post",
    "title": "استعلام چک در راه",
    "category": "sayad",
    "icon": "search",
    "grantType": "client_credentials",
    "scope": "credit:cheque-status-inquiry:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/chequeStatusInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "9999999999999999"
      },
      {
        "name": "idCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد شناسایی، مشتری حقیقی کد ملی٬ مشتری حقوقی شناسه ملی شرکت",
        "placeholder": "1234567890"
      }
    ],
    "responseFields": [
      {
        "key": "onGoing",
        "label": "onGoing"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-chequebook-inquiry-get-chequebook-inquiry-get",
    "operationId": "credit_v2_clients_clientId_chequebookInquiry_get_chequebookInquiry_get",
    "title": "استعلام دسته چک صیادی",
    "category": "sayad",
    "icon": "search",
    "grantType": "client_credentials",
    "scope": "credit:chequebook-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/chequebookInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "deposit",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شماره حساب"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-guarantee-collaterals-get-guarantee-collaterals",
    "operationId": "credit_v2_clients_clientId_guaranteeCollaterals_get_guarantee_collaterals",
    "title": "وثایق و تضامین ضمانت نامه",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:guarantee-collaterals:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/guaranteeCollaterals",
    "flow": "generic",
    "fields": [
      {
        "name": "guaranteeId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "Guarantee identifier (شناسه ضمانت)"
      }
    ],
    "responseFields": [
      {
        "key": "trackId",
        "label": "کد پیگیری"
      },
      {
        "key": "guaranteeId",
        "label": "guaranteeId"
      },
      {
        "key": "alertCode",
        "label": "alertCode"
      },
      {
        "key": "status",
        "label": "status"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-guarantee-details-get-credit-guarantee-details",
    "operationId": "credit_v2_clients_clientId_guaranteeDetails_get_credit_guaranteeDetails",
    "title": "اطلاعات ضمانت نامه",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:guarantee-details:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/guaranteeDetails",
    "flow": "generic",
    "fields": [
      {
        "name": "guaranteeId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "Guarantee identifier (شناسه ضمانت)"
      }
    ],
    "responseFields": [
      {
        "key": "guaranteeId",
        "label": "guaranteeId"
      },
      {
        "key": "sepamId",
        "label": "sepamId"
      },
      {
        "key": "branchCode",
        "label": "branchCode"
      },
      {
        "key": "centralBankTypeCode",
        "label": "centralBankTypeCode"
      },
      {
        "key": "guaranteeSubTypeCode",
        "label": "guaranteeSubTypeCode"
      },
      {
        "key": "guaranteeSubTypeDesc",
        "label": "guaranteeSubTypeDesc"
      },
      {
        "key": "cif",
        "label": "cif"
      },
      {
        "key": "debtAmount",
        "label": "debtAmount"
      },
      {
        "key": "issueDate",
        "label": "issueDate"
      },
      {
        "key": "maturityDate",
        "label": "maturityDate"
      },
      {
        "key": "renewDate",
        "label": "renewDate"
      },
      {
        "key": "companyPreDebtAmount",
        "label": "companyPreDebtAmount"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-macna-inquiry-get-inquiry-get",
    "operationId": "credit_v2_clients_clientId_macnaInquiry_get_inquiry_get",
    "title": "استعلام مکنا",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:macna-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/macnaInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-sayad-serial-inquiry-get-inquiry-get",
    "operationId": "credit_v2_clients_clientId_sayadSerialInquiry_get_inquiry_get",
    "title": "استعلام شناسه چک صیادی",
    "category": "sayad",
    "icon": "search",
    "grantType": "client_credentials",
    "scope": "credit:sayad-serial-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/sayadSerialInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "sayadId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد"
      }
    ],
    "responseFields": [
      {
        "key": "iban",
        "label": "شماره شبا"
      },
      {
        "key": "issuedDate",
        "label": "issuedDate"
      },
      {
        "key": "expirationDate",
        "label": "expirationDate"
      },
      {
        "key": "serialNo",
        "label": "سریال"
      },
      {
        "key": "seriesNo",
        "label": "seriesNo"
      },
      {
        "key": "mediaType",
        "label": "mediaType"
      },
      {
        "key": "branchCode",
        "label": "branchCode"
      },
      {
        "key": "name",
        "label": "name"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-sayad-transfers-chain-inquiry-post-inquiry-post",
    "operationId": "credit_v2_clients_clientId_sayadTransfersChainInquiry_post_inquiry_post",
    "title": "استعلام زنجیره انتقالات چک صیاد",
    "category": "sayad",
    "icon": "search",
    "grantType": "client_credentials",
    "scope": "credit:sayad-transfers-chain-inquiry:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/sayadTransfersChainInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "1111111111111111"
      },
      {
        "name": "chequeType",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نوع چک",
        "placeholder": "1"
      },
      {
        "name": "idCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد شناسایی، مشتری حقیقی کد ملی٬ مشتری حقوقی شناسه ملی شرکت",
        "placeholder": "1111111111"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-sms-cheque-color-inquiry-get-inquiry-get",
    "operationId": "credit_v2_clients_clientId_sms_chequeColorInquiry_get_inquiry_get",
    "title": "وضعیت رنگ چک پیامکی",
    "category": "credit",
    "icon": "chart",
    "grantType": "authorization_sms",
    "scope": "credit:sms-cheque-color-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/sms/chequeColorInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "idCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "National ID or Sayad ID (شناسه ملی یا صیاد)"
      }
    ],
    "responseFields": [
      {
        "key": "chequeColor",
        "label": "chequeColor"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-sms-cheque-status-inquiry-post-inquiry-post",
    "operationId": "credit_v2_clients_clientId_sms_chequeStatusInquiry_post_inquiry_post",
    "title": "استعلام چک در راه (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-cheque-status-inquiry:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/sms/chequeStatusInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "9999999999999999"
      },
      {
        "name": "idCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد شناسایی، مشتری حقیقی کد ملی٬ مشتری حقوقی شناسه ملی شرکت",
        "placeholder": "1234567890"
      }
    ],
    "responseFields": [
      {
        "key": "onGoing",
        "label": "onGoing"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-sms-sayad-transfer-cheque-post-legal-post",
    "operationId": "credit_v2_clients_clientId_sms_sayadTransferCheque_post_legal_post",
    "title": "انتقال چک صیاد (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-sayad-transfer-cheque:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/sms/sayadTransferCheque",
    "flow": "otp",
    "fields": [
      {
        "name": "holder",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "مشخصات صاحب چک (دارنده فعلی)"
      },
      {
        "name": "receivers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست دریافت کنندگان چک"
      },
      {
        "name": "signers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست امضاکنندگان چک"
      },
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "3720770110760412"
      },
      {
        "name": "acceptTransfer",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "acceptTransfer",
        "placeholder": "1"
      },
      {
        "name": "toIban",
        "in": "body",
        "required": false,
        "kind": "iban",
        "label": "شماره شبا مقصد",
        "placeholder": "IR760620220011277246981108"
      },
      {
        "name": "transferDate",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "تاریخ انتقال چک",
        "placeholder": "14001203300600"
      },
      {
        "name": "description",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شرح انتقال چک",
        "placeholder": "تست"
      },
      {
        "name": "reason",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "بابت : [اطلاعات بیشتر](/oak-reason-description.html)",
        "placeholder": "POSA"
      },
      {
        "name": "giveBack",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "giveBack",
        "placeholder": "0"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "referenceId",
        "label": "referenceId"
      },
      {
        "key": "resultCode",
        "label": "resultCode"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-sms-sayad-transfers-chain-inquiry-post-inquiry-post",
    "operationId": "credit_v2_clients_clientId_sms_sayadTransfersChainInquiry_post_inquiry_post",
    "title": "استعلام زنجیره انتقالات چک صیاد (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-sayad-transfers-chain-inquiry:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/sms/sayadTransfersChainInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "1111111111111111"
      },
      {
        "name": "chequeType",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نوع چک",
        "placeholder": "1"
      },
      {
        "name": "idCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد شناسایی، مشتری حقیقی کد ملی٬ مشتری حقوقی شناسه ملی شرکت",
        "placeholder": "1111111111"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-users-nid-sms-guaranty-inquiry-get-inquiry-get",
    "operationId": "credit_v2_clients_clientId_users_nid_sms_guarantyInquiry_get_inquiry_get",
    "title": "استعلام ضمانت های فرد با پیامک",
    "category": "credit",
    "icon": "chart",
    "grantType": "authorization_sms",
    "scope": "credit:sms-guaranty-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/users/{nid}/sms/guarantyInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "nid",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      }
    ],
    "responseFields": [
      {
        "key": "guarantyFirstName",
        "label": "guarantyFirstName"
      },
      {
        "key": "guarantyLastName",
        "label": "guarantyLastName"
      },
      {
        "key": "guarantyNationalCode",
        "label": "guarantyNationalCode"
      },
      {
        "key": "inquiryResultId",
        "label": "inquiryResultId"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-back-cheques-legal-get-legal-get",
    "operationId": "credit_v2_clients_clientId_users_user_backChequesLegal_get_legal_get",
    "title": "استعلام چک برگشتی حقوقی",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:back-cheques-legal:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/users/{user}/backChequesLegal",
    "flow": "generic",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      }
    ],
    "responseFields": [
      {
        "key": "legalId",
        "label": "شناسه حقوقی"
      },
      {
        "key": "name",
        "label": "name"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-back-cheques-get-cheques-get",
    "operationId": "credit_v2_clients_clientId_users_user_backCheques_get_cheques_get",
    "title": "استعلام چک برگشتی",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:back-cheques:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/users/{user}/backCheques",
    "flow": "generic",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      }
    ],
    "responseFields": [
      {
        "key": "nid",
        "label": "کد ملی"
      },
      {
        "key": "name",
        "label": "name"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-facility-inquiry-legal-get-legal-get",
    "operationId": "credit_v2_clients_clientId_users_user_facilityInquiryLegal_get_legal_get",
    "title": "استعلام تسهیلات جاری حقوقی",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:facility-inquiry-legal:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/users/{user}/facilityInquiryLegal",
    "flow": "generic",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      }
    ],
    "responseFields": [
      {
        "key": "legalId",
        "label": "شناسه حقوقی"
      },
      {
        "key": "name",
        "label": "name"
      },
      {
        "key": "facilityTotalAmount",
        "label": "facilityTotalAmount"
      },
      {
        "key": "facilityDebtTotalAmount",
        "label": "facilityDebtTotalAmount"
      },
      {
        "key": "facilityPastExpiredTotalAmount",
        "label": "facilityPastExpiredTotalAmount"
      },
      {
        "key": "facilityDeferredTotalAmount",
        "label": "facilityDeferredTotalAmount"
      },
      {
        "key": "facilitySuspiciousTotalAmount",
        "label": "facilitySuspiciousTotalAmount"
      },
      {
        "key": "dishonored",
        "label": "dishonored"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-facility-inquiry-get-inquiry-get",
    "operationId": "credit_v2_clients_clientId_users_user_facilityInquiry_get_inquiry_get",
    "title": "استعلام تسهیلات",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:facility-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/users/{user}/facilityInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      }
    ],
    "responseFields": [
      {
        "key": "user",
        "label": "کد ملی / شناسه"
      },
      {
        "key": "name",
        "label": "name"
      },
      {
        "key": "facilityTotalAmount",
        "label": "facilityTotalAmount"
      },
      {
        "key": "facilityDebtTotalAmount",
        "label": "facilityDebtTotalAmount"
      },
      {
        "key": "facilityPastExpiredTotalAmount",
        "label": "facilityPastExpiredTotalAmount"
      },
      {
        "key": "facilityDeferredTotalAmount",
        "label": "facilityDeferredTotalAmount"
      },
      {
        "key": "facilitySuspiciousTotalAmount",
        "label": "facilitySuspiciousTotalAmount"
      },
      {
        "key": "dishonored",
        "label": "dishonored"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-sms-back-cheques-get-cheques-get",
    "operationId": "credit_v2_clients_clientId_users_user_sms_backCheques_get_cheques_get",
    "title": "استعلام پیامکی چک برگشتی",
    "category": "credit",
    "icon": "chart",
    "grantType": "authorization_sms",
    "scope": "credit:sms-back-cheques:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/users/{user}/sms/backCheques",
    "flow": "otp",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      }
    ],
    "responseFields": [
      {
        "key": "nid",
        "label": "کد ملی"
      },
      {
        "key": "name",
        "label": "name"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-sms-facility-inquiry-get-inquiry-get",
    "operationId": "credit_v2_clients_clientId_users_user_sms_facilityInquiry_get_inquiry_get",
    "title": "استعلام پیامکی تسهیلات",
    "category": "credit",
    "icon": "chart",
    "grantType": "authorization_sms",
    "scope": "credit:sms-facility-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/users/{user}/sms/facilityInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      }
    ],
    "responseFields": [
      {
        "key": "user",
        "label": "کد ملی / شناسه"
      },
      {
        "key": "name",
        "label": "name"
      },
      {
        "key": "facilityTotalAmount",
        "label": "facilityTotalAmount"
      },
      {
        "key": "facilityDebtTotalAmount",
        "label": "facilityDebtTotalAmount"
      },
      {
        "key": "facilityPastExpiredTotalAmount",
        "label": "facilityPastExpiredTotalAmount"
      },
      {
        "key": "facilityDeferredTotalAmount",
        "label": "facilityDeferredTotalAmount"
      },
      {
        "key": "facilitySuspiciousTotalAmount",
        "label": "facilitySuspiciousTotalAmount"
      },
      {
        "key": "dishonored",
        "label": "dishonored"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-sms-sayad-accept-cheque-post-sms-post",
    "operationId": "credit_v2_clients_clientId_users_user_sms_sayadAcceptCheque_post_sms_post",
    "title": "تایید و رد چک صیاد توسط گیرنده (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-sayad-accept-cheque:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/users/{user}/sms/sayadAcceptCheque",
    "flow": "otp",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      },
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "6230008888888575"
      },
      {
        "name": "accept",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "وضعیت تایید چک که 0 به معنای رد و 1 به معنای تایید",
        "placeholder": "1"
      },
      {
        "name": "acceptDescription",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شرح تایید که این فیلد فقط میتواند شامل حروف فارسی باشد ,",
        "placeholder": "تایید"
      },
      {
        "name": "acceptor",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "acceptor"
      },
      {
        "name": "acceptorAgent",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "acceptorAgent"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "referenceId",
        "label": "referenceId"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-sms-sayad-cancel-cheque-post-sms-post",
    "operationId": "credit_v2_clients_clientId_users_user_sms_sayadCancelCheque_post_sms_post",
    "title": "لغو چک صیاد توسط صادر کننده (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-sayad-cancel-cheque:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/users/{user}/sms/sayadCancelCheque",
    "flow": "otp",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      },
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "6230008888888575"
      },
      {
        "name": "cancelDescription",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شرح لغو که این فیلد فقط میتواند شامل حروف فارسی باشد ,",
        "placeholder": "رد"
      },
      {
        "name": "canceller",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "canceller"
      },
      {
        "name": "cancellerAgent",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "cancellerAgent"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "referenceId",
        "label": "referenceId"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-sms-sayad-cheque-inquiry-get-sms-get",
    "operationId": "credit_v2_clients_clientId_users_user_sms_sayadChequeInquiry_get_sms_get",
    "title": "استعلام چک صیاد (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-sayady-cheque-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/users/{user}/sms/sayadChequeInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      },
      {
        "name": "sayadId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد"
      },
      {
        "name": "idCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "National ID or Sayad ID (شناسه ملی یا صیاد)"
      },
      {
        "name": "shahabId",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "Shahab ID (شناسه شهاب)"
      },
      {
        "name": "idType",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "ID type (نوع شناسه)"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "referenceId",
        "label": "referenceId"
      },
      {
        "key": "sayadId",
        "label": "شناسه صیاد"
      },
      {
        "key": "branchCode",
        "label": "branchCode"
      },
      {
        "key": "bankCode",
        "label": "bankCode"
      },
      {
        "key": "amount",
        "label": "مبلغ"
      },
      {
        "key": "dueDate",
        "label": "dueDate"
      },
      {
        "key": "description",
        "label": "description"
      },
      {
        "key": "serialNo",
        "label": "سریال"
      },
      {
        "key": "seriesNo",
        "label": "seriesNo"
      },
      {
        "key": "fromIban",
        "label": "fromIban"
      },
      {
        "key": "reason",
        "label": "reason"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-users-user-sms-sayad-issuer-inquiry-cheque-post-inquiry-",
    "operationId": "credit_v2_clients_clientId_users_user_sms_sayadIssuerInquiryCheque_post_inquiry_",
    "title": "استعلام چک صیاد توسط صادرکننده (پیامکی)",
    "category": "sayad",
    "icon": "search",
    "grantType": "authorization_sms",
    "scope": "credit:sms-sayad-issuer-inquiry-cheque:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/users/{user}/sms/sayadIssuerInquiryCheque",
    "flow": "otp",
    "fields": [
      {
        "name": "user",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی / شناسه"
      },
      {
        "name": "sayadId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه صیاد",
        "placeholder": "5000000000000000"
      },
      {
        "name": "callerBranchCode",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "callerBranchCode",
        "placeholder": "8000"
      },
      {
        "name": "customerAuthStatus",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "customerAuthStatus",
        "placeholder": "1"
      },
      {
        "name": "idCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد شناسایی",
        "placeholder": "0000000000"
      },
      {
        "name": "shahabId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد شهاب",
        "placeholder": "0000000000000000"
      },
      {
        "name": "idType",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نوع کد شناسایی با ملاحظات زیر",
        "placeholder": "1"
      }
    ],
    "responseFields": [
      {
        "key": "referenceId",
        "label": "referenceId"
      }
    ]
  },
  {
    "id": "credit-v2-clients-client-id-assessment-submit-json-post-submit-post",
    "operationId": "credit_v2_clients_clientId_assessmentSubmit_json_post_submit_post",
    "title": "گزارش اعتباری (مرحله ۱) — ثبت درخواست JSON",
    "category": "credit",
    "icon": "chart",
    "grantType": "authorization_sms",
    "scope": "credit:assessment-submit-json:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/assessmentSubmit/json",
    "flow": "otp",
    "fields": [
      {
        "name": "nationalCode",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0012345678"
      },
      {
        "name": "mobileNumber",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09121234567"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-assessment-submit-pdf-post-submit-post",
    "operationId": "credit_v2_clients_clientId_assessmentSubmit_pdf_post_submit_post",
    "title": "گزارش اعتباری (مرحله ۱) — ثبت درخواست PDF",
    "category": "credit",
    "icon": "chart",
    "grantType": "authorization_sms",
    "scope": "credit:assessment-submit-pdf:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/assessmentSubmit/pdf",
    "flow": "otp",
    "fields": [
      {
        "name": "nationalCode",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0012345678"
      },
      {
        "name": "mobileNumber",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09121234567"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-cc-assessment-submit-json-post-submit-post",
    "operationId": "credit_v2_clients_clientId_ccAssessmentSubmit_json_post_submit_post",
    "title": "گزارش اعتباری (مرحله ۱) — ثبت درخواست JSON با Client Credential",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:cc-assessment-submit-json:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/ccAssessmentSubmit/json",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0012345678"
      },
      {
        "name": "mobileNumber",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09121234567"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-cc-assessment-submit-pdf-post-submit-post",
    "operationId": "credit_v2_clients_clientId_ccAssessmentSubmit_pdf_post_submit_post",
    "title": "گزارش اعتباری (مرحله ۱) — ثبت درخواست PDF با Client Credential",
    "category": "credit",
    "icon": "chart",
    "grantType": "client_credentials",
    "scope": "credit:cc-assessment-submit-pdf:post",
    "method": "POST",
    "path": "/credit/v2/clients/{clientId}/ccAssessmentSubmit/pdf",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0012345678"
      },
      {
        "name": "mobileNumber",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09121234567"
      }
    ],
    "responseFields": []
  },
  {
    "id": "credit-v2-clients-client-id-assessment-inquiry-get-inquiry-get",
    "operationId": "credit_v2_clients_clientId_assessmentInquiry_get_inquiry_get",
    "title": "گزارش اعتباری (مرحله ۲) — دریافت نتیجه",
    "category": "credit",
    "icon": "chart",
    "grantType": "authorization_sms",
    "scope": "credit:assessment-inquiry:get",
    "method": "GET",
    "path": "/credit/v2/clients/{clientId}/assessmentInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "assessmentId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شناسه گزارش دریافتی از مرحله ثبت درخواست",
        "placeholder": "8f3c1a2e-4b90-4d11-9c2a-1a2b3c4d5e6f"
      }
    ],
    "responseFields": []
  },
  {
    "id": "kyb-match-legal-id-with-members-get",
    "operationId": "kybMatchLegalIdWithMembersGet",
    "title": "تطبیق شناسه شرکت با اعضا",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:match-legal-id-with-members:get",
    "method": "GET",
    "path": "/kyb/v2/clients/{clientId}/matchLegalIdWithMembers",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "legalId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شناسه حقوقی",
        "placeholder": "25118762226"
      }
    ],
    "responseFields": [
      {
        "key": "isMatched",
        "label": "isMatched"
      }
    ]
  },
  {
    "id": "kyb-company-info-get",
    "operationId": "kybCompanyInfoGet",
    "title": "استعلام اطلاعات شرکت با شناسه ملی",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:company-info:get",
    "method": "GET",
    "path": "/kyb/v2/clients/{clientId}/companyInfo",
    "flow": "generic",
    "fields": [
      {
        "name": "companyId",
        "in": "query",
        "required": true,
        "kind": "card",
        "label": "شناسه ملی شرکت",
        "placeholder": "14000000000"
      }
    ],
    "responseFields": [
      {
        "key": "companyId",
        "label": "companyId"
      },
      {
        "key": "registrationNo",
        "label": "registrationNo"
      },
      {
        "key": "title",
        "label": "title"
      },
      {
        "key": "registrationDate",
        "label": "registrationDate"
      },
      {
        "key": "capital",
        "label": "capital"
      },
      {
        "key": "address",
        "label": "address"
      },
      {
        "key": "postalCode",
        "label": "کد پستی"
      },
      {
        "key": "status",
        "label": "status"
      },
      {
        "key": "registrationTypeTitle",
        "label": "registrationTypeTitle"
      },
      {
        "key": "persianRegistrationDate",
        "label": "persianRegistrationDate"
      }
    ]
  },
  {
    "id": "kyb-corporate-journal-get",
    "operationId": "kybCorporateJournalGet",
    "title": "استعلام آگهی‌های روزنامه رسمی شرکت",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:corporate-journal:get",
    "method": "GET",
    "path": "/kyb/v2/clients/{clientId}/corporateJournal",
    "flow": "generic",
    "fields": [
      {
        "name": "companyId",
        "in": "query",
        "required": true,
        "kind": "card",
        "label": "شناسه ملی شرکت",
        "placeholder": "14000000000"
      }
    ],
    "responseFields": []
  },
  {
    "id": "kyb-board-members-get",
    "operationId": "kybBoardMembersGet",
    "title": "استعلام اعضای هیئت مدیره",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:board-members:get",
    "method": "GET",
    "path": "/kyb/v2/clients/{clientId}/boardMembers",
    "flow": "generic",
    "fields": [
      {
        "name": "companyId",
        "in": "query",
        "required": true,
        "kind": "card",
        "label": "شناسه ملی شرکت",
        "placeholder": "14000000000"
      }
    ],
    "responseFields": []
  },
  {
    "id": "kyb-enamad-inquiry-get",
    "operationId": "kybEnamadInquiryGet",
    "title": "استعلام اینماد",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:enamad-inquiry:get",
    "method": "GET",
    "path": "/kyb/v2/clients/{clientId}/enamadInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "companyName",
        "in": "query",
        "required": true,
        "kind": "card",
        "label": "نام شرکت",
        "placeholder": "فین و تک پارس"
      },
      {
        "name": "website",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "آدرس وبسایت شرکت",
        "placeholder": "www.finnotech.ir"
      }
    ],
    "responseFields": [
      {
        "key": "licenseHolder",
        "label": "licenseHolder"
      },
      {
        "key": "registeredDate",
        "label": "registeredDate"
      },
      {
        "key": "expirationDate",
        "label": "expirationDate"
      }
    ]
  },
  {
    "id": "kyb-company-licenses-get",
    "operationId": "kybCompanyLicensesGet",
    "title": "استعلام مجوزهای شرکت",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:company-licenses:get",
    "method": "GET",
    "path": "/kyb/v2/clients/{clientId}/companyLicenses",
    "flow": "generic",
    "fields": [
      {
        "name": "companyId",
        "in": "query",
        "required": true,
        "kind": "card",
        "label": "شناسه ملی شرکت",
        "placeholder": "14000000000"
      }
    ],
    "responseFields": [
      {
        "key": "totalLicenses",
        "label": "totalLicenses"
      }
    ]
  },
  {
    "id": "kyb-authorized-signatories-get",
    "operationId": "kybAuthorizedSignatoriesGet",
    "title": "استعلام صاحبان امضا",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:authorized-signatories:get",
    "method": "GET",
    "path": "/kyb/v2/clients/{clientId}/authorizedSignatories",
    "flow": "generic",
    "fields": [
      {
        "name": "companyId",
        "in": "query",
        "required": true,
        "kind": "card",
        "label": "شناسه ملی شرکت",
        "placeholder": "14000000000"
      }
    ],
    "responseFields": [
      {
        "key": "newsId",
        "label": "newsId"
      },
      {
        "key": "signatureItemFullText",
        "label": "signatureItemFullText"
      },
      {
        "key": "newspaperDate",
        "label": "newspaperDate"
      },
      {
        "key": "companyTitle",
        "label": "companyTitle"
      }
    ]
  },
  {
    "id": "kyb-corporate-journal-submit",
    "operationId": "kybCorporateJournalSubmit",
    "title": "احراز امضاء روزنامه رسمی (مرحله ۱) — ثبت درخواست",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:corporate-journal-submit:post",
    "method": "POST",
    "path": "/kyb/v2/clients/{clientId}/corporateJournal/submit",
    "flow": "generic",
    "fields": [
      {
        "name": "requestId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه درخواست",
        "placeholder": "req-003"
      },
      {
        "name": "companyId",
        "in": "body",
        "required": true,
        "kind": "card",
        "label": "Company national ID (شناسه ملی شرکت)",
        "placeholder": "14007651115"
      },
      {
        "name": "signers",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "signers"
      },
      {
        "name": "documentType",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "documentType",
        "enum": [
          "administrative",
          "financial"
        ]
      },
      {
        "name": "conditions",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "conditions",
        "enum": [
          "normal",
          "absence of CEO"
        ]
      }
    ],
    "responseFields": []
  },
  {
    "id": "kyb-corporate-journal-inquiry",
    "operationId": "kybCorporateJournalInquiry",
    "title": "احراز امضاء روزنامه رسمی (مرحله ۲) — دریافت نتیجه",
    "category": "kyb",
    "icon": "folder",
    "grantType": "client_credentials",
    "scope": "kyb:corporate-journal-inquiry:post",
    "method": "POST",
    "path": "/kyb/v2/clients/{clientId}/corporateJournal/inquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "requestId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه درخواست",
        "placeholder": "req-003"
      }
    ],
    "responseFields": []
  },
  {
    "id": "vehicle-active-plate-numbers-get",
    "operationId": "vehicleActivePlateNumbersGet",
    "title": "لیست پلاک‌های فعال",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "vehicle:active-plate-numbers:get",
    "method": "GET",
    "path": "/vehicle/v2/clients/{clientId}/activePlateNumbers",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalId",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09123456789"
      }
    ],
    "responseFields": []
  },
  {
    "id": "vehicle-matching-vehicle-ownership-get",
    "operationId": "vehicleMatchingVehicleOwnershipGet",
    "title": "تطبیق مالکیت خودرو",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "vehicle:matching-vehicle-ownership:get",
    "method": "GET",
    "path": "/vehicle/v2/clients/{clientId}/matchingVehicleOwnership",
    "flow": "plate",
    "fields": [
      {
        "name": "nationalId",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "plateNumber",
        "in": "query",
        "required": true,
        "kind": "plate",
        "label": "شماره پلاک",
        "placeholder": "911716950"
      }
    ],
    "responseFields": [
      {
        "key": "isValid",
        "label": "isValid"
      },
      {
        "key": "vehicleType",
        "label": "vehicleType"
      },
      {
        "key": "vehicleTip",
        "label": "vehicleTip"
      },
      {
        "key": "vehicleModel",
        "label": "vehicleModel"
      }
    ]
  },
  {
    "id": "vehicle-plate-number-history-get",
    "operationId": "vehiclePlateNumberHistoryGet",
    "title": "تاریخچه پلاک",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "vehicle:plate-number-history:get",
    "method": "GET",
    "path": "/vehicle/v2/clients/{clientId}/plateNumberHistory",
    "flow": "plate",
    "fields": [
      {
        "name": "nationalId",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "plateNumber",
        "in": "query",
        "required": true,
        "kind": "plate",
        "label": "شماره پلاک",
        "placeholder": "911716950"
      },
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09123456789"
      }
    ],
    "responseFields": [
      {
        "key": "plateStatus",
        "label": "plateStatus"
      },
      {
        "key": "tracePlate",
        "label": "tracePlate"
      }
    ]
  },
  {
    "id": "vehicle-traffic-toll-inquiry-get",
    "operationId": "vehicleTrafficTollInquiryGet",
    "title": "استعلام طرح ترافیک",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "vehicle:traffic-toll-inquiry:get",
    "method": "GET",
    "path": "/vehicle/v2/clients/{clientId}/trafficTollInquiry",
    "flow": "plate",
    "fields": [
      {
        "name": "plateNumber",
        "in": "query",
        "required": true,
        "kind": "plate",
        "label": "شماره پلاک",
        "placeholder": "911716950"
      },
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09123456789"
      },
      {
        "name": "nationalId",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      }
    ],
    "responseFields": [
      {
        "key": "plateNumber",
        "label": "شماره پلاک"
      }
    ]
  },
  {
    "id": "vehicle-vehicle-info-inquiry-get",
    "operationId": "vehicleVehicleInfoInquiryGet",
    "title": "استعلام اطلاعات خودرو و تخفیفات",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "vehicle:vehicle-info-inquiry:get",
    "method": "GET",
    "path": "/vehicle/v2/clients/{clientId}/vehicleInfoInquiry",
    "flow": "plate",
    "fields": [
      {
        "name": "nationalId",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "plateNumber",
        "in": "query",
        "required": true,
        "kind": "plate",
        "label": "شماره پلاک",
        "placeholder": "911716950"
      }
    ],
    "responseFields": [
      {
        "key": "axelNo",
        "label": "axelNo"
      },
      {
        "key": "wheelNo",
        "label": "wheelNo"
      },
      {
        "key": "capacity",
        "label": "capacity"
      },
      {
        "key": "cylinderNo",
        "label": "cylinderNo"
      },
      {
        "key": "mainColor",
        "label": "mainColor"
      },
      {
        "key": "insuranceCompanyTitle",
        "label": "insuranceCompanyTitle"
      },
      {
        "key": "systemByInsuranceCompany",
        "label": "systemByInsuranceCompany"
      },
      {
        "key": "tipByInsuranceCompany",
        "label": "tipByInsuranceCompany"
      },
      {
        "key": "chassisNumber",
        "label": "chassisNumber"
      },
      {
        "key": "engineNumber",
        "label": "engineNumber"
      },
      {
        "key": "vin",
        "label": "vin"
      }
    ]
  },
  {
    "id": "billing-driving-offense-get",
    "operationId": "billingDrivingOffenseGet",
    "title": "استعلام خلافی خودرو",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "billing:driving-offense-inquiry:get",
    "method": "GET",
    "path": "/billing/v2/clients/{clientId}/drivingOffense",
    "flow": "plate",
    "fields": [
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09123456789"
      },
      {
        "name": "nationalID",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی صاحب خودرو",
        "placeholder": "0014578963"
      },
      {
        "name": "plateNumber",
        "in": "query",
        "required": true,
        "kind": "plate",
        "label": "شماره پلاک",
        "placeholder": "552411188"
      }
    ],
    "responseFields": [
      {
        "key": "TotalAmount",
        "label": "TotalAmount"
      }
    ]
  },
  {
    "id": "billing-negative-score-get",
    "operationId": "billingNegativeScoreGet",
    "title": "استعلام نمره منفی گواهینامه",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "billing:cc-negative-score:get",
    "method": "GET",
    "path": "/billing/v2/clients/{clientId}/negativeScore",
    "flow": "generic",
    "fields": [
      {
        "name": "licenseNumber",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شماره گواهینامه"
      },
      {
        "name": "nationalID",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "National ID (کد ملی)"
      },
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل"
      }
    ],
    "responseFields": [
      {
        "key": "LicenseNumber",
        "label": "LicenseNumber"
      },
      {
        "key": "NegativeScore",
        "label": "NegativeScore"
      },
      {
        "key": "Rule",
        "label": "Rule"
      }
    ]
  },
  {
    "id": "billing-riding-offense-get",
    "operationId": "billingRidingOffenseGet",
    "title": "استعلام خلافی موتور",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "billing:riding-offense-inquiry:get",
    "method": "GET",
    "path": "/billing/v2/clients/{clientId}/ridingOffense",
    "flow": "plate",
    "fields": [
      {
        "name": "plateNumber",
        "in": "query",
        "required": true,
        "kind": "plate",
        "label": "شماره پلاک"
      },
      {
        "name": "nationalID",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "National ID (کد ملی)"
      },
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل"
      }
    ],
    "responseFields": [
      {
        "key": "Amount",
        "label": "Amount"
      },
      {
        "key": "BillID",
        "label": "BillID"
      },
      {
        "key": "ComplaintCode",
        "label": "ComplaintCode"
      },
      {
        "key": "ComplaintStatus",
        "label": "ComplaintStatus"
      },
      {
        "key": "PaymentID",
        "label": "PaymentID"
      },
      {
        "key": "PlateNumber",
        "label": "PlateNumber"
      }
    ]
  },
  {
    "id": "billing-traffic-offense-image-get",
    "operationId": "billingTrafficOffenseImageGet",
    "title": "دریافت تصویر تخلفات رانندگی",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "billing:traffic-offense-image:get",
    "method": "GET",
    "path": "/billing/v2/clients/{clientId}/trafficOffenseImage",
    "flow": "generic",
    "fields": [
      {
        "name": "offenseId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شناسه تخلف"
      }
    ],
    "responseFields": [
      {
        "key": "OffenseId",
        "label": "OffenseId"
      },
      {
        "key": "PlateImageUrl",
        "label": "PlateImageUrl"
      },
      {
        "key": "VehicleImageUrl",
        "label": "VehicleImageUrl"
      }
    ]
  },
  {
    "id": "facility-card-to-iban-v2",
    "operationId": "facilityCardToIbanV2",
    "title": "تبدیل کارت به شبا",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "client_credentials",
    "scope": "facility:card-to-iban:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/cardToIban",
    "flow": "generic",
    "fields": [
      {
        "name": "card",
        "in": "query",
        "required": true,
        "kind": "card",
        "label": "شماره کارت",
        "placeholder": "6362141081734437"
      },
      {
        "name": "version",
        "in": "query",
        "required": true,
        "kind": "select",
        "label": "ورژن API — باید برابر ۲ باشد",
        "enum": [
          "2"
        ],
        "placeholder": "2"
      }
    ],
    "responseFields": [
      {
        "key": "IBAN",
        "label": "IBAN"
      },
      {
        "key": "bankName",
        "label": "bankName"
      },
      {
        "key": "deposit",
        "label": "شماره حساب"
      },
      {
        "key": "card",
        "label": "شماره کارت"
      },
      {
        "key": "depositStatus",
        "label": "depositStatus"
      },
      {
        "key": "depositOwners",
        "label": "depositOwners"
      }
    ]
  },
  {
    "id": "facility-card-to-iban-v5",
    "operationId": "facilityCardToIbanV5",
    "title": "تبدیل کارت به شبا ورژن پنج",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "client_credentials",
    "scope": "facility:card-to-iban-v5:post",
    "method": "POST",
    "path": "/facility/v5/clients/{clientId}/cardToIban",
    "flow": "generic",
    "fields": [
      {
        "name": "card",
        "in": "body",
        "required": true,
        "kind": "card",
        "label": "شماره کارت",
        "maxLength": 16,
        "placeholder": "6362141081734437"
      }
    ],
    "responseFields": [
      {
        "key": "IBAN",
        "label": "IBAN"
      },
      {
        "key": "bankName",
        "label": "bankName"
      },
      {
        "key": "deposit",
        "label": "شماره حساب"
      },
      {
        "key": "card",
        "label": "شماره کارت"
      },
      {
        "key": "depositOwners",
        "label": "depositOwners"
      },
      {
        "key": "bankCode",
        "label": "bankCode"
      }
    ]
  },
  {
    "id": "mpg-card-information-get",
    "operationId": "mpgCardInformationGet",
    "title": "استعلام کارت",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "client_credentials",
    "scope": "card:information:get",
    "method": "GET",
    "path": "/mpg/v2/clients/{clientId}/cards/{card}",
    "flow": "generic",
    "fields": [
      {
        "name": "card",
        "in": "path",
        "required": true,
        "kind": "card",
        "label": "شماره کارت",
        "placeholder": "6362141081734437"
      }
    ],
    "responseFields": [
      {
        "key": "destCard",
        "label": "destCard"
      },
      {
        "key": "name",
        "label": "name"
      },
      {
        "key": "result",
        "label": "result"
      },
      {
        "key": "description",
        "label": "description"
      },
      {
        "key": "doTime",
        "label": "doTime"
      },
      {
        "key": "bankName",
        "label": "bankName"
      }
    ]
  },
  {
    "id": "facility-national-card-image-get",
    "operationId": "facilityNationalCardImageGet",
    "title": "دریافت تصویر کارت ملی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "facility:national-card-image:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/nationalCardImage",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "serial",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "سریال کارت ملی (یا کد رهگیری)"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1356/02/23"
      }
    ],
    "responseFields": [
      {
        "key": "trackingCode",
        "label": "trackingCode"
      },
      {
        "key": "image",
        "label": "image"
      },
      {
        "key": "message",
        "label": "متن پیامک"
      }
    ]
  },
  {
    "id": "facility-shahkar-verify-get",
    "operationId": "facilityShahkarVerifyGet",
    "title": "تطبیق شاهکار موبایل و کد ملی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "facility:shahkar:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/shahkar/verify",
    "flow": "generic",
    "fields": [
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل",
        "placeholder": "09123456789"
      },
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "1111111111"
      }
    ],
    "responseFields": [
      {
        "key": "isValid",
        "label": "isValid"
      }
    ]
  },
  {
    "id": "oak-iban-inquiry-get",
    "operationId": "oakIbanInquiryGet",
    "title": "استعلام شبا و صاحبان حساب",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "client_credentials",
    "scope": "oak:iban-inquiry:get",
    "method": "GET",
    "path": "/oak/v2/clients/{clientId}/ibanInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "iban",
        "in": "query",
        "required": true,
        "kind": "iban",
        "label": "شماره شبا",
        "placeholder": "IR111111111111111111111111"
      }
    ],
    "responseFields": [
      {
        "key": "IBAN",
        "label": "IBAN"
      },
      {
        "key": "bankName",
        "label": "bankName"
      },
      {
        "key": "deposit",
        "label": "شماره حساب"
      },
      {
        "key": "depositDescription",
        "label": "depositDescription"
      },
      {
        "key": "depositComment",
        "label": "depositComment"
      },
      {
        "key": "depositStatus",
        "label": "depositStatus"
      },
      {
        "key": "errorDescription",
        "label": "errorDescription"
      },
      {
        "key": "bankCode",
        "label": "bankCode"
      }
    ]
  },
  {
    "id": "oak-cc-statement-get",
    "operationId": "oakCcStatementGet",
    "title": "دریافت گردش حساب",
    "category": "account",
    "icon": "wallet",
    "grantType": "authorization_sms",
    "scope": "oak:cc-statement:get",
    "method": "GET",
    "path": "/oak/v2/clients/{clientId}/deposits/{deposit}/cc/statement",
    "flow": "otp",
    "fields": [
      {
        "name": "deposit",
        "in": "path",
        "required": true,
        "kind": "text",
        "label": "شماره حساب"
      },
      {
        "name": "fromDate",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "fromDate",
        "placeholder": "000510"
      },
      {
        "name": "toDate",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "toDate",
        "placeholder": "000610"
      },
      {
        "name": "fromTime",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "fromTime"
      },
      {
        "name": "toTime",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "toTime"
      },
      {
        "name": "lastRecordNumber",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "lastRecordNumber"
      }
    ],
    "responseFields": [
      {
        "key": "iban",
        "label": "شماره شبا"
      },
      {
        "key": "branchCode",
        "label": "branchCode"
      },
      {
        "key": "branchName",
        "label": "branchName"
      },
      {
        "key": "accountCurrentBalance",
        "label": "accountCurrentBalance"
      },
      {
        "key": "lastRecordNumber",
        "label": "lastRecordNumber"
      },
      {
        "key": "openDate",
        "label": "openDate"
      },
      {
        "key": "accountTypeCode",
        "label": "accountTypeCode"
      },
      {
        "key": "subTypeCode",
        "label": "subTypeCode"
      },
      {
        "key": "customerName",
        "label": "customerName"
      },
      {
        "key": "customerFamilyName",
        "label": "customerFamilyName"
      },
      {
        "key": "accountAvailableBalance",
        "label": "accountAvailableBalance"
      },
      {
        "key": "accountAvailableBalanceSign",
        "label": "accountAvailableBalanceSign"
      }
    ]
  },
  {
    "id": "oak-transfer-to-deposit-post",
    "operationId": "oakTransferToDepositPost",
    "title": "انتقال وجه به حساب",
    "category": "account",
    "icon": "wallet",
    "grantType": "authorization_sms",
    "scope": "oak:transfer-to:execute",
    "method": "POST",
    "path": "/oak/v2/clients/{clientId}/transferTo",
    "flow": "otp",
    "fields": [
      {
        "name": "amount",
        "in": "body",
        "required": true,
        "kind": "number",
        "label": "مبلغ",
        "placeholder": "1"
      },
      {
        "name": "description",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "description",
        "maxLength": 30
      },
      {
        "name": "destinationFirstname",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "destinationFirstname",
        "maxLength": 30
      },
      {
        "name": "destinationLastname",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "destinationLastname",
        "maxLength": 30
      },
      {
        "name": "destinationNumber",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "destinationNumber"
      },
      {
        "name": "paymentNumber",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "paymentNumber"
      },
      {
        "name": "reasonDescription",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "reasonDescription"
      },
      {
        "name": "deposit",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "شماره حساب"
      },
      {
        "name": "sourceFirstName",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "sourceFirstName"
      },
      {
        "name": "sourceLastName",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "sourceLastName"
      },
      {
        "name": "secondPassword",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "رمز انتقال وجه. اجباری برای بانک پارسیان."
      },
      {
        "name": "merchantName",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "نام پذیرنده (بانک آینده). اختیاری."
      },
      {
        "name": "merchantIban",
        "in": "body",
        "required": false,
        "kind": "iban",
        "label": "شماره شبا پذیرنده (بانک آینده). اختیاری."
      }
    ],
    "responseFields": [
      {
        "key": "amount",
        "label": "مبلغ"
      },
      {
        "key": "description",
        "label": "description"
      },
      {
        "key": "destinationFirstname",
        "label": "destinationFirstname"
      },
      {
        "key": "destinationLastname",
        "label": "destinationLastname"
      },
      {
        "key": "destinationNumber",
        "label": "destinationNumber"
      },
      {
        "key": "inquiryDate",
        "label": "inquiryDate"
      },
      {
        "key": "inquirySequence",
        "label": "inquirySequence"
      },
      {
        "key": "inquiryTime",
        "label": "inquiryTime"
      },
      {
        "key": "message",
        "label": "متن پیامک"
      },
      {
        "key": "paymentNumber",
        "label": "paymentNumber"
      },
      {
        "key": "refCode",
        "label": "refCode"
      },
      {
        "key": "sourceFirstname",
        "label": "sourceFirstname"
      }
    ]
  },
  {
    "id": "facility-deposit-to-iban-get",
    "operationId": "facilityDepositToIbanGet",
    "title": "تبدیل حساب به شبا",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "client_credentials",
    "scope": "facility:cc-deposit-iban:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/depositToIban",
    "flow": "generic",
    "fields": [
      {
        "name": "deposit",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شماره حساب",
        "placeholder": "1071333715508"
      },
      {
        "name": "bankCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "کد بانک صاحب حساب"
      }
    ],
    "responseFields": [
      {
        "key": "deposit",
        "label": "شماره حساب"
      },
      {
        "key": "accountStatus",
        "label": "accountStatus"
      },
      {
        "key": "bankName",
        "label": "bankName"
      },
      {
        "key": "iban",
        "label": "شماره شبا"
      },
      {
        "key": "depositOwners",
        "label": "depositOwners"
      }
    ]
  },
  {
    "id": "facility-card-to-deposit-get",
    "operationId": "facilityCardToDepositGet",
    "title": "تبدیل شماره کارت به شماره حساب",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "client_credentials",
    "scope": "facility:card-to-deposit:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/cardToDeposit",
    "flow": "generic",
    "fields": [
      {
        "name": "card",
        "in": "query",
        "required": true,
        "kind": "card",
        "label": "شماره کارت",
        "placeholder": "6362141081734437"
      }
    ],
    "responseFields": [
      {
        "key": "destCard",
        "label": "destCard"
      },
      {
        "key": "name",
        "label": "name"
      },
      {
        "key": "result",
        "label": "result"
      },
      {
        "key": "doTime",
        "label": "doTime"
      },
      {
        "key": "description",
        "label": "description"
      },
      {
        "key": "deposit",
        "label": "شماره حساب"
      }
    ]
  },
  {
    "id": "facility-shahkar-sms-send-get",
    "operationId": "facilityShahkarSmsSendGet",
    "title": "تطبیق موبایل و کد ملی با پیامک",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "facility:sms-shahkar-send:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/shahkar/smsSend",
    "flow": "generic",
    "fields": [
      {
        "name": "mobile",
        "in": "query",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل"
      },
      {
        "name": "nationalCode",
        "in": "query",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0057684356"
      },
      {
        "name": "version",
        "in": "query",
        "required": false,
        "kind": "select",
        "label": "برای نسخه به‌روز، مقدار ۲",
        "enum": [
          "2"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "smsSent",
        "label": "smsSent"
      }
    ]
  },
  {
    "id": "facility-nid-inquiry-cc-get",
    "operationId": "facilityNidInquiryCcGet",
    "title": "استعلام کد ملی (Client Credential)",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "facility:cc-nid-inquiry:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/users/{nid}/cc/nidInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "nid",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0123456789"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1372/07/14"
      }
    ],
    "responseFields": [
      {
        "key": "birthdate",
        "label": "birthdate"
      },
      {
        "key": "deathStatus",
        "label": "deathStatus"
      },
      {
        "key": "nationalCode",
        "label": "کد ملی"
      },
      {
        "key": "firstName",
        "label": "نام"
      },
      {
        "key": "lastName",
        "label": "نام خانوادگی"
      },
      {
        "key": "fatherName",
        "label": "نام پدر"
      }
    ]
  },
  {
    "id": "facility-nid-inquiry-sms-get",
    "operationId": "facilityNidInquirySmsGet",
    "title": "استعلام کد ملی (Authorization SMS)",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "authorization_sms",
    "scope": "facility:sms-nid-inquiry:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/users/{nid}/sms/nidInquiry",
    "flow": "otp",
    "fields": [
      {
        "name": "nid",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0123456789"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1372/07/14"
      }
    ],
    "responseFields": [
      {
        "key": "birthdate",
        "label": "birthdate"
      },
      {
        "key": "deathStatus",
        "label": "deathStatus"
      },
      {
        "key": "nationalCode",
        "label": "کد ملی"
      },
      {
        "key": "firstName",
        "label": "نام"
      },
      {
        "key": "lastName",
        "label": "نام خانوادگی"
      },
      {
        "key": "fatherName",
        "label": "نام پدر"
      }
    ]
  },
  {
    "id": "facility-nid-verification-cc",
    "operationId": "facilityNidVerificationCc",
    "title": "احراز هویت با کد ملی",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "client_credentials",
    "scope": "facility:cc-nid-verification:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/users/{nid}/cc/nidVerification",
    "flow": "generic",
    "fields": [
      {
        "name": "nid",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0067408595"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1365/11/25"
      },
      {
        "name": "fullName",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "نام کامل",
        "placeholder": "سعید غلامی فرد"
      },
      {
        "name": "firstName",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "نام",
        "placeholder": "سعید"
      },
      {
        "name": "lastName",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "نام خانوادگی",
        "placeholder": "غلامی فرد"
      },
      {
        "name": "fatherName",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "نام پدر"
      },
      {
        "name": "gender",
        "in": "query",
        "required": false,
        "kind": "select",
        "label": "جنسیت",
        "enum": [
          "زن",
          "مرد"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "nationalCode",
        "label": "کد ملی"
      },
      {
        "key": "birthDate",
        "label": "تاریخ تولد"
      },
      {
        "key": "status",
        "label": "status"
      },
      {
        "key": "fullName",
        "label": "نام کامل"
      },
      {
        "key": "fullNameSimilarity",
        "label": "fullNameSimilarity"
      },
      {
        "key": "firstName",
        "label": "نام"
      },
      {
        "key": "firstNameSimilarity",
        "label": "firstNameSimilarity"
      },
      {
        "key": "lastName",
        "label": "نام خانوادگی"
      },
      {
        "key": "lastNameSimilarity",
        "label": "lastNameSimilarity"
      },
      {
        "key": "fatherName",
        "label": "نام پدر"
      },
      {
        "key": "fatherNameSimilarity",
        "label": "fatherNameSimilarity"
      },
      {
        "key": "deathStatus",
        "label": "deathStatus"
      }
    ]
  },
  {
    "id": "facility-nid-verification-sms",
    "operationId": "facilityNidVerificationSms",
    "title": "احراز هویت با کد ملی با پیامک",
    "category": "kyc",
    "icon": "shieldCheck",
    "grantType": "authorization_sms",
    "scope": "facility:sms-nid-verification:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/users/{nid}/sms/nidVerification",
    "flow": "otp",
    "fields": [
      {
        "name": "nid",
        "in": "path",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی",
        "placeholder": "0067408595"
      },
      {
        "name": "birthDate",
        "in": "query",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد",
        "placeholder": "1365/11/25"
      },
      {
        "name": "fullName",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "نام کامل"
      },
      {
        "name": "firstName",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "نام"
      },
      {
        "name": "lastName",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "نام خانوادگی"
      },
      {
        "name": "fatherName",
        "in": "query",
        "required": false,
        "kind": "text",
        "label": "نام پدر"
      },
      {
        "name": "gender",
        "in": "query",
        "required": false,
        "kind": "select",
        "label": "جنسیت",
        "enum": [
          "زن",
          "مرد"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "nationalCode",
        "label": "کد ملی"
      },
      {
        "key": "birthDate",
        "label": "تاریخ تولد"
      },
      {
        "key": "status",
        "label": "status"
      },
      {
        "key": "fullName",
        "label": "نام کامل"
      },
      {
        "key": "fullNameSimilarity",
        "label": "fullNameSimilarity"
      },
      {
        "key": "firstName",
        "label": "نام"
      },
      {
        "key": "firstNameSimilarity",
        "label": "firstNameSimilarity"
      },
      {
        "key": "lastName",
        "label": "نام خانوادگی"
      },
      {
        "key": "lastNameSimilarity",
        "label": "lastNameSimilarity"
      },
      {
        "key": "fatherName",
        "label": "نام پدر"
      },
      {
        "key": "fatherNameSimilarity",
        "label": "fatherNameSimilarity"
      },
      {
        "key": "deathStatus",
        "label": "deathStatus"
      }
    ]
  },
  {
    "id": "facility-deposit-info-get",
    "operationId": "facilityDepositInfoGet",
    "title": "استعلام حساب",
    "category": "inquiry",
    "icon": "refresh",
    "grantType": "client_credentials",
    "scope": "facility:deposit-information:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/depositInfo",
    "flow": "generic",
    "fields": [
      {
        "name": "deposit",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شماره حساب"
      }
    ],
    "responseFields": [
      {
        "key": "bankName",
        "label": "bankName"
      },
      {
        "key": "fullName",
        "label": "نام کامل"
      }
    ]
  },
  {
    "id": "facility-finnotext-post",
    "operationId": "facilityFinnotextPost",
    "title": "فینوتکست — ارسال پیامک گروهی",
    "category": "sms",
    "icon": "messages",
    "grantType": "client_credentials",
    "scope": "facility:finnotext:post",
    "method": "POST",
    "path": "/facility/v2/clients/{clientId}/finnotext",
    "flow": "plate",
    "fields": [
      {
        "name": "from",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "سرشماره اختصاص‌یافته به کلاینت",
        "placeholder": "200000"
      },
      {
        "name": "to",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لیست شماره‌های مقصد"
      },
      {
        "name": "message",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "متن پیامک"
      },
      {
        "name": "templateId",
        "in": "body",
        "required": false,
        "kind": "plate",
        "label": "شناسه قالب (اختیاری)"
      }
    ],
    "responseFields": [
      {
        "key": "numberOfRecords",
        "label": "numberOfRecords"
      },
      {
        "key": "numberOfParts",
        "label": "numberOfParts"
      }
    ]
  },
  {
    "id": "facility-finnotext-otp-post",
    "operationId": "facilityFinnotextOtpPost",
    "title": "ارسال پیامک کد تأیید (OTP)",
    "category": "sms",
    "icon": "messages",
    "grantType": "client_credentials",
    "scope": "facility:finnotext-otp:post",
    "method": "POST",
    "path": "/facility/v2/clients/{clientId}/finnotextOtp",
    "flow": "plate",
    "fields": [
      {
        "name": "from",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "سرشماره"
      },
      {
        "name": "to",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شماره مقصد"
      },
      {
        "name": "message",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "متن پیامک"
      },
      {
        "name": "templateId",
        "in": "body",
        "required": false,
        "kind": "plate",
        "label": "شناسه قالب (اختیاری)"
      }
    ],
    "responseFields": [
      {
        "key": "numberOfRecords",
        "label": "numberOfRecords"
      },
      {
        "key": "numberOfParts",
        "label": "numberOfParts"
      }
    ]
  },
  {
    "id": "facility-finnotext-inquiry-get",
    "operationId": "facilityFinnotextInquiryGet",
    "title": "استعلام فینوتکست",
    "category": "sms",
    "icon": "messages",
    "grantType": "client_credentials",
    "scope": "facility:finnotext-inquiry:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/finnotextInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "inquiryTrackId",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "trackId استفاده‌شده در فراخوانی سرویس فینوتکست",
        "placeholder": "ef226c90-20cc-48c6-b582-dee29e71676a"
      }
    ],
    "responseFields": []
  },
  {
    "id": "facility-receive-sms-get",
    "operationId": "facilityReceiveSmsGet",
    "title": "دریافت پیامک",
    "category": "sms",
    "icon": "messages",
    "grantType": "client_credentials",
    "scope": "facility:receive-sms:get",
    "method": "GET",
    "path": "/facility/v2/clients/{clientId}/receiveSMS",
    "flow": "generic",
    "fields": [
      {
        "name": "destinationNumber",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "سرشماره دریافت‌کننده پیامک",
        "placeholder": "9092301202"
      },
      {
        "name": "startDateTime",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "تاریخ شروع بازه (شمسی، yyyy/mm/dd)",
        "placeholder": "1405/06/09"
      },
      {
        "name": "endDateTime",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "تاریخ پایان بازه (شمسی، yyyy/mm/dd)",
        "placeholder": "1405/06/09"
      }
    ],
    "responseFields": []
  },
  {
    "id": "messaging-otp-initiate-post",
    "operationId": "messagingOtpInitiatePost",
    "title": "ثبت درخواست ارسال رمز یکبار مصرف (Initiate)",
    "category": "sms",
    "icon": "messages",
    "grantType": "client_credentials",
    "scope": "messaging:otp-initiate:post",
    "method": "POST",
    "path": "/messaging/v2/clients/{clientId}/otp/initiate",
    "flow": "generic",
    "fields": [
      {
        "name": "identifier",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شماره موبایل یا شناسه کاربر",
        "placeholder": "09123456789"
      },
      {
        "name": "method",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "متد ارسال رمز",
        "enum": [
          "sms",
          "ussd",
          "bot"
        ]
      },
      {
        "name": "purpose",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "هدف از ارسال (جهت گزارش‌گیری و متن پیام)",
        "placeholder": "login"
      },
      {
        "name": "ttl",
        "in": "body",
        "required": false,
        "kind": "number",
        "label": "مدت زمان اعتبار رمز به ثانیه (پیش‌فرض ۱۲۰)",
        "placeholder": "120"
      }
    ],
    "responseFields": [
      {
        "key": "traceId",
        "label": "traceId"
      },
      {
        "key": "status",
        "label": "status"
      },
      {
        "key": "expiresIn",
        "label": "expiresIn"
      }
    ]
  },
  {
    "id": "messaging-otp-verify-post",
    "operationId": "messagingOtpVerifyPost",
    "title": "صحت‌سنجی رمز یکبار مصرف (Verify)",
    "category": "sms",
    "icon": "messages",
    "grantType": "client_credentials",
    "scope": "messaging:otp-verify:post",
    "method": "POST",
    "path": "/messaging/v2/clients/{clientId}/otp/verify",
    "flow": "generic",
    "fields": [
      {
        "name": "traceId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه دریافتی از مرحله Initiate",
        "placeholder": "atx_88234-9912"
      },
      {
        "name": "otp",
        "in": "body",
        "required": true,
        "kind": "otp",
        "label": "کد تایید",
        "placeholder": "554321"
      }
    ],
    "responseFields": [
      {
        "key": "status",
        "label": "status"
      },
      {
        "key": "verifiedAt",
        "label": "verifiedAt"
      }
    ]
  },
  {
    "id": "ecity-postal-code-inquiry-get",
    "operationId": "ecityPostalCodeInquiryGet",
    "title": "استعلام کد پستی",
    "category": "postal",
    "icon": "pin",
    "grantType": "client_credentials",
    "scope": "ecity:cc-postal-code-inquiry:get",
    "method": "GET",
    "path": "/ecity/v2/clients/{clientId}/postalCode",
    "flow": "generic",
    "fields": [
      {
        "name": "postalCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "کد پستی",
        "placeholder": "1341666958"
      }
    ],
    "responseFields": [
      {
        "key": "postalCode",
        "label": "کد پستی"
      },
      {
        "key": "street",
        "label": "street"
      },
      {
        "key": "localityName",
        "label": "localityName"
      },
      {
        "key": "province",
        "label": "province"
      },
      {
        "key": "floor",
        "label": "floor"
      },
      {
        "key": "houseNumber",
        "label": "houseNumber"
      },
      {
        "key": "localityType",
        "label": "localityType"
      },
      {
        "key": "street2",
        "label": "street2"
      },
      {
        "key": "subLocality",
        "label": "subLocality"
      },
      {
        "key": "townShip",
        "label": "townShip"
      },
      {
        "key": "zone",
        "label": "zone"
      },
      {
        "key": "address",
        "label": "address"
      }
    ]
  },
  {
    "id": "ecity-postal-code-inquiry-coordinates-get",
    "operationId": "ecityPostalCodeInquiryCoordinatesGet",
    "title": "استعلام کد پستی همراه با مختصات جغرافیایی",
    "category": "postal",
    "icon": "pin",
    "grantType": "client_credentials",
    "scope": "ecity:postal-code-inquiry-coordinates:get",
    "method": "GET",
    "path": "/ecity/v2/clients/{clientId}/postalCodeInquiryCoordinates",
    "flow": "generic",
    "fields": [
      {
        "name": "postalCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "کد پستی",
        "placeholder": "1341666958"
      }
    ],
    "responseFields": [
      {
        "key": "postalCode",
        "label": "کد پستی"
      },
      {
        "key": "localityName",
        "label": "localityName"
      },
      {
        "key": "province",
        "label": "province"
      },
      {
        "key": "localityType",
        "label": "localityType"
      },
      {
        "key": "subLocality",
        "label": "subLocality"
      },
      {
        "key": "townShip",
        "label": "townShip"
      },
      {
        "key": "address",
        "label": "address"
      },
      {
        "key": "street",
        "label": "street"
      },
      {
        "key": "street2",
        "label": "street2"
      },
      {
        "key": "houseNumber",
        "label": "houseNumber"
      },
      {
        "key": "buildingId",
        "label": "buildingId"
      },
      {
        "key": "floor",
        "label": "floor"
      }
    ]
  },
  {
    "id": "ecity-postal-inquiry-get",
    "operationId": "ecityPostalInquiryGet",
    "title": "استعلام مرسولات پستی",
    "category": "postal",
    "icon": "pin",
    "grantType": "client_credentials",
    "scope": "ecity:postal-inquiry:get",
    "method": "GET",
    "path": "/ecity/v2/clients/{clientId}/postalInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "trackingCode",
        "in": "query",
        "required": true,
        "kind": "text",
        "label": "شناسه پیگیری مرسوله",
        "placeholder": "000000000000000000000000"
      }
    ],
    "responseFields": [
      {
        "key": "postType",
        "label": "postType"
      },
      {
        "key": "sourcePostOffice",
        "label": "sourcePostOffice"
      },
      {
        "key": "source",
        "label": "source"
      },
      {
        "key": "destination",
        "label": "مقصد"
      },
      {
        "key": "senderName",
        "label": "senderName"
      },
      {
        "key": "receiverName",
        "label": "receiverName"
      },
      {
        "key": "weight",
        "label": "weight"
      },
      {
        "key": "totalAmount",
        "label": "totalAmount"
      }
    ]
  },
  {
    "id": "ecity-freeway-toll-inquiry-get",
    "operationId": "ecityFreewayTollInquiryGet",
    "title": "استعلام عوارض آزادراهی",
    "category": "vehicle",
    "icon": "car",
    "grantType": "client_credentials",
    "scope": "ecity:freeway-toll-inquiry:get",
    "method": "GET",
    "path": "/ecity/v2/clients/{clientId}/freewayTollInquiry",
    "flow": "plate",
    "fields": [
      {
        "name": "plateNumber",
        "in": "query",
        "required": true,
        "kind": "plate",
        "label": "شماره پلاک",
        "placeholder": "911716950"
      }
    ],
    "responseFields": [
      {
        "key": "totalAmount",
        "label": "totalAmount"
      }
    ]
  },
  {
    "id": "sign-digital-sign-otp-request-post",
    "operationId": "signDigitalSignOtpRequestPost",
    "title": "درخواست کد یکبارمصرف امضای دیجیتال",
    "category": "signature",
    "icon": "shieldNote",
    "grantType": "client_credentials",
    "scope": "sign:digital-sign-otp-request:post",
    "method": "POST",
    "path": "/sign/v2/clients/{clientId}/digitalSign/otpRequest",
    "flow": "upload",
    "fields": [
      {
        "name": "nationalId",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      },
      {
        "name": "mobile",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل"
      },
      {
        "name": "purpose",
        "in": "body",
        "required": true,
        "kind": "file",
        "label": "purpose",
        "enum": [
          "enroll",
          "sign",
          "revoke"
        ]
      },
      {
        "name": "documentHashes",
        "in": "body",
        "required": false,
        "kind": "file",
        "label": "documentHashes"
      },
      {
        "name": "otpAutofillHost",
        "in": "body",
        "required": false,
        "kind": "otp",
        "label": "otpAutofillHost",
        "placeholder": "sign.bank.example"
      },
      {
        "name": "provider",
        "in": "body",
        "required": false,
        "kind": "select",
        "label": "provider",
        "enum": [
          "emzasan",
          "sepidar",
          "pki"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "isDone",
        "label": "isDone"
      },
      {
        "key": "challengeId",
        "label": "challengeId"
      },
      {
        "key": "expiresIn",
        "label": "expiresIn"
      },
      {
        "key": "providerCode",
        "label": "providerCode"
      }
    ]
  },
  {
    "id": "sign-digital-sign-enroll-post",
    "operationId": "signDigitalSignEnrollPost",
    "title": "ثبت‌نام گواهی امضای دیجیتال",
    "category": "signature",
    "icon": "shieldNote",
    "grantType": "client_credentials",
    "scope": "sign:digital-sign-enroll:post",
    "method": "POST",
    "path": "/sign/v2/clients/{clientId}/digitalSign/enroll",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalId",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      },
      {
        "name": "persianFirstName",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نام فارسی"
      },
      {
        "name": "persianLastName",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نام خانوادگی فارسی"
      },
      {
        "name": "englishFirstName",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نام لاتین. با حرف انگلیسی شروع می‌شود."
      },
      {
        "name": "englishLastName",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نام خانوادگی لاتین. با حرف انگلیسی شروع می‌شود."
      },
      {
        "name": "mobile",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل"
      },
      {
        "name": "province",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "استان"
      },
      {
        "name": "city",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شهر"
      },
      {
        "name": "certType",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "نوع گواهی",
        "enum": [
          "UNAFFILIATED"
        ]
      },
      {
        "name": "otp",
        "in": "body",
        "required": true,
        "kind": "otp",
        "label": "کد تایید"
      },
      {
        "name": "pin",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "pin"
      },
      {
        "name": "challengeId",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "challengeId"
      },
      {
        "name": "provider",
        "in": "body",
        "required": false,
        "kind": "select",
        "label": "provider",
        "enum": [
          "emzasan",
          "sepidar",
          "pki"
        ]
      },
      {
        "name": "gender",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "جنسیت",
        "enum": [
          "male",
          "female"
        ]
      },
      {
        "name": "fatherName",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نام پدر"
      },
      {
        "name": "birthDate",
        "in": "body",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد"
      },
      {
        "name": "address",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نشانی"
      },
      {
        "name": "postalCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد پستی"
      },
      {
        "name": "email",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "لازم است. sepidar و pki همین مقدار را می‌فرستند."
      }
    ],
    "responseFields": [
      {
        "key": "certStatus",
        "label": "certStatus"
      }
    ]
  },
  {
    "id": "sign-digital-sign-user-by-national-id-post",
    "operationId": "signDigitalSignUserByNationalIdPost",
    "title": "استعلام کاربر امضای دیجیتال با کد ملی",
    "category": "signature",
    "icon": "shieldNote",
    "grantType": "client_credentials",
    "scope": "sign:digital-sign-user-by-national-id:post",
    "method": "POST",
    "path": "/sign/v2/clients/{clientId}/digitalSign/userByNationalId",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalId",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      },
      {
        "name": "provider",
        "in": "body",
        "required": false,
        "kind": "select",
        "label": "provider",
        "enum": [
          "emzasan",
          "sepidar",
          "pki"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "nationalId",
        "label": "کد ملی"
      },
      {
        "key": "certStatus",
        "label": "certStatus"
      },
      {
        "key": "certType",
        "label": "certType"
      },
      {
        "key": "providerCode",
        "label": "providerCode"
      }
    ]
  },
  {
    "id": "sign-digital-sign-post",
    "operationId": "signDigitalSignPost",
    "title": "امضای PDF",
    "category": "signature",
    "icon": "shieldNote",
    "grantType": "client_credentials",
    "scope": "sign:digital-sign:post",
    "method": "POST",
    "path": "/sign/v2/clients/{clientId}/digitalSign/sign",
    "flow": "generic",
    "fields": [],
    "responseFields": [
      {
        "key": "signingTrackId",
        "label": "signingTrackId"
      },
      {
        "key": "providerCode",
        "label": "providerCode"
      }
    ]
  },
  {
    "id": "sign-digital-sign-verify-post",
    "operationId": "signDigitalSignVerifyPost",
    "title": "اعتبارسنجی PDF امضاشده",
    "category": "signature",
    "icon": "shieldNote",
    "grantType": "client_credentials",
    "scope": "sign:digital-sign-verify:post",
    "method": "POST",
    "path": "/sign/v2/clients/{clientId}/digitalSign/verify",
    "flow": "upload",
    "fields": [
      {
        "name": "pdf",
        "in": "body",
        "required": true,
        "kind": "file",
        "label": "pdf"
      },
      {
        "name": "provider",
        "in": "body",
        "required": false,
        "kind": "select",
        "label": "provider",
        "enum": [
          "emzasan",
          "sepidar",
          "pki"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "valid",
        "label": "valid"
      }
    ]
  },
  {
    "id": "sign-digital-sign-revoke-post",
    "operationId": "signDigitalSignRevokePost",
    "title": "ابطال گواهی امضای دیجیتال",
    "category": "signature",
    "icon": "shieldNote",
    "grantType": "client_credentials",
    "scope": "sign:digital-sign-revoke:post",
    "method": "POST",
    "path": "/sign/v2/clients/{clientId}/digitalSign/revoke",
    "flow": "generic",
    "fields": [
      {
        "name": "nationalId",
        "in": "body",
        "required": true,
        "kind": "nationalCode",
        "label": "کد ملی"
      },
      {
        "name": "otp",
        "in": "body",
        "required": true,
        "kind": "otp",
        "label": "کد تایید"
      },
      {
        "name": "challengeId",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "challengeId"
      },
      {
        "name": "provider",
        "in": "body",
        "required": false,
        "kind": "select",
        "label": "provider",
        "enum": [
          "emzasan",
          "sepidar",
          "pki"
        ]
      }
    ],
    "responseFields": [
      {
        "key": "revoked",
        "label": "revoked"
      }
    ]
  },
  {
    "id": "promissory-publish-request-post",
    "operationId": "promissoryPublishRequestPost",
    "title": "صدور سفته الکترونیکی",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:publish-request:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissoryPublishRequest",
    "flow": "generic",
    "fields": [
      {
        "name": "issuerFullName",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نام فارسی صادرکننده"
      },
      {
        "name": "issuerType",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "نوع هویت صادرکننده؛ ۱ شخص حقیقی",
        "enum": [
          "1"
        ]
      },
      {
        "name": "issuerNationalId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد ملی صادرکننده"
      },
      {
        "name": "issuerIban",
        "in": "body",
        "required": true,
        "kind": "iban",
        "label": "issuerIban"
      },
      {
        "name": "issuerPostalCode",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "issuerPostalCode"
      },
      {
        "name": "issuerAddress",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "issuerAddress"
      },
      {
        "name": "issuerMobile",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "issuerMobile"
      },
      {
        "name": "receiverFullName",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "نام فارسی دریافت‌کننده"
      },
      {
        "name": "receiverType",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "نوع هویت دریافت‌کننده؛ ۱ حقیقی، ۲ حقوقی",
        "enum": [
          "1",
          "2"
        ]
      },
      {
        "name": "receiverNationalId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "کد ملی دریافت‌کننده"
      },
      {
        "name": "receiverMobile",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "receiverMobile"
      },
      {
        "name": "paymentPlace",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "paymentPlace"
      },
      {
        "name": "amount",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "مبلغ"
      },
      {
        "name": "duDate",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "duDate"
      },
      {
        "name": "description",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "description"
      },
      {
        "name": "transferable",
        "in": "body",
        "required": false,
        "kind": "boolean",
        "label": "transferable"
      },
      {
        "name": "issuerBirthDate",
        "in": "body",
        "required": true,
        "kind": "birthDate",
        "label": "تاریخ تولد صادرکننده شمسی YYYY/MM/DD"
      },
      {
        "name": "receiverBirthDate",
        "in": "body",
        "required": false,
        "kind": "birthDate",
        "label": "تاریخ تولد دریافت‌کننده شمسی YYYY/MM/DD"
      },
      {
        "name": "webhookUrl",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "آدرس HTTPS اعلان نهایی‌شدن"
      }
    ],
    "responseFields": []
  },
  {
    "id": "promissory-publish-request-inquiry-post",
    "operationId": "promissoryPublishRequestInquiryPost",
    "title": "استعلام درخواست صدور سفته",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:publish-request-inquiry:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissoryPublishRequestInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      }
    ],
    "responseFields": []
  },
  {
    "id": "promissory-sign-otp-request-post",
    "operationId": "promissorySignOtpRequestPost",
    "title": "درخواست کد یکبارمصرف امضای سفته",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:sign-otp-request:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissorySign/otpRequest",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "شناسه سفته صادرشده"
      },
      {
        "name": "signerNationalId",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "signerNationalId"
      },
      {
        "name": "mobile",
        "in": "body",
        "required": true,
        "kind": "mobile",
        "label": "شماره موبایل"
      },
      {
        "name": "provider",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "همان provider ثبت‌نام گواهی",
        "enum": [
          "emzasan",
          "sepidar",
          "pki"
        ]
      },
      {
        "name": "otpAutofillHost",
        "in": "body",
        "required": false,
        "kind": "otp",
        "label": "otpAutofillHost",
        "placeholder": "sign.bank.example"
      }
    ],
    "responseFields": [
      {
        "key": "challengeId",
        "label": "challengeId"
      },
      {
        "key": "expiresIn",
        "label": "expiresIn"
      },
      {
        "key": "providerCode",
        "label": "providerCode"
      }
    ]
  },
  {
    "id": "promissory-sign-post",
    "operationId": "promissorySignPost",
    "title": "امضای سفته الکترونیکی",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:sign:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissorySign",
    "flow": "upload",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      },
      {
        "name": "signerNationalId",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "برای توکن Client Credential لازم است"
      },
      {
        "name": "pin",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "pin"
      },
      {
        "name": "otp",
        "in": "body",
        "required": true,
        "kind": "otp",
        "label": "کد تایید"
      },
      {
        "name": "challengeId",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "challengeId"
      },
      {
        "name": "provider",
        "in": "body",
        "required": true,
        "kind": "select",
        "label": "همان provider ثبت‌نام گواهی. سفته این فیلد را لازم دارد.",
        "enum": [
          "emzasan",
          "sepidar",
          "pki"
        ]
      },
      {
        "name": "signature",
        "in": "body",
        "required": true,
        "kind": "file",
        "label": "تصویر مهر. فقط fileData."
      }
    ],
    "responseFields": []
  },
  {
    "id": "promissory-sign-status-post",
    "operationId": "promissorySignStatusPost",
    "title": "استعلام وضعیت امضای سفته",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:sign-status:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissorySignStatus",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      }
    ],
    "responseFields": []
  },
  {
    "id": "promissory-payment-post",
    "operationId": "promissoryPaymentPost",
    "title": "ایجاد پرداخت سفته",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:payment:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissoryPayment",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      },
      {
        "name": "redirectUrl",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "آدرس HTTPS بازگشت مرورگر"
      },
      {
        "name": "webhookUrl",
        "in": "body",
        "required": false,
        "kind": "text",
        "label": "آدرس HTTPS اعلان سرور به سرور مشتری"
      }
    ],
    "responseFields": []
  },
  {
    "id": "promissory-payment-inquiry-post",
    "operationId": "promissoryPaymentInquiryPost",
    "title": "استعلام پرداخت سفته",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:payment-inquiry:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissoryPaymentInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      }
    ],
    "responseFields": [
      {
        "key": "registrationId",
        "label": "registrationId"
      },
      {
        "key": "promissoryId",
        "label": "promissoryId"
      },
      {
        "key": "amount",
        "label": "مبلغ"
      },
      {
        "key": "paid",
        "label": "paid"
      },
      {
        "key": "finalized",
        "label": "finalized"
      },
      {
        "key": "message",
        "label": "متن پیامک"
      }
    ]
  },
  {
    "id": "promissory-finalize-post",
    "operationId": "promissoryFinalizePost",
    "title": "نهایی‌سازی سفته امضاشده",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:finalize:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissoryFinalize",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      },
      {
        "name": "promissoryType",
        "in": "body",
        "required": false,
        "kind": "select",
        "label": "۱ صدور، ۲ ضمانت، ۳ ظهرنویسی، ۴ تسویه تدریجی، ۵ تسویه",
        "enum": [
          "1",
          "2",
          "3",
          "4",
          "5"
        ]
      }
    ],
    "responseFields": []
  },
  {
    "id": "promissory-inquiry-post",
    "operationId": "promissoryInquiryPost",
    "title": "استعلام سفته الکترونیکی",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:inquiry:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissoryInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      }
    ],
    "responseFields": []
  },
  {
    "id": "promissory-finalize-inquiry-post",
    "operationId": "promissoryFinalizeInquiryPost",
    "title": "استعلام نهایی‌سازی سفته",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:finalize-inquiry:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/finalizeInquiry",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      }
    ],
    "responseFields": [
      {
        "key": "promissoryId",
        "label": "promissoryId"
      },
      {
        "key": "multiSignedPdf",
        "label": "multiSignedPdf"
      }
    ]
  },
  {
    "id": "promissory-delete-post",
    "operationId": "promissoryDeletePost",
    "title": "حذف درخواست باز سفته",
    "category": "promissory",
    "icon": "letter",
    "grantType": "client_credentials",
    "scope": "promissory:delete:post",
    "method": "POST",
    "path": "/promissory/v2/clients/{clientId}/promissoryDelete",
    "flow": "generic",
    "fields": [
      {
        "name": "registrationId",
        "in": "body",
        "required": true,
        "kind": "text",
        "label": "registrationId"
      }
    ],
    "responseFields": [
      {
        "key": "message",
        "label": "متن پیامک"
      }
    ]
  }
];

export function getServiceById(id: string): FinnotechService | undefined {
  return finnotechServices.find((s) => s.id === id || s.operationId === id);
}

export function getServicesByCategory(categoryId: string): FinnotechService[] {
  return finnotechServices.filter((s) => s.category === categoryId);
}
