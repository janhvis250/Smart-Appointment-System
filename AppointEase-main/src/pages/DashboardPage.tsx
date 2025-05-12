import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, Clock, Filter, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserAppointments,
  AppointmentWithDetails,
} from "../services/appointmentService";
import AppointmentCard from "../components/AppointmentCard";
import LoadingSpinner from "../components/LoadingSpinner";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "past" | "pending" | "confirmed" | "cancelled"
  >("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        if (user) {
          const userAppointments = await getUserAppointments(user.id);
          setAppointments(userAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const refreshAppointments = async () => {
    try {
      setIsLoading(true);
      if (user) {
        const userAppointments = await getUserAppointments(user.id);
        setAppointments(userAppointments);
      }
    } catch (error) {
      console.error("Error refreshing appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAppointments = () => {
    if (filter === "all") return appointments;

    const now = new Date();

    if (filter === "upcoming") {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(
          `${appointment.timeSlot.date}T${appointment.timeSlot.startTime}`
        );
        return appointmentDate > now && appointment.status !== "cancelled";
      });
    }

    if (filter === "past") {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(
          `${appointment.timeSlot.date}T${appointment.timeSlot.startTime}`
        );
        return appointmentDate < now || appointment.status === "completed";
      });
    }

    return appointments.filter((appointment) => appointment.status === filter);
  };

  const filteredAppointments = filterAppointments();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your scheduled appointments
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Link to="/booking" className="btn btn-primary">
            <CalendarPlus className="h-5 w-5 mr-2" />
            Book New Appointment
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <Clock className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Appointment History
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
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={refreshAppointments}
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
              <CalendarPlus className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No appointments found
              </h3>
              <p className="mt-1 text-gray-500">
                {filter === "all"
                  ? "You don't have any appointments yet."
                  : `You don't have any ${filter} appointments.`}
              </p>
              {filter === "all" && (
                <div className="mt-6">
                  <Link to="/booking" className="btn btn-primary">
                    Book Your First Appointment
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
