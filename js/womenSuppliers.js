// ===== womenSuppliers.js =====
// صفحة موردين النسائي مبنية من ملف موردين النسائي 2026.xlsx

const WOMEN_SUPPLIERS = [
  {
    "serial": 5,
    "name": "مؤسسة الشريعة و الحياة عبدالكريم",
    "branchM": 59350,
    "branchH": 118000,
    "total": 177350,
    "priority": 1,
    "status": "أولوية",
    "rawStatus": "1",
    "monthlySuggested": 10000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 1,
    "name": "شركة درة النسيج و ديع",
    "branchM": 262272,
    "branchH": 37950,
    "total": 300222,
    "priority": 2,
    "status": "أولوية",
    "rawStatus": "2",
    "monthlySuggested": 10000,
    "planM": "كل شهر دفعه 4000",
    "planH": ""
  },
  {
    "serial": 28,
    "name": "مشغل جابر علي",
    "branchM": 28150,
    "branchH": 29000,
    "total": 57150,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 1000",
    "planH": ""
  },
  {
    "serial": 9,
    "name": "مؤسسة المدى المحدودة - معمر",
    "branchM": 28500,
    "branchH": 28000,
    "total": 56500,
    "priority": 3,
    "status": "أولوية",
    "rawStatus": "3",
    "monthlySuggested": 5000,
    "planM": "كل شهر دفعه 1000",
    "planH": ""
  },
  {
    "serial": 26,
    "name": "مشغل أمير حمزة",
    "branchM": 19330,
    "branchH": 16900,
    "total": 36230,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 400",
    "planH": ""
  },
  {
    "serial": 58,
    "name": "مشغل الصبحي راشد",
    "branchM": 34685,
    "branchH": 0,
    "total": 34685,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 2000",
    "planH": ""
  },
  {
    "serial": 86,
    "name": "مايك - التل البوشية",
    "branchM": 34616,
    "branchH": 0,
    "total": 34616,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 1000",
    "planH": ""
  },
  {
    "serial": 2,
    "name": "مؤسسة يوسف البارقي",
    "branchM": 11000,
    "branchH": 21000,
    "total": 32000,
    "priority": 4,
    "status": "أولوية",
    "rawStatus": "4",
    "monthlySuggested": 3000,
    "planM": "كل شهر دفعه 2000",
    "planH": ""
  },
  {
    "serial": 3,
    "name": "مؤسسة أمان أمنه -عمران",
    "branchM": 31400,
    "branchH": 0,
    "total": 31400,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 2000",
    "planH": ""
  },
  {
    "serial": 80,
    "name": "شركة نواف الذهبية - سلفة خليل",
    "branchM": 29555,
    "branchH": 0,
    "total": 29555,
    "priority": null,
    "status": "حذف",
    "rawStatus": "حذف",
    "monthlySuggested": 0,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 10,
    "name": "شركة لمسات الهدى - عبدالباسط",
    "branchM": 9585,
    "branchH": 18150,
    "total": 27735,
    "priority": null,
    "status": "حذف",
    "rawStatus": "حذف",
    "monthlySuggested": 0,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 32,
    "name": "مشغل أول حسين",
    "branchM": 17620,
    "branchH": 9300,
    "total": 26920,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 7,
    "name": "مؤسسة منى اليامي - امتياز",
    "branchM": 7800,
    "branchH": 15000,
    "total": 22800,
    "priority": 5,
    "status": "أولوية",
    "rawStatus": "5",
    "monthlySuggested": 3000,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 31,
    "name": "مشغل عبدالستار",
    "branchM": 19180,
    "branchH": 3480,
    "total": 22660,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 18,
    "name": "مؤسسة بصمة وفاء",
    "branchM": 0,
    "branchH": 21476,
    "total": 21476,
    "priority": 6,
    "status": "أولوية",
    "rawStatus": "6",
    "monthlySuggested": 3000,
    "planM": "",
    "planH": ""
  },
  {
    "serial": 85,
    "name": "مغسلة المشغل",
    "branchM": 5370,
    "branchH": 16000,
    "total": 21370,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 77,
    "name": "فنون الموضه",
    "branchM": 19350,
    "branchH": 0,
    "total": 19350,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 1000",
    "planH": ""
  },
  {
    "serial": 65,
    "name": "مشغل أبو أنس",
    "branchM": 10980,
    "branchH": 7900,
    "total": 18880,
    "priority": 7,
    "status": "أولوية",
    "rawStatus": "7",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 56,
    "name": "مشغل منير للخياطة",
    "branchM": 16630,
    "branchH": 4000,
    "total": 20630,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 800",
    "planH": ""
  },
  {
    "serial": 34,
    "name": "مشغل وجه القمر - وادي الدواسر",
    "branchM": 15168,
    "branchH": 0,
    "total": 15168,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 53,
    "name": "مشغل فن سهرتي - غلام",
    "branchM": 9660,
    "branchH": 5400,
    "total": 15060,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 24,
    "name": "مشغل عناية",
    "branchM": 12600,
    "branchH": 2400,
    "total": 15000,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": 52,
    "name": "مشغل خورشيد",
    "branchM": 15000,
    "branchH": 0,
    "total": 15000,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 71,
    "name": "مشغل مغسلة أنعام",
    "branchM": 0,
    "branchH": 14500,
    "total": 14500,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "",
    "planH": ""
  },
  {
    "serial": 49,
    "name": "مشغل صميم ميه",
    "branchM": 10890,
    "branchH": 3100,
    "total": 13990,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 6,
    "name": "جوهرة التوفير - عبدالاله",
    "branchM": 6010,
    "branchH": 7360,
    "total": 13370,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 8,
    "name": "منير المهري - سوق القدس",
    "branchM": 12570,
    "branchH": 0,
    "total": 12570,
    "priority": 8,
    "status": "أولوية",
    "rawStatus": "8",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 1400",
    "planH": ""
  },
  {
    "serial": 59,
    "name": "مشغل أبو عرفات",
    "branchM": 4520,
    "branchH": 9000,
    "total": 13520,
    "priority": 9,
    "status": "أولوية",
    "rawStatus": "9",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 39,
    "name": "مشغل ليتون",
    "branchM": 4500,
    "branchH": 7090,
    "total": 11590,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1500,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": 73,
    "name": "مشغل عبدالرزاق",
    "branchM": 7600,
    "branchH": 3400,
    "total": 11000,
    "priority": 10,
    "status": "أولوية",
    "rawStatus": "10",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 51,
    "name": "مشغل مصطفى",
    "branchM": 4830,
    "branchH": 4665,
    "total": 9495,
    "priority": 11,
    "status": "أولوية",
    "rawStatus": "11",
    "monthlySuggested": 2000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 12,
    "name": "المشيطي",
    "branchM": 9123,
    "branchH": 0,
    "total": 9123,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "حسب شراءه",
    "planH": ""
  },
  {
    "serial": 41,
    "name": "مشغل عبدالجليل",
    "branchM": 8880,
    "branchH": 0,
    "total": 8880,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 37,
    "name": "مشغل أم ناصر الباكستانية",
    "branchM": 3600,
    "branchH": 4500,
    "total": 8100,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 11,
    "name": "مؤسسة نصف القمر- عبدالله جده",
    "branchM": 7660,
    "branchH": 0,
    "total": 7660,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 1500",
    "planH": ""
  },
  {
    "serial": 43,
    "name": "مشغل تويل - أبو خالد",
    "branchM": 7041,
    "branchH": 0,
    "total": 7041,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 70,
    "name": "مشغل عيسى الخياط",
    "branchM": 0,
    "branchH": 7000,
    "total": 7000,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "",
    "planH": ""
  },
  {
    "serial": 30,
    "name": "مشغل مختار",
    "branchM": 6750,
    "branchH": 0,
    "total": 6750,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": 79,
    "name": "معرض الكلف - باغازي - جده",
    "branchM": 6629,
    "branchH": 0,
    "total": 6629,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 64,
    "name": "مشغل ريس أحمد",
    "branchM": 900,
    "branchH": 5700,
    "total": 6600,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": 66,
    "name": "مشغل عبدالقيوم",
    "branchM": 6400,
    "branchH": 0,
    "total": 6400,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 13,
    "name": "ريتاج",
    "branchM": 6335,
    "branchH": 0,
    "total": 6335,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 400",
    "planH": ""
  },
  {
    "serial": 29,
    "name": "مشغل جابر علي - الجديد",
    "branchM": 6155,
    "branchH": 0,
    "total": 6155,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 63,
    "name": "مشغل أبو الهنا",
    "branchM": 1200,
    "branchH": 3500,
    "total": 4700,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 44,
    "name": "مشغل جمال",
    "branchM": 4625,
    "branchH": 0,
    "total": 4625,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 45,
    "name": "مشغل محمد علي",
    "branchM": 2000,
    "branchH": 2600,
    "total": 4600,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 84,
    "name": "عثمان - هامات",
    "branchM": 4470,
    "branchH": 0,
    "total": 4470,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 27,
    "name": "مشغل أمير حمزة - الجديد",
    "branchM": 2340,
    "branchH": 1900,
    "total": 4240,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 74,
    "name": "مشغل بشير",
    "branchM": 0,
    "branchH": 4180,
    "total": 4180,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "",
    "planH": ""
  },
  {
    "serial": 17,
    "name": "الشاطر للأقمشة",
    "branchM": 0,
    "branchH": 4000,
    "total": 4000,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "",
    "planH": ""
  },
  {
    "serial": 72,
    "name": "مشغل سليم شلحة",
    "branchM": 0,
    "branchH": 3900,
    "total": 3900,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "",
    "planH": ""
  },
  {
    "serial": 4,
    "name": "بامخش - جده",
    "branchM": 3860,
    "branchH": 0,
    "total": 3860,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 500",
    "planH": ""
  },
  {
    "serial": 25,
    "name": "مشغل عناية - جديد",
    "branchM": 3615,
    "branchH": 0,
    "total": 3615,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 57,
    "name": "مشغل معصوم",
    "branchM": 3430,
    "branchH": 0,
    "total": 3430,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": 35,
    "name": "مشغل شهيد الإسلام",
    "branchM": 3145,
    "branchH": 0,
    "total": 3145,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 16,
    "name": "شركة سيزار المحدودة",
    "branchM": 3000,
    "branchH": 0,
    "total": 3000,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "واجب السداد",
    "planH": ""
  },
  {
    "serial": 30,
    "name": "مشغل مختار - الجديد",
    "branchM": 2990,
    "branchH": 0,
    "total": 2990,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 47,
    "name": "مشغل ميراج",
    "branchM": 2800,
    "branchH": 0,
    "total": 2800,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 40,
    "name": "مشغل ريبون - عبايات",
    "branchM": 2635,
    "branchH": 0,
    "total": 2635,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "مسافر لم يتواصل معنا",
    "planH": ""
  },
  {
    "serial": 54,
    "name": "مشغل أخو خورشيد",
    "branchM": 2500,
    "branchH": 0,
    "total": 2500,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 14,
    "name": "شركة نسائم الشرق - الأبي",
    "branchM": 2485,
    "branchH": 0,
    "total": 2485,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 74,
    "name": "عدة مشاغل",
    "branchM": 0,
    "branchH": 2200,
    "total": 2200,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "",
    "planH": ""
  },
  {
    "serial": 36,
    "name": "مشغل شهيد الإسلام - الجديد",
    "branchM": 1000,
    "branchH": 1100,
    "total": 2100,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 69,
    "name": "مشغل أمين",
    "branchM": 0,
    "branchH": 2000,
    "total": 2000,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "",
    "planH": ""
  },
  {
    "serial": 61,
    "name": "مشغل إسلام",
    "branchM": 1870,
    "branchH": 0,
    "total": 1870,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 23,
    "name": "مشغل سلطان",
    "branchM": 1820,
    "branchH": 0,
    "total": 1820,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": 46,
    "name": "مشغل معرض الحجاز",
    "branchM": 1800,
    "branchH": 0,
    "total": 1800,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 62,
    "name": "مشغل طاهر",
    "branchM": 1710,
    "branchH": 0,
    "total": 1710,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 74,
    "name": "مشغل أوجل",
    "branchM": 1550,
    "branchH": 0,
    "total": 1550,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 48,
    "name": "مشغل ريبون - خالد العامر",
    "branchM": 1530,
    "branchH": 0,
    "total": 1530,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": 78,
    "name": "الوديان",
    "branchM": 1500,
    "branchH": 0,
    "total": 1500,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 68,
    "name": "مشغل معصود",
    "branchM": 1460,
    "branchH": 0,
    "total": 1460,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 50,
    "name": "مشغل شويل",
    "branchM": 1435,
    "branchH": 0,
    "total": 1435,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 42,
    "name": "مشغل صدام",
    "branchM": 1400,
    "branchH": 0,
    "total": 1400,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": null,
    "name": "مشغل عبدالجليل - الجديد",
    "branchM": 1250,
    "branchH": 0,
    "total": 1250,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 82,
    "name": "عبدالرزاق - كلف",
    "branchM": 1240,
    "branchH": 0,
    "total": 1240,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 300",
    "planH": ""
  },
  {
    "serial": 83,
    "name": "عباس - هامات",
    "branchM": 1220,
    "branchH": 0,
    "total": 1220,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "كل شهر دفعه 100",
    "planH": ""
  },
  {
    "serial": 33,
    "name": "مشغل أول حسين - الجديد",
    "branchM": 480,
    "branchH": 700,
    "total": 1180,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 1000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 22,
    "name": "مشغل وليد",
    "branchM": 930,
    "branchH": 0,
    "total": 930,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 0,
    "planM": "كل شهر دفعه 200",
    "planH": ""
  },
  {
    "serial": 81,
    "name": "مؤسسة صالح البديوي",
    "branchM": 750,
    "branchH": 0,
    "total": 750,
    "priority": null,
    "status": "سداد فقط",
    "rawStatus": "سداد فقط",
    "monthlySuggested": 1000,
    "planM": "لم يطلبها",
    "planH": ""
  },
  {
    "serial": 38,
    "name": "مشغل أم ناصر الباكستانية - الجديد",
    "branchM": 300,
    "branchH": 0,
    "total": 300,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 0,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 67,
    "name": "مشغل عبدالقيوم -الجديد",
    "branchM": 300,
    "branchH": 0,
    "total": 300,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 0,
    "planM": "يتم التصفية",
    "planH": ""
  },
  {
    "serial": 19,
    "name": "مشغل عبدالستار الجديد",
    "branchM": 3700,
    "branchH": 0,
    "total": 3700,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 2000,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 20,
    "name": "مشغل جابر علي - الجديد",
    "branchM": 270,
    "branchH": 0,
    "total": 270,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 0,
    "planM": "حساب جاري",
    "planH": ""
  },
  {
    "serial": 74,
    "name": "مشغل هارون",
    "branchM": 0,
    "branchH": 4800,
    "total": 4800,
    "priority": null,
    "status": "جاري",
    "rawStatus": "جاري",
    "monthlySuggested": 2000,
    "planM": "",
    "planH": ""
  }
];

