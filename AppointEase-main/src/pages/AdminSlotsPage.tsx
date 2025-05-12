import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  PlusCircle,
  Check,
  X,
  RefreshCw,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  TimeSlot,
  getAvailableTimeSlots,
  createTimeSlot,
  updateTimeSlotAvailability,
} from "../services/appointmentService";

const AdminSlotsPage: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "unavailable">(
    "all"
  );

  // Form state for creating new time slot
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotStartTime, setNewSlotStartTime] = useState("");
  const [newSlotEndTime, setNewSlotEndTime] = useState("");

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true);
      // Get all time slots (both available and unavailable)
      const slots = await getAvailableTimeSlots();

      // Sort by date and time
      slots.sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
      });

      setTimeSlots(slots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast.error("Failed to load time slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSlotDate || !newSlotStartTime || !newSlotEndTime) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate start time is before end time
    if (newSlotStartTime >= newSlotEndTime) {
      toast.error("Start time must be before end time");
      return;
    }

    try {
      setIsCreating(true);
      const newSlot = await createTimeSlot(
        newSlotDate,
        newSlotStartTime,
        newSlotEndTime
      );

      // Update local state
      setTimeSlots((prevSlots) =>
        [...prevSlots, newSlot].sort((a, b) => {
          if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
          }
          return a.startTime.localeCompare(b.startTime);
        })
      );

      // Reset form
      setNewSlotDate("");
      setNewSlotStartTime("");
      setNewSlotEndTime("");

      toast.success("Time slot created successfully");
    } catch (error) {
      console.error("Error creating time slot:", error);
      toast.error("Failed to create time slot");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleAvailability = async (
    id: string,
    currentAvailability: boolean
  ) => {
    try {
      setIsUpdating(true);
      setUpdatingId(id);

      await updateTimeSlotAvailability(id, !currentAvailability);

      // Update local state
      setTimeSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot.id === id ? { ...slot, isAvailable: !currentAvailability } : slot
        )
      );

      toast.success(
        `Time slot ${
          !currentAvailability ? "enabled" : "disabled"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating time slot:", error);
      toast.error("Failed to update time slot");
    } finally {
      setIsUpdating(false);
      setUpdatingId(null);
    }
  };

  const filteredTimeSlots = () => {
    if (filter === "all") return timeSlots;
    if (filter === "available")
      return timeSlots.filter((slot) => slot.isAvailable);
    return timeSlots.filter((slot) => !slot.isAvailable);
  };

  // Group time slots by date
  const groupedTimeSlots = () => {
    const grouped: { [date: string]: TimeSlot[] } = {};

    filteredTimeSlots().forEach((slot) => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });

    return grouped;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/admin"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Admin Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Time Slot Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage available appointment time slots
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Time Slot Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <PlusCircle className="h-5 w-5 text-indigo-600 mr-2" />
            Create New Time Slot
          </h2>

          <form onSubmit={handleCreateTimeSlot}>
            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="form-input"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Min date is today
                  required
                />
              </div>

              <div>
                <label htmlFor="startTime" className="form-label">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  className="form-input"
                  value={newSlotStartTime}
                  onChange={(e) => setNewSlotStartTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="endTime" className="form-label">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  className="form-input"
                  value={newSlotEndTime}
                  onChange={(e) => setNewSlotEndTime(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isCreating}
              >
                {isCreating ? (
                  <LoadingSpinner size="small" className="text-white" />
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Time Slot
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Time Slots List */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-3 sm:mb-0">
              <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Time Slots</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="form-input py-1 text-sm"
                >
                  <option value="all">All slots</option>
                  <option value="available">Available only</option>
                  <option value="unavailable">Unavailable only</option>
                </select>
              </div>

              <button
                onClick={fetchTimeSlots}
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
            ) : filteredTimeSlots().length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No time slots found
                </h3>
                <p className="mt-1 text-gray-500">
                  {filter === "all"
                    ? "You haven't created any time slots yet."
                    : `No ${filter} time slots found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedTimeSlots()).map(([date, slots]) => (
                  <div key={date} className="border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b font-medium">
                      {formatDate(date)}
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {slots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`border rounded-md p-3 ${
                              slot.isAvailable
                                ? "border-green-200 bg-green-50"
                                : "border-red-200 bg-red-50"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {slot.startTime} - {slot.endTime}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {slot.isAvailable
                                    ? "Available"
                                    : "Unavailable"}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleToggleAvailability(
                                    slot.id,
                                    slot.isAvailable
                                  )
                                }
                                disabled={isUpdating && updatingId === slot.id}
                                className={`p-1 rounded-full ${
                                  slot.isAvailable
                                    ? "text-red-600 hover:bg-red-100"
                                    : "text-green-600 hover:bg-green-100"
                                }`}
                              >
                                {isUpdating && updatingId === slot.id ? (
                                  <LoadingSpinner size="small" />
                                ) : slot.isAvailable ? (
                                  <X className="h-5 w-5" />
                                ) : (
                                  <Check className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSlotsPage;
