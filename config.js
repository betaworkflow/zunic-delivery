// ─────────────────────────────────────────────
//  Zunic Delivery System — Central Config
//  แก้ไขไฟล์นี้ที่เดียวเมื่อ URL เปลี่ยน
// ─────────────────────────────────────────────

const ZUNIC_CONFIG = {

  // GAS Backend URL (อย่าเปลี่ยนถ้าไม่จำเป็น)
  GAS_URL: 'https://script.google.com/macros/s/AKfycbzOktAmSwp0HJCPMcCxBB1HeAqdza6YI1OBkfcw4W5HL8cKAnn5VBWuaxf2QLM0nTmH/exec',

  // GitHub Pages Base URL
  BASE_URL: 'https://betaworkflow.github.io/zunic-delivery',

  // Version
  VERSION: 'v1.0.0',

  // คนขับ
  DRIVERS: {
    A: { name: 'คนขับ A', color: '#e74c3c' },
    B: { name: 'คนขับ B', color: '#2ecc71' },
    C: { name: 'คนขับ C', color: '#3498db' }
  },

  // QR Code URLs (คนขับสแกนเพื่อบันทึกน้ำมัน/ไมล์)
  QR: {
    fuel_A:    'https://betaworkflow.github.io/zunic-delivery/fuel.html?driver=A',
    fuel_B:    'https://betaworkflow.github.io/zunic-delivery/fuel.html?driver=B',
    fuel_C:    'https://betaworkflow.github.io/zunic-delivery/fuel.html?driver=C',
    mileage_A: 'https://betaworkflow.github.io/zunic-delivery/mileage.html?driver=A',
    mileage_B: 'https://betaworkflow.github.io/zunic-delivery/mileage.html?driver=B',
    mileage_C: 'https://betaworkflow.github.io/zunic-delivery/mileage.html?driver=C'
  }

};

// ─────────────────────────────────────────────
//  callGAS() — แทน google.script.run
//  ใช้แทนทุกหน้า
// ─────────────────────────────────────────────

function callGAS(action, params) {
  // GET request (ใช้กับ functions ที่ไม่แก้ข้อมูล)
  var GET_ACTIONS = [
    'getJobsToday', 'getConfirmedSchedule', 'getDashboardData',
    'lookupCustomer', 'validateCustomerCode', 'getScheduleByDate',
    'getConfirmedScheduleByDate', 'getDriverSheetData',
    'listDriveFiles', 'login'
  ];
var ALL_GET = GET_ACTIONS.concat(['saveFuel','saveMileage','saveJobs',
    'confirmSchedule','saveReturnResults','addSingleJob','deleteJob',
    'updateJobType','updateJobStatus','moveToPickup','addPickup',
    'markPickupDone','cancelPickupDone','restorePickupToDelivery',
    'syncJobToSchedule','addOrUpdateCustomer','clearDayData']);
  var isGet = ALL_GET.indexOf(action) !== -1;

  if (isGet) {
    var url = ZUNIC_CONFIG.GAS_URL + '?action=' + encodeURIComponent(action);
    if (params) {
      Object.keys(params).forEach(function(k) {
        url += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k] || '');
      });
    }
    return fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (res.ok) return res.data;
        throw new Error(res.error || 'GAS error');
      });
  }

  // POST request (ใช้กับ functions ที่แก้ข้อมูล)
  var body = Object.assign({ action: action }, params || {});
  return fetch(ZUNIC_CONFIG.GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (res.ok) return res.data;
      throw new Error(res.error || 'GAS error');
    });
}
