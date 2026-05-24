import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const storageDir = path.resolve(process.cwd(), '../excel-storage');

const workbookConfig = {
  users: {
    filename: 'users.xlsx',
    rows: [
      { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
      { id: 2, username: 'om', password: 'om123', role: 'user' }
    ]
  },
  assignments: {
    filename: 'assignments.xlsx',
    rows: [
      {
        userId: 2,
        category: 'Cloud',
        topic: 'AWS',
        subtopic: 'EC2',
        resources: JSON.stringify([
          {
            title: 'EC2 Documentation',
            type: 'documentation',
            url: 'https://docs.aws.amazon.com/ec2/',
            description: 'Official compute documentation and getting started guides.'
          }
        ]),
        requirements: 'Complete notes and mark subtopic done'
      },
      {
        userId: 2,
        category: 'Cloud',
        topic: 'AWS',
        subtopic: 'S3',
        resources: JSON.stringify([
          {
            title: 'S3 User Guide',
            type: 'documentation',
            url: 'https://docs.aws.amazon.com/s3/',
            description: 'Storage concepts, buckets, and permissions.'
          }
        ]),
        requirements: 'Complete notes and mark subtopic done'
      }
    ]
  },
  progress: {
    filename: 'progress.xlsx',
    rows: [{ userId: 2, topic: 'AWS', subtopic: 'EC2', completed: true }]
  },
  notes: {
    filename: 'notes.xlsx',
    rows: [{ userId: 2, topic: 'AWS', notes: 'Important points' }]
  },
  certifications: {
    filename: 'certifications.xlsx',
    rows: [
      {
        id: 'cert-1',
        title: 'AWS Certified Solutions Architect - Associate',
        provider: 'Amazon Web Services',
        difficulty: 'Intermediate',
        category: 'Cloud',
        description: 'Validates ability to design robust, secure, and cost-effective cloud systems on AWS.',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
        duration: '1.5 months',
        sequence: 1
      },
      {
        id: 'cert-2',
        title: 'Microsoft Certified: Azure Fundamentals',
        provider: 'Microsoft Azure',
        difficulty: 'Beginner',
        category: 'Cloud',
        description: 'Foundational level knowledge of cloud services and how Azure provides those services.',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
        duration: '3 weeks',
        sequence: 2
      }
    ]
  },
  certificationAssignments: {
    filename: 'certification_assignments.xlsx',
    rows: [
      { certificationId: 'cert-1', userId: 2, status: 'In Progress', progress: 40 }
    ]
  },
  certificationRequests: {
    filename: 'certification_requests.xlsx',
    rows: []
  }
};

export function initializeWorkbookStorage() {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  Object.values(workbookConfig).forEach(({ filename, rows }) => {
    const filePath = path.join(storageDir, filename);

    if (fs.existsSync(filePath)) {
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filePath);
  });

  normalizeProgressRows();
}

export function getWorkbookConfig() {
  return workbookConfig;
}

function normalizeProgressRows() {
  const progressPath = path.join(storageDir, workbookConfig.progress.filename);
  const assignmentsPath = path.join(storageDir, workbookConfig.assignments.filename);

  if (!fs.existsSync(progressPath) || !fs.existsSync(assignmentsPath)) {
    return;
  }

  const progressWorkbook = XLSX.readFile(progressPath);
  const progressSheet = progressWorkbook.SheetNames[0];
  const progressRows = XLSX.utils.sheet_to_json(progressWorkbook.Sheets[progressSheet], { defval: '' });

  if (!progressRows.some((row) => !row.subtopic)) {
    return;
  }

  const assignmentsWorkbook = XLSX.readFile(assignmentsPath);
  const assignmentsSheet = assignmentsWorkbook.SheetNames[0];
  const assignmentsRows = XLSX.utils.sheet_to_json(assignmentsWorkbook.Sheets[assignmentsSheet], { defval: '' });
  const normalizedRows = progressRows.map((row) => {
    if (row.subtopic) {
      return row;
    }

    const assignment = assignmentsRows.find(
      (item) => Number(item.userId) === Number(row.userId) && item.topic === row.topic
    );

    return {
      ...row,
      subtopic: assignment?.subtopic || ''
    };
  });
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(normalizedRows);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, progressPath);
}
