import React from "react";

export default function TicketFilters({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}: {
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
      <div>
        <label className="block text-sm font-medium mb-1">Filter by Status</label>
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Search by Subject</label>
        <input
          type="text"
          className="border rounded px-2 py-1"
          placeholder="Enter keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