const ACTIVE_WOMEN_SUPPLIERS = WOMEN_SUPPLIERS.filter(item => item.status !== 'حذف');

let womenSuppliersState = { branch: 'all', status: 'all', search: '' };
let womenDebtPlanState = {
  scope: 'all',
  statuses: { priority: true, current: true, payment: true, other: false },
  payments: {}
};
let womenSuppliersCharts = { top: null, distribution: null, plan: null };

function womenFmt(value) {
  return Math.round(Number(value) || 0).toLocaleString('en-US');
}

function womenStatusLabel(item) {
  if (item.priority) return 'أولوية ' + item.priority;
  return item.status || 'غير مصنف';
}

function womenStatusClass(item) {
  if (item.priority) return 'priority';
  if (item.status === 'جاري') return 'current';
  if (item.status === 'سداد فقط') return 'payment';
  return 'other';
}

function womenPlanText(item) {
  const plans = [item.planM, item.planH].filter(Boolean);
  if (!plans.length) return item.monthlySuggested ? 'دفعة مقترحة ' + womenFmt(item.monthlySuggested) + ' ر' : 'بدون خطة واضحة';
  return plans.join(' / ');
}

function womenBranchMatches(item, branch) {
  if (branch === 'all') return true;
  if (branch === 'm') return item.branchM > 0;
  if (branch === 'h') return item.branchH > 0;
  if (branch === 'both') return item.branchM > 0 && item.branchH > 0;
  return true;
}

