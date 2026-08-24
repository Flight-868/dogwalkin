/**
 * Dog Walkin.com — inquiry log
 * ----------------------------------------------------------------------
 * Appends every contact-form submission to a Google Sheet that David owns,
 * so there is a permanent record independent of email delivery and
 * independent of Web3Forms (whose free tier only keeps 30 days of history).
 *
 * Deploy instructions: docs/contact-form-setup.md
 *
 * Two entry points:
 *   doPost — called by the website on each submission
 *   doGet  — health check: open the /exec URL in a browser to see the
 *            total count and the timestamp of the most recent inquiry
 */

var SHEET_NAME = 'Inquiries';
var HEADERS = ['Received', 'Name', 'Email', 'Message', 'Source', 'Submitted (browser)'];

function doPost(e) {
  // Concurrent submissions would otherwise race on appendRow.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: 'busy' });
  }

  try {
    var data = parseBody_(e);
    getSheet_().appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.message || '',
      data.source || 'unknown',
      data.submittedAt || ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check for the monthly reconciliation. Returns how many inquiries
 * have been logged and when the last one arrived — if that date is old,
 * something upstream is broken.
 */
function doGet() {
  try {
    var sheet = getSheet_();
    var lastRow = sheet.getLastRow();
    var lastReceived = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() : null;
    return json_({
      ok: true,
      count: Math.max(0, lastRow - 1),
      lastReceived: lastReceived ? new Date(lastReceived).toISOString() : null
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** The site posts JSON as text/plain; fall back to form-encoded params. */
function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // fall through to e.parameter
    }
  }
  return (e && e.parameter) || {};
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setColumnWidth(4, 420);
  }
  return sheet;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
