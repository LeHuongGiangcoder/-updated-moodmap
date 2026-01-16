// =====================================================================================
// GOOGLE APPS SCRIPT CODE
// Copy and paste this code into your Google Apps Script project.
// Extensions > Apps Script in your Google Sheet.
// =====================================================================================

const LIBRARY_SHEET_NAME = "Library";
const TRIP_SHEET_NAME = "Trip";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // Fallback to "Sheet1" if "Library" doesn't exist, for backward compatibility or initial setup
    let librarySheet = ss.getSheetByName(LIBRARY_SHEET_NAME);
    if (!librarySheet) librarySheet = ss.getSheetByName("Sheet1");
    
    let tripSheet = ss.getSheetByName(TRIP_SHEET_NAME);
    
    const params = e.parameter;
    const action = params.action;
    
    let result = {};

    if (action === "read") {
      const id = params.id;
      if (id) {
        // Fetch specific trip details (Library + Trip entries)
        result = readTripDetails(librarySheet, tripSheet, id);
      } else {
        // Fetch all trips (Library only)
        result = readData(librarySheet);
      }
    } else if (action === "create") {
      const data = JSON.parse(e.postData.contents);
      const type = params.type; // 'trip' (default) or 'entry'
      
      if (type === 'entry') {
        if (!tripSheet) {
             // Create Trip sheet if it doesn't exist
             tripSheet = ss.insertSheet(TRIP_SHEET_NAME);
             tripSheet.appendRow(["id", "city", "date", "content", "createdAt", "updatedAt"]);
        }
        result = createData(tripSheet, data);
      } else {
        result = createData(librarySheet, data);
      }
    } else if (action === "update") {
      const data = JSON.parse(e.postData.contents);
      result = updateData(librarySheet, data);
    } else if (action === "delete") {
      const id = params.id;
      result = deleteTrip(librarySheet, tripSheet, id);
    } else {
      result = { error: "Invalid action" };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// -------------------------------------------------------------------------
// CRUD Functions
// -------------------------------------------------------------------------

function readData(sheet) {
  if (!sheet) return { status: "error", message: "Library sheet not found" };
  const rows = sheet.getDataRange().getValues();
  if (rows.length === 0) return { status: "success", data: [] };

  const headers = rows[0];
  const data = rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return { status: "success", data: data };
}

function readTripDetails(librarySheet, tripSheet, id) {
  if (!librarySheet) return { status: "error", message: "Library sheet not found" };
  
  // 1. Get Library Data
  const libRows = librarySheet.getDataRange().getValues();
  const libHeaders = libRows[0];
  const idIndex = libHeaders.indexOf("id");
  
  if (idIndex === -1) return { status: "error", message: "id column not found in Library" };
  
  let tripData = null;
  for (let i = 1; i < libRows.length; i++) {
    if (libRows[i][idIndex] == id) {
      tripData = {};
      libHeaders.forEach((header, index) => {
        tripData[header] = libRows[i][index];
      });
      break;
    }
  }
  
  if (!tripData) return { status: "error", message: "Trip not found" };
  
  // 2. Get Trip Entries
  let entries = [];
  if (tripSheet) {
    const tripRows = tripSheet.getDataRange().getValues();
    if (tripRows.length > 0) {
      const tripHeaders = tripRows[0];
      const tripIdIndex = tripHeaders.indexOf("id"); // Foreign Key
      
      if (tripIdIndex !== -1) {
        for (let i = 1; i < tripRows.length; i++) {
          if (tripRows[i][tripIdIndex] == id) {
            let entry = {};
            tripHeaders.forEach((header, index) => {
              // We include 'id' (the FK) or exclude it? 
              // Usually redundant but harmless. Let's keep it or exclude it?
              // Excluding it keeps the object cleaner.
              if (header !== "id") { 
                 entry[header] = tripRows[i][index];
              }
            });
            entries.push(entry);
          }
        }
      }
    }
  }
  
  tripData.entries = entries;
  // Return as single object in 'data' field to be distinct from array list
  return { status: "success", data: tripData }; 
}

function createData(sheet, data) {
  if (!sheet) return { status: "error", message: "Sheet not found" };
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = [];
  
  // Generate a unique ID if not provided
  const id = data.id || Utilities.getUuid();
  const timestamp = new Date();

  headers.forEach(header => {
    if (header === "id") {
      newRow.push(id);
    } else if (header === "Timestamp" || header === "createdAt") {
      newRow.push(timestamp);
    } else if (header === "updatedAt") {
      newRow.push(timestamp);
    } else {
      newRow.push(data[header] || "");
    }
  });

  sheet.appendRow(newRow);
  return { status: "success", message: "Trip created", id: id };
}

function updateData(sheet, data) {
  if (!sheet) return { status: "error", message: "Sheet not found" };
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf("id");
  
  if (idIndex === -1) throw new Error("Column 'id' not found in sheet");

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] == data.id) {
      const rowIndex = i + 1; // 1-based index
      
      headers.forEach((header, colIndex) => {
        if (header !== "id" && header !== "Timestamp" && header !== "createdAt" && data[header] !== undefined) {
          sheet.getRange(rowIndex, colIndex + 1).setValue(data[header]);
        }
        if (header === "updatedAt") {
           sheet.getRange(rowIndex, colIndex + 1).setValue(new Date());
        }
      });
      
      return { status: "success", message: "Trip updated" };
    }
  }
  return { status: "error", message: "ID not found" };
}

function deleteTrip(librarySheet, tripSheet, id) {
  if (!librarySheet) return { status: "error", message: "Library sheet not found" };
  
  let deleted = false;
  
  // 1. Delete from Library
  const libRows = librarySheet.getDataRange().getValues();
  const libHeaders = libRows[0];
  const libIdIndex = libHeaders.indexOf("id");
  
  if (libIdIndex !== -1) {
    for (let i = libRows.length - 1; i >= 1; i--) { // Loop backwards
      if (libRows[i][libIdIndex] == id) {
        librarySheet.deleteRow(i + 1);
        deleted = true;
        break; 
      }
    }
  }
  
  // 2. Delete from Trip (Cascade delete)
  if (tripSheet) {
    const tripRows = tripSheet.getDataRange().getValues();
    if (tripRows.length > 0) {
      const tripHeaders = tripRows[0];
      const tripIdIndex = tripHeaders.indexOf("tripId");
      
      if (tripIdIndex !== -1) {
        for (let i = tripRows.length - 1; i >= 1; i--) {
          if (tripRows[i][tripIdIndex] == id) {
            tripSheet.deleteRow(i + 1);
          }
        }
      }
    }
  }
  
  if (deleted) {
    return { status: "success", message: "Trip and associated entries deleted" };
  } else {
    return { status: "error", message: "Trip ID not found in Library" };
  }
}