function womenStatusMatches(item, status) {
  if (status === 'all') return true;
  if (status === 'priority') return !!item.priority;
  if (status === 'current') return item.status === 'جاري';
  if (status === 'payment') return item.status === 'سداد فقط';
  if (status === 'no-plan') return !item.priority && !item.monthlySuggested && womenPlanText(item) === 'بدون خطة واضحة';
  return true;
}

function getFilteredWomenSuppliers() {
  const query = womenSuppliersState.search.trim().toLowerCase();
  return ACTIVE_WOMEN_SUPPLIERS.filter(item => {
    const searchMatch = !query || item.name.toLowerCase().includes(query) || womenStatusLabel(item).toLowerCase().includes(query) || womenPlanText(item).toLowerCase().includes(query);
    return searchMatch && womenBranchMatches(item, womenSuppliersState.branch) && womenStatusMatches(item, womenSuppliersState.status);
  }).sort((a, b) => {
    if (!!a.priority !== !!b.priority) return a.priority ? -1 : 1;
    if (a.priority && b.priority) return a.priority - b.priority;
    return b.total - a.total;
  });
}

function womenSupplierSummary(rows = ACTIVE_WOMEN_SUPPLIERS) {
  const total = rows.reduce((sum, item) => sum + item.total, 0);
  const branchM = rows.reduce((sum, item) => sum + item.branchM, 0);
  const branchH = rows.reduce((sum, item) => sum + item.branchH, 0);
  const monthly = rows.reduce((sum, item) => sum + item.monthlySuggested, 0);
  const priorityRows = rows.filter(item => item.priority);
  const top5 = ACTIVE_WOMEN_SUPPLIERS.slice().sort((a, b) => b.total - a.total).slice(0, 5);
  const top5Total = top5.reduce((sum, item) => sum + item.total, 0);
  return { total, branchM, branchH, monthly, priorityRows, top5, top5Total };
}

