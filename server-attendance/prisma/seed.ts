import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Hash passwords
    const hashedPassword = await bcrypt.hash('SecurePassword123', 10);
    const hashedHrPassword = await bcrypt.hash('HRPassword123', 10);

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await prisma.attendance.deleteMany();
    // await prisma.leaveRequest.deleteMany();
    // await prisma.employee.deleteMany();

    // Create 5 Employee entries
    const employee1 = await prisma.employee.upsert({
      where: { email: 'john.doe@company.com' },
      update: {},
      create: {
        employee_code: 'EMP001',
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '9876543210',
        password_hash: hashedPassword,
        role: 'EMPLOYEE',
        designation: 'Software Developer',
        department: 'Engineering',
        status: true,
      },
    });

    const employee2 = await prisma.employee.upsert({
      where: { email: 'jane.smith@company.com' },
      update: {},
      create: {
        employee_code: 'EMP002',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '9876543211',
        password_hash: hashedPassword,
        role: 'EMPLOYEE',
        designation: 'UI/UX Designer',
        department: 'Design',
        status: true,
      },
    });

    const employee3 = await prisma.employee.upsert({
      where: { email: 'michael.johnson@company.com' },
      update: {},
      create: {
        employee_code: 'EMP003',
        name: 'Michael Johnson',
        email: 'michael.johnson@company.com',
        phone: '9876543212',
        password_hash: hashedPassword,
        role: 'EMPLOYEE',
        designation: 'Project Manager',
        department: 'Management',
        status: true,
      },
    });

    const employee4 = await prisma.employee.upsert({
      where: { email: 'sarah.williams@company.com' },
      update: {},
      create: {
        employee_code: 'EMP004',
        name: 'Sarah Williams',
        email: 'sarah.williams@company.com',
        phone: '9876543213',
        password_hash: hashedPassword,
        role: 'EMPLOYEE',
        designation: 'Data Analyst',
        department: 'Analytics',
        status: true,
      },
    });

    const employee5 = await prisma.employee.upsert({
      where: { email: 'david.brown@company.com' },
      update: {},
      create: {
        employee_code: 'EMP005',
        name: 'David Brown',
        email: 'david.brown@company.com',
        phone: '9876543214',
        password_hash: hashedPassword,
        role: 'EMPLOYEE',
        designation: 'QA Engineer',
        department: 'Quality Assurance',
        status: true,
      },
    });

    // Create 1 HR entry
    const hrUser = await prisma.employee.upsert({
      where: { email: 'hr@company.com' },
      update: {},
      create: {
        employee_code: 'HR001',
        name: 'HR Manager',
        email: 'hr@company.com',
        phone: '9876543215',
        password_hash: hashedHrPassword,
        role: 'HR',
        designation: 'HR Manager',
        department: 'Human Resources',
        status: true,
      },
    });

    console.log('✅ Employees created:');
    console.log(`   - ${employee1.name} (${employee1.email})`);
    console.log(`   - ${employee2.name} (${employee2.email})`);
    console.log(`   - ${employee3.name} (${employee3.email})`);
    console.log(`   - ${employee4.name} (${employee4.email})`);
    console.log(`   - ${employee5.name} (${employee5.email})`);
    console.log(`\n✅ HR User created:`);
    console.log(`   - ${hrUser.name} (${hrUser.email})`);

    // Create sample attendance records for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance1 = await prisma.attendance.upsert({
      where: {
        employee_id_attendance_date: {
          employee_id: employee1.id,
          attendance_date: today,
        },
      },
      update: {},
      create: {
        employee_id: employee1.id,
        attendance_date: today,
        check_in_time: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9:00 AM
        check_out_time: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6:00 PM
        check_in_lat: 28.6139,
        check_in_lng: 77.209,
        check_out_lat: 28.6139,
        check_out_lng: 77.209,
        attendance_status: 'PRESENT',
      },
    });

    const attendance2 = await prisma.attendance.upsert({
      where: {
        employee_id_attendance_date: {
          employee_id: employee2.id,
          attendance_date: today,
        },
      },
      update: {},
      create: {
        employee_id: employee2.id,
        attendance_date: today,
        check_in_time: new Date(today.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM
        check_out_time: new Date(today.getTime() + 17.5 * 60 * 60 * 1000), // 5:30 PM
        check_in_lat: 28.6139,
        check_in_lng: 77.209,
        attendance_status: 'LATE',
      },
    });

    const attendance3 = await prisma.attendance.upsert({
      where: {
        employee_id_attendance_date: {
          employee_id: employee3.id,
          attendance_date: today,
        },
      },
      update: {},
      create: {
        employee_id: employee3.id,
        attendance_date: today,
        attendance_status: 'ABSENT',
      },
    });

    console.log(`\n✅ Attendance records created for today`);
    console.log(`   - ${employee1.name}: PRESENT (9:00 AM - 6:00 PM)`);
    console.log(`   - ${employee2.name}: LATE (9:30 AM - 5:30 PM)`);
    console.log(`   - ${employee3.name}: ABSENT`);

    // Create sample leave requests
    const leaveStart = new Date();
    leaveStart.setDate(leaveStart.getDate() + 5); // 5 days from now
    const leaveEnd = new Date(leaveStart);
    leaveEnd.setDate(leaveEnd.getDate() + 2); // 2 day leave

    const leave1 = await prisma.leaveRequest.create({
      data: {
        employee_id: employee4.id,
        from_date: leaveStart,
        to_date: leaveEnd,
        leave_type: 'CASUAL',
        reason: 'Personal appointment',
        status: 'PENDING',
      },
    });

    const leave2 = await prisma.leaveRequest.create({
      data: {
        employee_id: employee5.id,
        from_date: new Date(leaveStart.getTime() - 10 * 24 * 60 * 60 * 1000), // Past leave
        to_date: new Date(leaveStart.getTime() - 8 * 24 * 60 * 60 * 1000),
        leave_type: 'SICK',
        reason: 'Medical leave',
        status: 'APPROVED',
        approved_by: hrUser.id,
      },
    });

    console.log(`\n✅ Leave requests created`);
    console.log(`   - ${employee4.name}: PENDING (${leaveStart.toDateString()} - ${leaveEnd.toDateString()})`);
    console.log(`   - ${employee5.name}: APPROVED (Past leave)`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Credentials for testing:');
    console.log('   Employees: email@company.com / SecurePassword123');
    console.log('   HR: hr@company.com / HRPassword123');
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
