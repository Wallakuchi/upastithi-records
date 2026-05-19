-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HR', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'OUTSIDE_OFFICE');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('SICK', 'CASUAL', 'EARNED', 'UNPAID', 'MATERNITY');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employee_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "designation" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "attendance_date" TIMESTAMP(3) NOT NULL,
    "check_in_time" TIMESTAMP(3),
    "check_out_time" TIMESTAMP(3),
    "check_in_lat" DOUBLE PRECISION,
    "check_in_lng" DOUBLE PRECISION,
    "check_out_lat" DOUBLE PRECISION,
    "check_out_lng" DOUBLE PRECISION,
    "check_in_photo" TEXT,
    "check_out_photo" TEXT,
    "check_in_device" TEXT,
    "check_out_device" TEXT,
    "attendance_status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "leave_type" "LeaveType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "office_settings" (
    "id" TEXT NOT NULL,
    "office_name" TEXT NOT NULL DEFAULT 'Company Office',
    "office_latitude" DOUBLE PRECISION NOT NULL DEFAULT 28.6139,
    "office_longitude" DOUBLE PRECISION NOT NULL DEFAULT 77.2090,
    "allowed_radius" INTEGER NOT NULL DEFAULT 500,
    "office_start_time" TEXT NOT NULL DEFAULT '09:00',
    "office_end_time" TEXT NOT NULL DEFAULT '18:00',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "office_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_code_key" ON "employees"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_phone_key" ON "employees"("phone");

-- CreateIndex
CREATE INDEX "employees_email_idx" ON "employees"("email");

-- CreateIndex
CREATE INDEX "employees_employee_code_idx" ON "employees"("employee_code");

-- CreateIndex
CREATE INDEX "attendance_employee_id_idx" ON "attendance"("employee_id");

-- CreateIndex
CREATE INDEX "attendance_attendance_date_idx" ON "attendance"("attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_employee_id_attendance_date_key" ON "attendance"("employee_id", "attendance_date");

-- CreateIndex
CREATE INDEX "leave_requests_employee_id_idx" ON "leave_requests"("employee_id");

-- CreateIndex
CREATE INDEX "leave_requests_status_idx" ON "leave_requests"("status");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