function womenSupplierBucket(item) {
  if (item.priority) return 'priority';
  if (item.status === 'جاري') return 'current';
  if (item.status === 'سداد فقط') return 'payment';
  return 'other';
}

function womenBucketLabel(bucket) {
  return {
    priority: 'أولوية',
    current: 'جاري',
    payment: 'سداد فقط',
    other: 'غير مصنف'
  }[bucket] || bucket;
}

function womenScopedDebt(item, scope = 'all') {
  if (scope === 'm') return item.branchM || 0;
  if (scope === 'h') return item.branchH || 0;
  return item.total || 0;
}

function womenDefaultPayment(item, scope = 'all') {
  if (!item.monthlySuggested) return 0;
  if (scope === 'all' || !item.total) return item.monthlySuggested;
  return item.monthlySuggested * (womenScopedDebt(item, scope) / item.total);
}

function getWomenDebtPlanRows() {
  const buckets = ['priority', 'current', 'payment', 'other'].map(bucket => ({
    bucket,
    label: womenBucketLabel(bucket),
    suppliers: 0,
    debt: 0,
    suggested: 0,
    planned: 0
  }));
  const byBucket = Object.fromEntries(buckets.map(row => [row.bucket, row]));
  ACTIVE_WOMEN_SUPPLIERS.forEach(item => {
    const bucket = womenSupplierBucket(item);
    const debt = womenScopedDebt(item, womenDebtPlanState.scope);
    if (!debt) return;
    byBucket[bucket].suppliers += 1;
    byBucket[bucket].debt += debt;
    byBucket[bucket].suggested += womenDefaultPayment(item, womenDebtPlanState.scope);
  });
  buckets.forEach(row => {
    const key = `${womenDebtPlanState.scope}:${row.bucket}`;
    row.planned = womenDebtPlanState.payments[key] ?? Math.round(row.suggested);
  });
  return buckets.filter(row => row.debt > 0);
}

