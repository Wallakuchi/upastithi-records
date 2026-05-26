// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Starting database seeding...');

//   try {
//     // Hash passwords
//     const hashedPassword = await bcrypt.hash('MB@123456', 10);
//     const hashedHrPassword = await bcrypt.hash('HR@123456', 10);

//     // Clear existing data (optional - comment out if you want to keep existing data)
//     await prisma.attendance.deleteMany();
//     await prisma.leaveRequest.deleteMany();
//     await prisma.employee.deleteMany();

//     // Create 5 Employee entries
//     const employee1 = await prisma.employee.upsert({
//       where: { email: 'john.doe@company.com' },
//       update: {},
//       create: {
//         employee_code: 'EMP001',
//         name: 'John Doe',
//         email: 'john.doe@company.com',
//         phone: '9876543210',
//         password_hash: hashedPassword,
//         role: 'EMPLOYEE',
//         designation: 'Software Developer',
//         department: 'Engineering',
//         status: true,
//       },
//     });

//     const employee2 = await prisma.employee.upsert({
//       where: { email: 'jane.smith@company.com' },
//       update: {},
//       create: {
//         employee_code: 'EMP002',
//         name: 'Jane Smith',
//         email: 'jane.smith@company.com',
//         phone: '9876543211',
//         password_hash: hashedPassword,
//         role: 'EMPLOYEE',
//         designation: 'UI/UX Designer',
//         department: 'Design',
//         status: true,
//       },
//     });

//     const employee3 = await prisma.employee.upsert({
//       where: { email: 'michael.johnson@company.com' },
//       update: {},
//       create: {
//         employee_code: 'EMP003',
//         name: 'Michael Johnson',
//         email: 'michael.johnson@company.com',
//         phone: '9876543212',
//         password_hash: hashedPassword,
//         role: 'EMPLOYEE',
//         designation: 'Project Manager',
//         department: 'Management',
//         status: true,
//       },
//     });

//     const employee4 = await prisma.employee.upsert({
//       where: { email: 'sarah.williams@company.com' },
//       update: {},
//       create: {
//         employee_code: 'EMP004',
//         name: 'Sarah Williams',
//         email: 'sarah.williams@company.com',
//         phone: '9876543213',
//         password_hash: hashedPassword,
//         role: 'EMPLOYEE',
//         designation: 'Data Analyst',
//         department: 'Analytics',
//         status: true,
//       },
//     });

//     const employee5 = await prisma.employee.upsert({
//       where: { email: 'david.brown@company.com' },
//       update: {},
//       create: {
//         employee_code: 'EMP005',
//         name: 'David Brown',
//         email: 'david.brown@company.com',
//         phone: '9876543214',
//         password_hash: hashedPassword,
//         role: 'EMPLOYEE',
//         designation: 'QA Engineer',
//         department: 'Quality Assurance',
//         status: true,
//       },
//     });

//     // Create 1 HR entry
//     const hrUser = await prisma.employee.upsert({
//       where: { email: 'hr@company.com' },
//       update: {},
//       create: {
//         employee_code: 'HR001',
//         name: 'HR Manager',
//         email: 'hr@company.com',
//         phone: '9876543215',
//         password_hash: hashedHrPassword,
//         role: 'HR',
//         designation: 'HR Manager',
//         department: 'Human Resources',
//         status: true,
//       },
//     });

//     console.log('✅ Employees created:');
//     console.log(`   - ${employee1.name} (${employee1.email})`);
//     console.log(`   - ${employee2.name} (${employee2.email})`);
//     console.log(`   - ${employee3.name} (${employee3.email})`);
//     console.log(`   - ${employee4.name} (${employee4.email})`);
//     console.log(`   - ${employee5.name} (${employee5.email})`);
//     console.log(`\n✅ HR User created:`);
//     console.log(`   - ${hrUser.name} (${hrUser.email})`);

//     // Create sample attendance records for today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const attendance1 = await prisma.attendance.upsert({
//       where: {
//         employee_id_attendance_date: {
//           employee_id: employee1.id,
//           attendance_date: today,
//         },
//       },
//       update: {},
//       create: {
//         employee_id: employee1.id,
//         attendance_date: today,
//         check_in_time: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9:00 AM
//         check_out_time: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6:00 PM
//         check_in_lat: 28.553306,
//         check_in_lng: 77.204705,
//         check_out_lat: 28.553306,
//         check_out_lng: 77.204705,
//         attendance_status: 'PRESENT',
//       },
//     });

