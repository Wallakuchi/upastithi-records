// backend-api/src/services/attendanceService.ts

import { PrismaClient } from '@prisma/client';
import { calculateDistance, GeoCoordinates, isWithinOfficeRadius } from '../utils/geodistance.util';
// import { CloudinaryService } from '../utils/cloudinary.util';
import { CheckInInput, CheckOutInput } from '../validators/attendance.validator';

const prisma = new PrismaClient();

export class AttendanceService {
  /**
   * Check-in employee
   */
  static async checkIn(data: CheckInInput): Promise<any> {
    // Get office settings
    const officeSettings = await prisma.officeSettings.findFirst();
    if (!officeSettings) {
      throw new Error('Office settings not configured');
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employee_id: data.employee_id,
        attendance_date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingAttendance && existingAttendance.check_in_time) {
      throw new Error('Already checked in today');
    }

    // Validate geo-fencing
    const employeeLocation: GeoCoordinates = {
      latitude: data.latitude,
      longitude: data.longitude,
    };

    const officeLocation: GeoCoordinates = {
      latitude: officeSettings.office_latitude,
      longitude: officeSettings.office_longitude,
    };

    const isWithinRadius = isWithinOfficeRadius(
      employeeLocation,
      officeLocation,
      officeSettings.allowed_radius
    );

    const selfieUrl = data.selfie_photo;

    // Determine attendance status
    const checkInTime = new Date();
    const officeStartTime = officeSettings.office_start_time;
    const [startHour, startMin] = officeStartTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMin, 0, 0);

    const isLate = checkInTime > startDate;
    const attendanceStatus = isWithinRadius ? (isLate ? 'LATE' : 'PRESENT') : 'OUTSIDE_OFFICE';

    // Create or update attendance record
    const attendance = await prisma.attendance.upsert({
      where: {
        employee_id_attendance_date: {
          employee_id: data.employee_id,
          attendance_date: today,
        },
      },
      create: {
        employee_id: data.employee_id,
        attendance_date: today,
        check_in_time: checkInTime,
        check_in_lat: data.latitude,
        check_in_lng: data.longitude,
        check_in_photo: selfieUrl,
        check_in_device: data.device_info,
        attendance_status: attendanceStatus,
      },
      update: {
        check_in_time: checkInTime,
        check_in_lat: data.latitude,
        check_in_lng: data.longitude,
        check_in_photo: selfieUrl,
        check_in_device: data.device_info,
        attendance_status: attendanceStatus,
      },
    });

    return {
      "success": true,
      message: 'Check-in successful',
      attendance: {
        id: attendance.id,
        check_in_time: attendance.check_in_time,
        status: attendance.attendance_status,
        within_radius: isWithinRadius,
      },
    };
  }

  /**
   * Check-out employee
   */
  static async checkOut(data: CheckOutInput): Promise<any> {
    // Get office settings
    const officeSettings = await prisma.officeSettings.findFirst();
    if (!officeSettings) {
      throw new Error('Office settings not configured');
    }

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employee_id: data.employee_id,
        attendance_date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (!attendance) {
      throw new Error('No check-in record found for today');
    }

    if (!attendance.check_in_time) {
      throw new Error('Must check-in before check-out');
    }

    if (attendance.check_out_time) {
      throw new Error('Already checked out today');
    }

    const selfieUrl = data.selfie_photo;

    // Check if within radius
    const employeeLocation: GeoCoordinates = {
      latitude: data.latitude,
      longitude: data.longitude,
    };

    const officeLocation: GeoCoordinates = {
      latitude: officeSettings.office_latitude,
      longitude: officeSettings.office_longitude,
    };

    const isWithinRadius = isWithinOfficeRadius(
      employeeLocation,
      officeLocation,
      officeSettings.allowed_radius
    );

    // Update attendance record
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        check_out_time: new Date(),
        check_out_lat: data.latitude,
        check_out_lng: data.longitude,
        check_out_photo: selfieUrl,
        check_out_device: data.device_info,
      },
    });

    return {
      message: 'Check-out successful',
      attendance: {
        id: updatedAttendance.id,
        check_in_time: updatedAttendance.check_in_time,
        check_out_time: updatedAttendance.check_out_time,
        status: updatedAttendance.attendance_status,
        within_radius: isWithinRadius,
      },
    };
  }

  /**
   * Get attendance history
   */
  static async getHistory(employeeId: string, startDate?: Date, endDate?: Date, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {
      employee_id: employeeId,
    };

    if (startDate || endDate) {
      where.attendance_date = {};
      if (startDate) where.attendance_date.gte = startDate;
      if (endDate) where.attendance_date.lte = endDate;
    }

    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { attendance_date: 'desc' },
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get today's attendance
   */
  static async getTodayAttendance(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return prisma.attendance.findFirst({
      where: {
        employee_id: employeeId,
        attendance_date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }

  /**
   * Get attendance report
   */
  // static async getReport(startDate: Date, endDate: Date, department?: string, page = 1, limit = 20) {
  //   const skip = (page - 1) * limit;

  //   const where: any = {
  //     attendance_date: {
  //       gte: startDate,
  //       lte: endDate,
  //     },
  //   };

  //   if (department) {
  //     where.employee = {
  //       department,
  //     };
  //   }

  //   const [records, total] = await Promise.all([
  //     prisma.attendance.findMany({
  //       where,
  //       include: {
  //         employee: {
  //           select: {
  //             id: true,
  //             employee_code: true,
  //             name: true,
  //             designation: true,
  //             department: true,
  //           },
  //         },
  //       },
  //       skip,
  //       take: limit,
  //       orderBy: { attendance_date: 'desc' },
  //     }),
  //     prisma.attendance.count({ where }),
  //   ]);

  //   return {
  //     records,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  static async getReport(
  startDate: Date,
  endDate: Date,
  department?: string,
  page = 1,
  limit = 20,
) {
  const skip = (page - 1) * limit;

  const where: any = {
    attendance_date: {
      gte: startDate,
      lte: endDate,
    },
  };

  if (department) {
    where.employee = {
      department,
    };
  }

  // TOTAL EMPLOYEES
  const totalEmployees = await prisma.employee.count({
    where: department ? { department } : {},
  });

  // PRESENT
 const present = await prisma.attendance.count({
  where: {
    ...where,
    attendance_status: 'PRESENT',
  },
});;

  // LATE
const late = await prisma.attendance.count({
  where: {
    ...where,
    attendance_status: 'LATE',
  },
});

  // OUTSIDE OFFICE
const outside_office = await prisma.attendance.count({
  where: {
    ...where,
    attendance_status: 'OUTSIDE_OFFICE',
  },
});

  // ABSENT
  const absent = totalEmployees - present;

  // RECORDS
  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            employee_code: true,
            name: true,
            designation: true,
            department: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        attendance_date: 'desc',
      },
    }),

    prisma.attendance.count({ where }),
  ]);

  return {
    totalEmployees,
    present,
    absent,
    late,
    outside_office,
    records,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
}