function getSelectedWomenDebtPlanRows() {
  return getWomenDebtPlanRows().filter(row => womenDebtPlanState.statuses[row.bucket]);
}

function renderWomenSuppliersPage() {
  const tab = document.getElementById('tab-women-suppliers');
  if (!tab) return;
  const summary = womenSupplierSummary();
  const topSupplier = ACTIVE_WOMEN_SUPPLIERS.slice().sort((a, b) => b.total - a.total)[0];
  tab.innerHTML = `
    <section class="women-suppliers-page">
      <div class="women-header">
        <div>
          <h2>موردين النسائي</h2>
          <p>الأرصدة حتى 23/05/2026 حسب ملف موردين النسائي 2026.</p>
        </div>
        <div class="women-header-badge">${ACTIVE_WOMEN_SUPPLIERS.length} مورد</div>
      </div>

      <div class="women-kpi-grid">
        <div class="women-kpi danger"><span>إجمالي الأرصدة</span><strong>${womenFmt(summary.total)} ر</strong><small>كل الموردين</small></div>
        <div class="women-kpi blue"><span>فرع محمد</span><strong>${womenFmt(summary.branchM)} ر</strong><small>${((summary.branchM / summary.total) * 100).toFixed(1)}% من الإجمالي</small></div>
        <div class="women-kpi cyan"><span>فرع هاني</span><strong>${womenFmt(summary.branchH)} ر</strong><small>${((summary.branchH / summary.total) * 100).toFixed(1)}% من الإجمالي</small></div>
        <div class="women-kpi green"><span>دفعات شهرية مقترحة</span><strong>${womenFmt(summary.monthly)} ر</strong><small>يمكن تعديلها في خطة السداد</small></div>
        <div class="women-kpi purple"><span>موردين أولوية</span><strong>${summary.priorityRows.length}</strong><small>مميزين من الملف</small></div>
        <div class="women-kpi amber"><span>أرصدة أعلى 5</span><strong>${womenFmt(summary.top5Total)} ر</strong><small>${((summary.top5Total / summary.total) * 100).toFixed(1)}% من الإجمالي</small></div>
      </div>

      <div class="women-insights-grid">
        <div class="women-panel">
          <h3>أعلى مورد</h3>
          <div class="women-big-value">${topSupplier.name}</div>
          <p>${womenFmt(topSupplier.total)} ر، يمثل ${((topSupplier.total / summary.total) * 100).toFixed(1)}% من إجمالي الأرصدة.</p>
        </div>
        <div class="women-panel">
          <h3>أهم 11 مورد</h3>
          <div class="women-big-value">${womenFmt(summary.priorityRows.reduce((sum, item) => sum + item.total, 0))} ر</div>
          <p>هذه المجموعة مميزة حسب تصنيفك في الملف، وتظهر أولاً في الجدول.</p>
        </div>
      </div>

      <div class="women-chart-grid">
        <div class="chart-card"><div class="chart-title">أعلى 10 موردين حسب الرصيد</div><canvas id="women-top-chart" height="210"></canvas></div>
        <div class="chart-card"><div class="chart-title">توزيع الأرصدة حسب الحالة</div><canvas id="women-status-chart" height="210"></canvas></div>
      </div>

      <div class="women-page-links">
        <a href="#women-debt-plan">الانتقال إلى خطة السداد</a>
      </div>

      <div class="women-controls">
        <input id="women-supplier-search" type="search" placeholder="بحث باسم المورد أو الخطة" oninput="setWomenSupplierSearch(this.value)">
        <div class="women-control-group">
          <button class="women-filter active" data-filter-type="branch" data-value="all" onclick="setWomenSupplierBranch('all')">كل الفروع</button>
          <button class="women-filter" data-filter-type="branch" data-value="m" onclick="setWomenSupplierBranch('m')">فرع محمد</button>
          <button class="women-filter" data-filter-type="branch" data-value="h" onclick="setWomenSupplierBranch('h')">فرع هاني</button>
          <button class="women-filter" data-filter-type="branch" data-value="both" onclick="setWomenSupplierBranch('both')">الفرعين</button>
        </div>
        <div class="women-control-group">
          <button class="women-filter active" data-filter-type="status" data-value="all" onclick="setWomenSupplierStatus('all')">كل الحالات</button>
          <button class="women-filter" data-filter-type="status" data-value="priority" onclick="setWomenSupplierStatus('priority')">أولوية</button>
          <button class="women-filter" data-filter-type="status" data-value="current" onclick="setWomenSupplierStatus('current')">جاري</button>
          <button class="women-filter" data-filter-type="status" data-value="payment" onclick="setWomenSupplierStatus('payment')">سداد فقط</button>
        </div>
      </div>

      <div class="table-card women-table-card">
        <h3>قائمة الموردين <span id="women-suppliers-count"></span></h3>
        <div style="overflow-x:auto">
          <table id="women-suppliers-table">
            <thead>
              <tr>
                <th>المورد</th>
                <th>الحالة</th>
                <th>فرع محمد</th>
                <th>فرع هاني</th>
                <th>الإجمالي</th>
                <th>دفعة مقترحة</th>
                <th>خطة السداد</th>
              </tr>
            </thead>
            <tbody id="women-suppliers-body"></tbody>
            <tfoot id="women-suppliers-foot"></tfoot>
          </table>
        </div>
      </div>

      <div class="women-debt-plan" id="women-debt-plan">
        <div class="women-plan-head">
          <div>
            <h3>خطة سداد الموردين</h3>
            <p>جرّب خطة السداد حسب الفرع والحالة. الأرقام هنا للتخطيط فقط ولا تغيّر بيانات الموردين الأصلية.</p>
          </div>
        </div>

        <div class="women-plan-controls">
          <div class="women-control-group">
            <button class="women-filter active" data-plan-scope="all" onclick="setWomenDebtPlanScope('all')">كل الفروع</button>
            <button class="women-filter" data-plan-scope="m" onclick="setWomenDebtPlanScope('m')">فرع محمد</button>
            <button class="women-filter" data-plan-scope="h" onclick="setWomenDebtPlanScope('h')">فرع هاني</button>
          </div>
          <label><input type="checkbox" checked onchange="setWomenDebtPlanStatus('priority', this.checked)"> أولوية</label>
          <label><input type="checkbox" checked onchange="setWomenDebtPlanStatus('current', this.checked)"> جاري</label>
          <label><input type="checkbox" checked onchange="setWomenDebtPlanStatus('payment', this.checked)"> سداد فقط</label>
          <label><input type="checkbox" onchange="setWomenDebtPlanStatus('other', this.checked)"> غير مصنف</label>
        </div>

        <div class="women-plan-summary">
          <div><span>الرصيد المختار</span><strong id="women-plan-selected-debt">—</strong></div>
          <div><span>السداد الشهري المخطط</span><strong id="women-plan-monthly">—</strong></div>
          <div><span>نسبة السداد شهرياً</span><strong id="women-plan-coverage">—</strong></div>
          <div><span>مدة السداد المتوقعة</span><strong id="women-plan-months">—</strong></div>
        </div>

        <div class="women-plan-grid">
          <div class="women-plan-table-wrap">
            <table id="women-plan-table">
              <thead>
                <tr>
                  <th>الحالة</th>
                  <th>عدد الموردين</th>
                  <th>الرصيد</th>
                  <th>المقترح من الملف</th>
                  <th>الخطة الشهرية</th>
                  <th>مدة السداد</th>
                </tr>
              </thead>
              <tbody id="women-plan-body"></tbody>
            </table>
          </div>
          <div class="chart-card"><div class="chart-title">توزيع خطة السداد الشهرية</div><canvas id="women-plan-chart" height="210"></canvas></div>
        </div>
      </div>
    </section>
  `;
  renderWomenSuppliersTable();
  renderWomenDebtPlan();
  renderWomenSuppliersCharts();
}