//     const attendance2 = await prisma.attendance.upsert({
//       where: {
//         employee_id_attendance_date: {
//           employee_id: employee2.id,
//           attendance_date: today,
//         },
//       },
//       update: {},
//       create: {
//         employee_id: employee2.id,
//         attendance_date: today,
//         check_in_time: new Date(today.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM
//         check_out_time: new Date(today.getTime() + 17.5 * 60 * 60 * 1000), // 5:30 PM
//         check_in_lat: 28.553306,
//         check_in_lng: 77.204705,
//         attendance_status: 'LATE',
//       },
//     });

//     const attendance3 = await prisma.attendance.upsert({
//       where: {
//         employee_id_attendance_date: {
//           employee_id: employee3.id,
//           attendance_date: today,
//         },
//       },
//       update: {},
//       create: {
//         employee_id: employee3.id,
//         attendance_date: today,
//         attendance_status: 'ABSENT',
//       },
//     });

//     console.log(`\n✅ Attendance records created for today`);
//     console.log(`   - ${employee1.name}: PRESENT (9:00 AM - 6:00 PM)`);
//     console.log(`   - ${employee2.name}: LATE (9:30 AM - 5:30 PM)`);
//     console.log(`   - ${employee3.name}: ABSENT`);

//     // Create sample leave requests
//     const leaveStart = new Date();
//     leaveStart.setDate(leaveStart.getDate() + 5); // 5 days from now
//     const leaveEnd = new Date(leaveStart);
//     leaveEnd.setDate(leaveEnd.getDate() + 2); // 2 day leave

//     const leave1 = await prisma.leaveRequest.create({
//       data: {
//         employee_id: employee4.id,
//         from_date: leaveStart,
//         to_date: leaveEnd,
//         leave_type: 'CASUAL',
//         reason: 'Personal appointment',
//         status: 'PENDING',
//       },
//     });

//     const leave2 = await prisma.leaveRequest.create({
//       data: {
//         employee_id: employee5.id,
//         from_date: new Date(leaveStart.getTime() - 10 * 24 * 60 * 60 * 1000), // Past leave
//         to_date: new Date(leaveStart.getTime() - 8 * 24 * 60 * 60 * 1000),
//         leave_type: 'SICK',
//         reason: 'Medical leave',
//         status: 'APPROVED',
//         approved_by: hrUser.id,
//       },
//     });

//     console.log(`\n✅ Leave requests created`);
//     console.log(`   - ${employee4.name}: PENDING (${leaveStart.toDateString()} - ${leaveEnd.toDateString()})`);
//     console.log(`   - ${employee5.name}: APPROVED (Past leave)`);

//     console.log('\n🎉 Database seeding completed successfully!');
//     console.log('\n📝 Credentials for testing:');
//     console.log('   Employees: email@company.com / SecurePassword123');
//     console.log('   HR: hr@company.com / HRPassword123');
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }

//   await prisma.officeSettings.create({
//   data: {
//     office_name: 'Main Office',
//     office_latitude: 28.553306,
//     office_longitude: 77.204705,
//     allowed_radius: 20,
//     office_start_time: '09:00',
//     office_end_time: '18:00',
//   },
// });
// }

// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });


import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
console.log('🌱 Starting database seeding...');

