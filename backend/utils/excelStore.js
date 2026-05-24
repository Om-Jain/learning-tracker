import path from 'path';
import XLSX from 'xlsx';
import { getWorkbookConfig } from './bootstrapExcel.js';

const storageDir = path.resolve(process.cwd(), '../excel-storage');

function getWorkbookPath(key) {
  const config = getWorkbookConfig()[key];

  if (!config) {
    throw new Error(`Unknown workbook: ${key}`);
  }

  return path.join(storageDir, config.filename);
}

export function readSheetRows(key) {
  const workbook = XLSX.readFile(getWorkbookPath(key));
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
}

export function replaceSheetRows(key, rows) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, getWorkbookPath(key));
}

export function appendSheetRow(key, row) {
  const rows = readSheetRows(key);
  rows.push(row);
  replaceSheetRows(key, rows);
}