function renderWomenSuppliersTable() {
  const rows = getFilteredWomenSuppliers();
  const body = document.getElementById('women-suppliers-body');
  const foot = document.getElementById('women-suppliers-foot');
  const count = document.getElementById('women-suppliers-count');
  if (!body) return;
  if (count) count.textContent = '(' + rows.length + ' مورد)';
  body.innerHTML = rows.map(item => `
    <tr class="${item.priority ? 'women-priority-row' : ''}">
      <td><strong>${item.name}</strong>${item.priority ? '<small>مورد مهم رقم ' + item.priority + '</small>' : ''}</td>
      <td><span class="women-status ${womenStatusClass(item)}">${womenStatusLabel(item)}</span></td>
      <td>${item.branchM ? womenFmt(item.branchM) : '—'}</td>
      <td>${item.branchH ? womenFmt(item.branchH) : '—'}</td>
      <td class="women-total">${womenFmt(item.total)}</td>
      <td>${item.monthlySuggested ? womenFmt(item.monthlySuggested) : '—'}</td>
      <td class="women-plan">${womenPlanText(item)}</td>
    </tr>
  `).join('');
  if (foot) {
    const totalM = rows.reduce((sum, item) => sum + item.branchM, 0);
    const totalH = rows.reduce((sum, item) => sum + item.branchH, 0);
    const total = rows.reduce((sum, item) => sum + item.total, 0);
    const monthly = rows.reduce((sum, item) => sum + item.monthlySuggested, 0);
    foot.innerHTML = `
      <tr>
        <td colspan="2">الإجمالي</td>
        <td>${womenFmt(totalM)}</td>
        <td>${womenFmt(totalH)}</td>
        <td>${womenFmt(total)}</td>
        <td>${womenFmt(monthly)}</td>
        <td></td>
      </tr>
    `;
  }
}

