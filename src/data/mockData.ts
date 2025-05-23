import { Email, EmailAccount, Folder } from '../types';
import { MailIcon, InboxIcon, SendIcon, FileIcon, StarIcon, TrashIcon, ArchiveIcon } from 'lucide-react';

export const mockAccounts: EmailAccount[] = [
  {
    id: '1',
    name: 'Work Email',
    email: 'work@example.com',
    provider: 'gmail',
    color: '#0A84FF',
    unreadCount: 12,
  },
  {
    id: '2',
    name: 'Personal',
    email: 'personal@example.com',
    provider: 'icloud',
    color: '#5E5CE6',
    unreadCount: 5,
  },
  {
    id: '3',
    name: 'University',
    email: 'university@example.com',
    provider: 'outlook',
    color: '#30D158',
    unreadCount: 0,
  },
];

export const mockFolders: Folder[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    icon: 'InboxIcon',
    count: 17,
  },
  {
    id: 'sent',
    name: 'Sent',
    icon: 'SendIcon',
    count: 0,
  },
  {
    id: 'drafts',
    name: 'Drafts',
    icon: 'FileIcon',
    count: 3,
  },
  {
    id: 'starred',
    name: 'Starred',
    icon: 'StarIcon',
    count: 5,
  },
  {
    id: 'trash',
    name: 'Trash',
    icon: 'TrashIcon',
    count: 0,
  },
  {
    id: 'archive',
    name: 'Archive',
    icon: 'ArchiveIcon',
    count: 0,
  },
];