try {
// Hash passwords
const hashedPassword = await bcrypt.hash('MB@123456', 10);

// Clear existing data
await prisma.attendance.deleteMany();
await prisma.leaveRequest.deleteMany();
await prisma.officeSettings.deleteMany();
await prisma.employee.deleteMany();

// Employee master data
const employees = [
{
employee_code: 'EMP01',
name: 'Ajay Kumar Dwivedi',
email: 'ajay@metrobuildtech.in]',
phone: '9999900001',
role: 'EMPLOYEE',
designation: 'Driver',
department: 'unknown',
},
{
employee_code: 'EMP02',
name: 'Akash Meena',
email: 'aakash@metrobuildtech.in',
phone: '9999900002',
role: 'EMPLOYEE',
designation: 'Rider',
department: 'unknown',
},
{
employee_code: 'EMP03',
name: 'Anand Kumar',
email: 'anand@metrobuildtech.in',
phone: '9999900003',
role: 'EMPLOYEE',
designation: 'Accountant',
department: 'Accounts',
},
{
employee_code: 'EMP04',
name: 'Anil Kumar Singh',
email: 'anil@metrobuildtech.in',
phone: '9999900004',
role: 'EMPLOYEE',
designation: 'Peon',
department: 'unknown',
},
{
employee_code: 'EMP05',
name: 'Anjali',
email: 'ea@metrobuildtech.in',
phone: '9999900005',
role: 'HR',
designation: 'EA',
department: 'unknown',
},
{
employee_code: 'EMP06',
name: 'Bijendra Singh',
email: 'bijendra@metrobuildtech.in',
phone: '9999900006',
role: 'EMPLOYEE',
designation: 'Site Engineer',
department: 'unknown',
},
{
employee_code: 'EMP07',
name: 'Gopal Singh',
email: 'gopal@metrobuildtech.in',
phone: '9999900007',
role: 'EMPLOYEE',
designation: 'Rider',
department: 'unknown',
},
{
employee_code: 'EMP08',
name: 'Gunjan',
email: 'gunjan@metrobuildtech.in',
phone: '9999900008',
role: 'EMPLOYEE',
designation: 'Project Manager',
department: 'unknown',
},
{
employee_code: 'EMP09',
name: 'Harish Singh',
email: 'harish@metrobuildtech.in',
phone: '9999900009',
role: 'EMPLOYEE',
designation: 'PM',
department: 'unknown',
},
{
employee_code: 'EMP10',
name: 'Harit Tyagi',
email: 'accounts@metrobuildtech.in',
phone: '9999900010',
role: 'EMPLOYEE',
designation: 'Accountant',
department: 'Accounts',
},
{
employee_code: 'EMP11',
name: 'Hema Verma',
email: 'info@metrobuildtech.in',
phone: '9999900011',
role: 'EMPLOYEE',
designation: 'Manager',
department: 'unknown',
},
{
employee_code: 'EMP12',
name: 'Joginder Singh Pawar',
email: 'joginder@metrobuildtech.in',
phone: '9999900012',
role: 'EMPLOYEE',
designation: 'PM',
department: 'unknown',
},
{
employee_code: 'EMP13',
name: 'Jyoti Pandey',
email: 'jyoti@metrobuildtech.in',
phone: '9999900013',
role: 'EMPLOYEE',
designation: 'Designer',
department: 'DESIGN',
},
{
employee_code: 'EMP14',
name: 'Kaushal Kumar Saini',
email: 'kaushal@metrobuildtech.in',
phone: '9999900014',
role: 'EMPLOYEE',
designation: 'Accountant',
department: 'Accounts',
},
{
employee_code: 'EMP15',
name: 'Manglaram',
email: 'manglaram@metrobuildtech.in',
phone: '9999900015',
role: 'EMPLOYEE',
designation: 'Supervisor',
department: 'unknown',
},
{
employee_code: 'EMP16',
name: 'Moni Gusain',
email: 'moni@metrobuildtech.in',
phone: '9999900016',
role: 'EMPLOYEE',
designation: 'Receptionist',
department: 'Accounts',
},
{
employee_code: 'EMP17',
name: 'Brijendra Tiwari',
email: 'brijendra@metrobuildtech.in',
phone: '9999900017',
role: 'EMPLOYEE',
designation: 'Site Engineer',
department: 'unknown',
},
{
employee_code: 'EMP18',
name: 'Nilesh Bisht',
email: 'nilesh@metrobuildtech.in',
phone: '9999900018',
role: 'EMPLOYEE',
designation: 'Designer',
department: 'DESIGN',
},
{
employee_code: 'EMP19',
name: 'Nilesh Khyaliram Verma',
email: 'nileshverma@metrobuildtech.in',
phone: '9999900019',
role: 'EMPLOYEE',
designation: 'Project Manager',
department: 'unknown',
},
{
employee_code: 'EMP20',
name: 'Pradeep Dixit',
email: 'pradeep@metrobuildtech.in',
phone: '9999900020',
role: 'EMPLOYEE',
designation: 'PM',
department: 'unknown',
},
{
employee_code: 'EMP21',
name: 'Rahul Gupta',
email: 'mis@metrobuildtech.in',
phone: '9999900021',
role: 'EMPLOYEE',
designation: 'MIS Executive',
department: 'unknown',
},
{
employee_code: 'EMP22',
name: 'Raj Kamal Patel',
email: 'r.kamal@metrobuildtech.in',
phone: '9999900022',
role: 'EMPLOYEE',
designation: 'Project Manager',
department: 'unknown',
},
{
employee_code: 'EMP23',
name: 'Rupesh Kumar',
email: 'rupesh@metrobuildtech.in',
phone: '9999900023',
role: 'EMPLOYEE',
designation: 'Purchase Executive',
department: 'PURCHASE',
},
{
employee_code: 'EMP24',
name: 'Sanjay',
email: 'sanjay.kumar@metrobuildtech.in',
phone: '9999900024',
role: 'EMPLOYEE',
designation: 'Site Engineer',
department: 'unknown',
},
{
employee_code: 'EMP25',
name: 'Santosh Kumar',
email: 'cs@metrobuildtech.in',
phone: '9999900025',
role: 'EMPLOYEE',
designation: 'Company Secretary',
department: 'Secretarial',
},
{
employee_code: 'EMP26',
name: 'Sarika Kohli',
email: 'sarika@metrobuildtech.in',
phone: '9999900026',
role: 'EMPLOYEE',
designation: 'Purchase Manager',
department: 'PURCHASE',
},
{
employee_code: 'EMP27',
name: 'Sunil Kumar',
email: 'finance@metrobuildtech.in',
phone: '9999900027',
role: 'EMPLOYEE',
designation: 'Accountant',
department: 'Accounts',
},
{
employee_code: 'EMP28',
name: 'Udit Narayan Dwivedi',
email: 'udit@metrobuildtech.in',
phone: '9999900028',
role: 'EMPLOYEE',
designation: 'Others',
department: 'unknown',
},
{
employee_code: 'EMP29',
name: 'Veerendra Pratap Yadav',
email: 'veerendra.yadav@metrobuildtech.in',
phone: '9999900029',
role: 'EMPLOYEE',
designation: 'Site Engineer',
department: 'unknown',
},
];


// Create Employees
const createdEmployees = [];

for (const emp of employees) {
  const employee = await prisma.employee.upsert({
    where: { email: emp.email },
    update: {},
    create: {
      employee_code: emp.employee_code,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      password_hash: hashedPassword,
      role: emp.role as any,
      designation: emp.designation,
      department: emp.department,
      status: true,
    },
  });

  createdEmployees.push(employee);
}

console.log(`✅ ${createdEmployees.length} Employees created`);

// Create Office Settings
await prisma.officeSettings.create({
  data: {
    office_name: 'Main Office',
    office_latitude: 28.553306,
    office_longitude: 77.204705,
    allowed_radius: 75,
    office_start_time: '09:00',
    office_end_time: '18:00',
  },
});

console.log('✅ Office settings created');

// Sample Attendance
const today = new Date();
today.setHours(0, 0, 0, 0);

// Present
await prisma.attendance.create({
  data: {
    employee_id: createdEmployees[0].id,
    attendance_date: today,
    check_in_time: new Date(today.getTime() + 9 * 60 * 60 * 1000),
    check_out_time: new Date(today.getTime() + 18 * 60 * 60 * 1000),
    check_in_lat: 28.553306,
    check_in_lng: 77.204705,
    check_out_lat: 28.553306,
    check_out_lng: 77.204705,
    attendance_status: 'PRESENT',
  },
});

// Late
await prisma.attendance.create({
  data: {
    employee_id: createdEmployees[1].id,
    attendance_date: today,
    check_in_time: new Date(today.getTime() + 9.5 * 60 * 60 * 1000),
    check_in_lat: 28.553306,
    check_in_lng: 77.204705,
    attendance_status: 'LATE',
  },
});

// Absent
await prisma.attendance.create({
  data: {
    employee_id: createdEmployees[2].id,
    attendance_date: today,
    attendance_status: 'ABSENT',
  },
});

console.log('✅ Attendance records created');

// Leave Requests
const leaveStart = new Date();
leaveStart.setDate(leaveStart.getDate() + 5);

const leaveEnd = new Date(leaveStart);
leaveEnd.setDate(leaveEnd.getDate() + 2);

const hrUser = createdEmployees.find(
  (emp) => emp.role === 'HR'
);

if (hrUser) {
  await prisma.leaveRequest.create({
    data: {
      employee_id: createdEmployees[3].id,
      from_date: leaveStart,
      to_date: leaveEnd,
      leave_type: 'CASUAL',
      reason: 'Personal work',
      status: 'PENDING',
    },
  });

  await prisma.leaveRequest.create({
    data: {
      employee_id: createdEmployees[4].id,
      from_date: new Date(
        leaveStart.getTime() - 10 * 24 * 60 * 60 * 1000
      ),
      to_date: new Date(
        leaveStart.getTime() - 8 * 24 * 60 * 60 * 1000
      ),
      leave_type: 'SICK',
      reason: 'Medical leave',
      status: 'APPROVED',
      approved_by: hrUser.id,
    },
  });
}

console.log('✅ Leave requests created');

console.log('\n🎉 Database seeding completed successfully!');
console.log('\n📝 Login Credentials:');
console.log('Password for all users: MB@123456');

} catch (error) {
console.error('❌ Error seeding database:', error);
throw error;
} finally {
await prisma.$disconnect();
}
}

main().catch((error) => {
console.error(error);
process.exit(1);
});