function setWomenSupplierSearch(value) {
  womenSuppliersState.search = value || '';
  renderWomenSuppliersTable();
}

function setWomenSupplierBranch(branch) {
  womenSuppliersState.branch = branch;
  document.querySelectorAll('[data-filter-type="branch"]').forEach(btn => btn.classList.toggle('active', btn.dataset.value === branch));
  renderWomenSuppliersTable();
}

function setWomenSupplierStatus(status) {
  womenSuppliersState.status = status;
  document.querySelectorAll('[data-filter-type="status"]').forEach(btn => btn.classList.toggle('active', btn.dataset.value === status));
  renderWomenSuppliersTable();
}

function setWomenDebtPlanScope(scope) {
  womenDebtPlanState.scope = scope;
  document.querySelectorAll('[data-plan-scope]').forEach(btn => btn.classList.toggle('active', btn.dataset.planScope === scope));
  renderWomenDebtPlan();
}

function setWomenDebtPlanStatus(status, checked) {
  womenDebtPlanState.statuses[status] = checked;
  renderWomenDebtPlan();
}

function setWomenDebtPlanPayment(bucket, value) {
  const key = `${womenDebtPlanState.scope}:${bucket}`;
  womenDebtPlanState.payments[key] = Math.max(0, Number(value) || 0);
  renderWomenDebtPlan();
}