export const mockEmails: Email[] = [
  {
    id: '1',
    from: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
    },
    to: [
      {
        name: 'You',
        email: 'work@example.com',
      },
    ],
    subject: 'Project Update: Q2 Goals',
    body: `<p>Hi there,</p>
    <p>I wanted to share some updates about our Q2 goals. We've made significant progress in the last few weeks, and I'm excited to discuss our next steps.</p>
    <p>Could we schedule a meeting later this week to go over the details?</p>
    <p>Best regards,<br>Sarah</p>`,
    timestamp: '2023-05-15T10:30:00Z',
    read: false,
    starred: true,
    labels: ['work', 'important'],
    attachments: [],
    folder: 'inbox',
    accountId: '1',
  },
  {
    id: '2',
    from: {
      name: 'Netflix',
      email: 'info@netflix.com',
    },
    to: [
      {
        name: 'You',
        email: 'personal@example.com',
      },
    ],
    subject: 'New Shows and Movies This Week',
    body: `<p>Hello,</p>
    <p>Check out what's new on Netflix this week! We've added several new shows and movies that we think you'll love based on your viewing history.</p>
    <p>Start watching now!</p>`,
    timestamp: '2023-05-14T15:45:00Z',
    read: true,
    starred: false,
    labels: ['entertainment'],
    attachments: [],
    folder: 'inbox',
    accountId: '2',
  },
  {
    id: '3',
    from: {
      name: 'Alex Wong',
      email: 'alex.wong@example.com',
    },
    to: [
      {
        name: 'You',
        email: 'work@example.com',
      },
    ],
    subject: 'Meeting Notes: Product Roadmap',
    body: `<p>Hi team,</p>
    <p>Attached are the notes from our product roadmap discussion today. I've highlighted the key action items and deadlines for each team member.</p>
    <p>Please review and let me know if you have any questions or if I've missed anything important.</p>
    <p>Thanks,<br>Alex</p>`,
    timestamp: '2023-05-14T11:20:00Z',
    read: false,
    starred: true,
    labels: ['work', 'meeting'],
    attachments: [
      {
        id: 'a1',
        name: 'Product_Roadmap_2023.pdf',
        size: 2458000,
        type: 'application/pdf',
        url: '#',
      },
    ],
    folder: 'inbox',
    accountId: '1',
  },
  {
    id: '4',
    from: {
      name: 'University Administration',
      email: 'admin@university.edu',
    },
    to: [
      {
        name: 'You',
        email: 'university@example.com',
      },
    ],
    subject: 'Important: Upcoming Registration Deadline',
    body: `<p>Dear Student,</p>
    <p>This is a reminder that course registration for the Fall semester opens on June 1st. Please ensure that you have cleared any holds on your account before this date.</p>
    <p>For assistance, please contact the registrar's office.</p>
    <p>Regards,<br>University Administration</p>`,
    timestamp: '2023-05-13T09:15:00Z',
    read: true,
    starred: false,
    labels: ['education'],
    attachments: [],
    folder: 'inbox',
    accountId: '3',
  },
  {
    id: '5',
    from: {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
    },
    to: [
      {
        name: 'You',
        email: 'work@example.com',
      },
    ],
    subject: 'Design Review Feedback',
    body: `<p>Hi,</p>
    <p>I've reviewed the latest design mockups and have some feedback. Overall, the direction looks great, but I have a few suggestions that might improve the user experience.</p>
    <p>I've attached my notes with specific comments. Let's discuss these in our next meeting.</p>
    <p>Thanks,<br>Michael</p>`,
    timestamp: '2023-05-12T16:50:00Z',
    read: false,
    starred: false,
    labels: ['work', 'design'],
    attachments: [
      {
        id: 'a2',
        name: 'Design_Feedback.docx',
        size: 1250000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        url: '#',
      },
    ],
    folder: 'inbox',
    accountId: '1',
  },
  {
    id: '6',
    from: {
      name: 'Amazon',
      email: 'shipment-tracking@amazon.com',
    },
    to: [
      {
        name: 'You',
        email: 'personal@example.com',
      },
    ],
    subject: 'Your Amazon Order Has Shipped',
    body: `<p>Hello,</p>
    <p>Your recent Amazon order (#123-4567890-1234567) has shipped and is on its way! You can track your package using the link below.</p>
    <p>Estimated delivery date: May 16, 2023</p>
    <p>Thank you for shopping with Amazon!</p>`,
    timestamp: '2023-05-11T14:30:00Z',
    read: true,
    starred: false,
    labels: ['shopping'],
    attachments: [],
    folder: 'inbox',
    accountId: '2',
  },
  {
    id: '7',
    from: {
      name: 'Team Slack',
      email: 'notifications@slack.com',
    },
    to: [
      {
        name: 'You',
        email: 'work@example.com',
      },
    ],
    subject: 'New message from David in #project-alpha',
    body: `<p>You have a new message in Slack:</p>
    <p><strong>David Miller (@david) in #project-alpha:</strong> "Has everyone reviewed the latest requirements document? I'd like to finalize it by EOD."</p>
    <p>Reply in Slack ↗</p>`,
    timestamp: '2023-05-11T11:05:00Z',
    read: true,
    starred: false,
    labels: ['work', 'notification'],
    attachments: [],
    folder: 'inbox',
    accountId: '1',
  },
  {
    id: '8',
    from: {
      name: 'LinkedIn',
      email: 'jobs-noreply@linkedin.com',
    },
    to: [
      {
        name: 'You',
        email: 'personal@example.com',
      },
    ],
    subject: 'Jobs you might be interested in',
    body: `<p>Hi there,</p>
    <p>Based on your profile and job preferences, we've found some new job postings that might interest you:</p>
    <ul>
      <li>Senior Developer at Tech Innovations Inc.</li>
      <li>UX Designer at Creative Solutions</li>
      <li>Project Manager at Global Systems</li>
    </ul>
    <p>View all job recommendations on LinkedIn</p>`,
    timestamp: '2023-05-10T09:45:00Z',
    read: true,
    starred: false,
    labels: ['career'],
    attachments: [],
    folder: 'inbox',
    accountId: '2',
  },
  {
    id: '9',
    from: {
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@university.edu',
    },
    to: [
      {
        name: 'You',
        email: 'university@example.com',
      },
    ],
    subject: 'Research Opportunity: Summer Project',
    body: `<p>Dear Student,</p>
    <p>I wanted to reach out about a research opportunity in our department this summer. Based on your academic performance, I think you would be an excellent candidate for this project.</p>
    <p>The project focuses on innovative approaches to data analysis in our field, and would provide valuable experience for your future career or academic pursuits.</p>
    <p>If you're interested, please let me know by May 20th so we can discuss the details.</p>
    <p>Best regards,<br>Dr. Emily Rodriguez<br>Associate Professor</p>`,
    timestamp: '2023-05-09T13:15:00Z',
    read: false,
    starred: true,
    labels: ['education', 'important'],
    attachments: [],
    folder: 'inbox',
    accountId: '3',
  },
  {
    id: '10',
    from: {
      name: 'Bank of America',
      email: 'alerts@bankofamerica.com',
    },
    to: [
      {
        name: 'You',
        email: 'personal@example.com',
      },
    ],
    subject: 'Your Monthly Statement is Ready',
    body: `<p>Dear Valued Customer,</p>
    <p>Your monthly statement for account ending in 4567 is now available to view online. Please log in to your account to access your statement.</p>
    <p>If you notice any unauthorized transactions, please contact us immediately.</p>
    <p>Thank you for banking with Bank of America.</p>`,
    timestamp: '2023-05-08T08:00:00Z',
    read: true,
    starred: false,
    labels: ['finance'],
    attachments: [],
    folder: 'inbox',
    accountId: '2',
  },
  {
    id: '11',
    from: {
      name: 'Jenna Kim',
      email: 'jenna.kim@example.com',
    },
    to: [
      {
        name: 'You',
        email: 'work@example.com',
      },
    ],
    subject: 'Client Presentation Draft',
    body: `<p>Hi,</p>
    <p>I've finished the first draft of our client presentation for next week. Could you review it when you have a chance and provide any feedback or suggestions?</p>
    <p>I'm particularly interested in your thoughts on slides 15-20, which cover our strategic recommendations.</p>
    <p>Thanks!<br>Jenna</p>`,
    timestamp: '2023-05-07T15:30:00Z',
    read: false,
    starred: true,
    labels: ['work', 'client'],
    attachments: [
      {
        id: 'a3',
        name: 'Client_Presentation_Draft.pptx',
        size: 8750000,
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        url: '#',
      },
    ],
    folder: 'inbox',
    accountId: '1',
  },
];