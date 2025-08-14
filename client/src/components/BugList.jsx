import React, { useState, useEffect } from 'react';
import { bugAPI, handleAPIError } from '../services/api';

/**
 * BugList Component
 * Displays all bugs in a table format with filtering, sorting, and actions
 * Includes status updates, deletion, and comprehensive error handling
 */
const BugList = () => {
  // State management
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    source: '',
    assignedTo: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  /**
   * Fetch bugs from API
   */
  const fetchBugs = async () => {
    console.log('🔍 Fetching bugs...');
    setLoading(true);
    setError(null);

    try {
      const params = {
        ...filters,
        sortBy,
        order: sortOrder
      };

      console.log('📋 Fetch params:', params);
      const response = await bugAPI.getAllBugs(params);
      
      console.log('✅ Bugs fetched successfully:', response.data);
      setBugs(response.data);
      
    } catch (err) {
      console.error('❌ Error fetching bugs:', err);
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update bug status
   * @param {string} bugId - Bug ID
   * @param {string} newStatus - New status
   */
  const handleStatusUpdate = async (bugId, newStatus) => {
    console.log('🔄 Updating bug status:', { bugId, newStatus });
    
    try {
      const response = await bugAPI.updateBugStatus(bugId, newStatus);
      
      console.log('✅ Status updated successfully:', response);
      
      // Update local state
      setBugs(prevBugs => 
        prevBugs.map(bug => 
          bug._id === bugId 
            ? { ...bug, status: newStatus }
            : bug
        )
      );
      
    } catch (err) {
      console.error('❌ Error updating status:', err);
      const errorMessage = handleAPIError(err);
      alert(`Failed to update status: ${errorMessage}`);
    }
  };

  /**
   * Delete a bug
   * @param {string} bugId - Bug ID
   */
  const handleDeleteBug = async (bugId) => {
    console.log('🗑️ Deleting bug:', bugId);
    
    if (!window.confirm('Are you sure you want to delete this bug?')) {
      return;
    }

    try {
      await bugAPI.deleteBug(bugId);
      
      console.log('✅ Bug deleted successfully');
      
      // Remove from local state
      setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId));
      
    } catch (err) {
      console.error('❌ Error deleting bug:', err);
      const errorMessage = handleAPIError(err);
      alert(`Failed to delete bug: ${errorMessage}`);
    }
  };

  /**
   * Handle filter changes
   * @param {Event} e - Change event
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log('🔧 Filter changed:', { name, value });
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle sort changes
   * @param {string} field - Field to sort by
   */
  const handleSort = (field) => {
    console.log('📊 Sorting by:', field);
    
    if (sortBy === field) {
      // Toggle order if same field
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  /**
   * Get priority badge styling
   * @param {string} priority - Priority level
   * @returns {string} CSS class name
   */
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  /**
   * Get status badge styling
   * @param {string} status - Status value
   * @returns {string} CSS class name
   */
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open':
        return 'status-open';
      case 'In Progress':
        return 'status-progress';
      case 'Resolved':
        return 'status-resolved';
      default:
        return 'status-open';
    }
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch bugs on component mount and when filters/sort change
  useEffect(() => {
    fetchBugs();
  }, [filters, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🔄</div>
        <p>Loading bugs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h3>Error Loading Bugs</h3>
        <p>{error}</p>
        <button onClick={fetchBugs} className="retry-button">
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bug-list-container">
      <div className="list-header">
        <h2>🐛 Bug List</h2>
        <p>Total bugs: {bugs.length}</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">Priority:</label>
          <select
            id="priority-filter"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="source-filter">Source:</label>
          <select
            id="source-filter"
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Sources</option>
            <option value="internal">Internal</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="assignee-filter">Assignee:</label>
          <input
            id="assignee-filter"
            name="assignedTo"
            value={filters.assignedTo}
            onChange={handleFilterChange}
            className="filter-select"
            placeholder="Filter by assignee"
          />
        </div>

        <button onClick={fetchBugs} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      {/* Bugs Table */}
      {bugs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No bugs found</h3>
          <p>No bugs match your current filters.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="bugs-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('title')} className="sortable">
                  Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Description</th>
                <th onClick={() => handleSort('priority')} className="sortable">
                  Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Reporter</th>
                <th>Assignee</th>
                <th>Source</th>
                <th onClick={() => handleSort('createdAt')} className="sortable">
                  Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map(bug => (
                <tr key={bug._id} className="bug-row">
                  <td className="bug-title">{bug.title}</td>
                  <td className="bug-description">
                    {bug.description.length > 100 
                      ? `${bug.description.substring(0, 100)}...` 
                      : bug.description
                    }
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityBadgeClass(bug.priority)}`}>
                      {bug.priority}
                    </span>
                  </td>
                  <td>
                    <select
                      value={bug.status}
                      onChange={(e) => handleStatusUpdate(bug._id, e.target.value)}
                      className={`status-select ${getStatusBadgeClass(bug.status)}`}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="bug-reporter">{bug.reportedBy}</td>
                  <td>{bug.assignedTo || '-'}</td>
                  <td>{bug.source === 'customer' ? 'Customer' : 'Internal'}</td>
                  <td className="bug-date">{formatDate(bug.createdAt)}</td>
                  <td className="bug-actions">
                    <button
                      onClick={() => handleDeleteBug(bug._id)}
                      className="delete-button"
                      title="Delete bug"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .bug-list-container {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .list-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .list-header h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .list-header p {
          color: #718096;
          margin: 0;
        }

        .filters-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: end;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 600;
          color: #2d3748;
          font-size: 0.875rem;
        }

        .filter-select {
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.875rem;
          min-width: 120px;
        }

        .refresh-button {
          padding: 0.5rem 1rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .refresh-button:hover {
          background: #3182ce;
          transform: translateY(-1px);
        }

        .loading-container,
        .error-container,
        .empty-state {
          text-align: center;
          padding: 3rem;
        }

        .loading-spinner,
        .error-icon,
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .retry-button {
          padding: 0.75rem 1.5rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 1rem;
        }

        .table-container {
          overflow-x: auto;
        }

        .bugs-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .bugs-table th,
        .bugs-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .bugs-table th {
          background: #f7fafc;
          font-weight: 600;
          color: #2d3748;
          position: sticky;
          top: 0;
        }

        .sortable {
          cursor: pointer;
          user-select: none;
        }

        .sortable:hover {
          background: #edf2f7;
        }

        .bug-row:hover {
          background: #f7fafc;
        }

        .bug-title {
          font-weight: 600;
          color: #2d3748;
          max-width: 200px;
        }

        .bug-description {
          max-width: 300px;
          color: #4a5568;
        }

        .bug-reporter {
          color: #718096;
          font-size: 0.875rem;
        }

        .bug-date {
          color: #718096;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .priority-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-high {
          background: #fed7d7;
          color: #742a2a;
        }

        .priority-medium {
          background: #fef5e7;
          color: #744210;
        }

        .priority-low {
          background: #c6f6d5;
          color: #22543d;
        }

        .status-select {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }

        .status-open {
          background: #bee3f8;
          color: #2a4365;
        }

        .status-progress {
          background: #fef5e7;
          color: #744210;
        }

        .status-resolved {
          background: #c6f6d5;
          color: #22543d;
        }

        .bug-actions {
          text-align: center;
        }

        .delete-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .delete-button:hover {
          background: #fed7d7;
          transform: scale(1.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .bug-list-container {
            padding: 1rem;
          }

          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-select {
            min-width: auto;
          }

          .bugs-table {
            font-size: 0.875rem;
          }

          .bugs-table th,
          .bugs-table td {
            padding: 0.5rem;
          }

          .bug-title,
          .bug-description {
            max-width: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default BugList; 