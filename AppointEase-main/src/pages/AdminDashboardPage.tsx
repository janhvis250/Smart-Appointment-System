import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Clock,
  Filter,
  RefreshCw,
  ChevronRight,
  BarChart3,
  CheckSquare,
  XSquare,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getAllAppointments,
  AppointmentWithDetails,
  updateAppointmentStatus,
} from "../services/appointmentService";
import { toast } from "react-hot-toast";

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    | "all"
    | "today"
    | "upcoming"
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
  >("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const allAppointments = await getAllAppointments();
      setAppointments(allAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      setIsUpdating(true);
      setUpdatingId(id);
      await updateAppointmentStatus(id, status);

      // Update local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status } : appointment
        )
      );

      toast.success(`Appointment status updated to ${status}`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setIsUpdating(false);
      setUpdatingId(null);
    }
  };

  const filterAppointments = () => {
    if (filter === "all") return appointments;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "today") {
      const todayStr = today.toISOString().split("T")[0];
      return appointments.filter(
        (appointment) => appointment.timeSlot.date === todayStr
      );
    }

    if (filter === "upcoming") {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(
          `${appointment.timeSlot.date}T00:00:00`
        );
        return appointmentDate >= today && appointment.status !== "cancelled";
      });
    }

    return appointments.filter((appointment) => appointment.status === filter);
  };

  const filteredAppointments = filterAppointments();

  // Calculate stats
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  ).length;
  const confirmedAppointments = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled"
  ).length;

  // Get today's appointments
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (a) => a.timeSlot.date === today
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage appointments, users, and time slots
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Link to="/admin/users" className="btn btn-secondary">
            <Users className="h-5 w-5 mr-2" />
            Manage Users
          </Link>
          <Link to="/admin/slots" className="btn btn-secondary">
            <Calendar className="h-5 w-5 mr-2" />
            Manage Time Slots
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-indigo-100 p-3 mr-4">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="text-2xl font-bold">{totalAppointments}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold">{pendingAppointments}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CheckSquare className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold">{confirmedAppointments}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <ClipboardList className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">{completedAppointments}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <XSquare className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold">{cancelledAppointments}</p>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Today's Appointments
            </h2>
          </div>

          <div className="text-sm text-gray-500">
            {todayAppointments.length} appointment(s) scheduled for today
          </div>
        </div>

        <div className="p-4">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments scheduled for today
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.userEmail}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.service.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.service.duration} min
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.timeSlot.startTime} -{" "}
                          {appointment.timeSlot.endTime}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "completed"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          {appointment.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "confirmed")
                              }
                              disabled={
                                isUpdating && updatingId === appointment.id
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              {isUpdating && updatingId === appointment.id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                "Confirm"
                              )}
                            </button>
                          )}

                          {(appointment.status === "pending" ||
                            appointment.status === "confirmed") && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "completed")
                              }
                              disabled={
                                isUpdating && updatingId === appointment.id
                              }
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {isUpdating && updatingId === appointment.id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                "Complete"
                              )}
                            </button>
                          )}

                          {appointment.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "cancelled")
                              }
                              disabled={
                                isUpdating && updatingId === appointment.id
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              {isUpdating && updatingId === appointment.id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                "Cancel"
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* All Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <ClipboardList className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              All Appointments
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="form-input py-1 text-sm"
              >
                <option value="all">All appointments</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={fetchAppointments}
              className="btn btn-outline py-1 px-3 text-sm flex items-center"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="large" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No appointments found
              </h3>
              <p className="mt-1 text-gray-500">
                No appointments match the current filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.userEmail}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.service.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.service.duration} min
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(
                            appointment.timeSlot.date
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.timeSlot.startTime} -{" "}
                          {appointment.timeSlot.endTime}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "completed"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          {appointment.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "confirmed")
                              }
                              disabled={
                                isUpdating && updatingId === appointment.id
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              {isUpdating && updatingId === appointment.id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                "Confirm"
                              )}
                            </button>
                          )}

                          {(appointment.status === "pending" ||
                            appointment.status === "confirmed") && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "completed")
                              }
                              disabled={
                                isUpdating && updatingId === appointment.id
                              }
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {isUpdating && updatingId === appointment.id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                "Complete"
                              )}
                            </button>
                          )}

                          {appointment.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "cancelled")
                              }
                              disabled={
                                isUpdating && updatingId === appointment.id
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              {isUpdating && updatingId === appointment.id ? (
                                <LoadingSpinner size="small" />
                              ) : (
                                "Cancel"
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