function renderWomenDebtPlan() {
  const body = document.getElementById('women-plan-body');
  if (!body) return;
  const rows = getWomenDebtPlanRows();
  const selectedRows = rows.filter(row => womenDebtPlanState.statuses[row.bucket]);
  const selectedDebt = selectedRows.reduce((sum, row) => sum + row.debt, 0);
  const selectedMonthly = selectedRows.reduce((sum, row) => sum + row.planned, 0);
  const coverage = selectedDebt ? (selectedMonthly / selectedDebt) * 100 : 0;
  const months = selectedMonthly ? Math.ceil(selectedDebt / selectedMonthly) : 0;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  setText('women-plan-selected-debt', `${womenFmt(selectedDebt)} ر`);
  setText('women-plan-monthly', `${womenFmt(selectedMonthly)} ر`);
  setText('women-plan-coverage', `${coverage.toFixed(1)}%`);
  setText('women-plan-months', months ? `${months} شهر` : '—');

  body.innerHTML = rows.map(row => {
    const rowMonths = row.planned ? Math.ceil(row.debt / row.planned) : 0;
    const disabled = womenDebtPlanState.statuses[row.bucket] ? '' : 'disabled';
    return `
      <tr class="${womenDebtPlanState.statuses[row.bucket] ? '' : 'women-plan-muted'}">
        <td><span class="women-status ${row.bucket === 'priority' ? 'priority' : row.bucket === 'current' ? 'current' : row.bucket === 'payment' ? 'payment' : 'other'}">${row.label}</span></td>
        <td>${row.suppliers}</td>
        <td class="women-total">${womenFmt(row.debt)}</td>
        <td>${womenFmt(row.suggested)}</td>
        <td><input ${disabled} class="women-plan-input" type="number" min="0" step="500" value="${Math.round(row.planned)}" onchange="setWomenDebtPlanPayment('${row.bucket}', this.value)"></td>
        <td>${rowMonths ? rowMonths + ' شهر' : '—'}</td>
      </tr>
    `;
  }).join('');

  renderWomenDebtPlanChart(selectedRows);
}

function renderWomenDebtPlanChart(rows) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('women-plan-chart');
  if (!canvas) return;
  if (womenSuppliersCharts.plan) womenSuppliersCharts.plan.destroy();
  womenSuppliersCharts.plan = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: rows.map(row => row.label),
      datasets: [
        { label: 'الرصيد', data: rows.map(row => row.debt), backgroundColor: '#E7E9EE', borderRadius: 5 },
        { label: 'السداد الشهري', data: rows.map(row => row.planned), backgroundColor: '#15803D', borderRadius: 5 }
      ]
    },
    options: {
      ...chartDefaults,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } } }
    }
  });
}

function renderWomenSuppliersCharts() {
  if (typeof Chart === 'undefined') return;
  const topCanvas = document.getElementById('women-top-chart');
  const statusCanvas = document.getElementById('women-status-chart');
  const topRows = ACTIVE_WOMEN_SUPPLIERS.slice().sort((a, b) => b.total - a.total).slice(0, 10);
  if (topCanvas) {
    if (womenSuppliersCharts.top) womenSuppliersCharts.top.destroy();
    womenSuppliersCharts.top = new Chart(topCanvas, {
      type: 'bar',
      data: {
        labels: topRows.map(item => item.name),
        datasets: [{ label: 'الرصيد', data: topRows.map(item => item.total), backgroundColor: topRows.map(item => item.priority ? '#7033FF' : '#4E7CFF'), borderRadius: 5 }]
      },
      options: { ...chartDefaults, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => (v / 1000).toFixed(0) + 'K' } }, y: { ticks: { font: { family: 'Segoe UI, Tahoma, Arial', size: 10 } } } } }
    });
  }
  if (statusCanvas) {
    if (womenSuppliersCharts.distribution) womenSuppliersCharts.distribution.destroy();
    const buckets = ACTIVE_WOMEN_SUPPLIERS.reduce((acc, item) => {
      const label = item.priority ? 'أولوية' : item.status;
      acc[label] = (acc[label] || 0) + item.total;
      return acc;
    }, {});
    const labels = Object.keys(buckets);
    womenSuppliersCharts.distribution = new Chart(statusCanvas, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: labels.map(label => buckets[label]), backgroundColor: ['#7033FF','#15803D','#7033FF','#B91C1C','#94A3B8'] }] },
      options: { locale: 'en-US', responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Segoe UI, Tahoma, Arial' } } } } }
    });
  }
}

document.addEventListener('DOMContentLoaded', renderWomenSuppliersPage);
