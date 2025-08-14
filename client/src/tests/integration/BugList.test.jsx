/**
 * Integration tests for BugList component
 * Tests API interactions, data fetching, and component behavior
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugList from '../../components/BugList';
import { bugAPI } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  bugAPI: {
    getAllBugs: jest.fn(),
    updateBugStatus: jest.fn(),
    deleteBug: jest.fn(),
  },
  handleAPIError: jest.fn()
}));

describe('BugList Integration Tests', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Login Button Not Working',
      description: 'The login button on the homepage does not respond to clicks',
      priority: 'High',
      status: 'Open',
      reportedBy: 'John Doe',
      createdAt: '2024-01-15T10:30:00.000Z'
    },
    {
      _id: '2',
      title: 'Slow Page Loading',
      description: 'The dashboard page takes more than 5 seconds to load',
      priority: 'Medium',
      status: 'In Progress',
      reportedBy: 'Jane Smith',
      createdAt: '2024-01-14T15:45:00.000Z'
    },
    {
      _id: '3',
      title: 'Minor UI Glitch',
      description: 'Small alignment issue in the footer',
      priority: 'Low',
      status: 'Resolved',
      reportedBy: 'Bob Johnson',
      createdAt: '2024-01-13T09:15:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    console.log('🧪 Setting up BugList integration test...');
  });

  describe('Data Fetching', () => {
    it('should fetch and display bugs on component mount', async () => {
      console.log('🧪 Testing initial data fetching...');
      
      // Mock successful API response
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 3,
        data: mockBugs
      });

      render(<BugList />);

      // Check loading state
      expect(screen.getByText('Loading bugs...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
        expect(screen.getByText('Slow Page Loading')).toBeInTheDocument();
        expect(screen.getByText('Minor UI Glitch')).toBeInTheDocument();
      });

      // Check that API was called with correct parameters
      expect(bugAPI.getAllBugs).toHaveBeenCalledWith({
        status: '',
        priority: '',
        sortBy: 'createdAt',
        order: 'desc'
      });

      // Check total count
      expect(screen.getByText('Total bugs: 3')).toBeInTheDocument();
      
      console.log('✅ Initial data fetching test passed');
    });

    it('should handle API errors gracefully', async () => {
      console.log('🧪 Testing API error handling...');
      
      // Mock API error
      const mockError = new Error('Network error');
      bugAPI.getAllBugs.mockRejectedValue(mockError);

      render(<BugList />);

      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByText('Error Loading Bugs')).toBeInTheDocument();
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });

      // Check for retry button
      expect(screen.getByRole('button', { name: /Try Again/ })).toBeInTheDocument();
      
      console.log('✅ API error handling test passed');
    });

    it('should show empty state when no bugs are returned', async () => {
      console.log('🧪 Testing empty state...');
      
      // Mock empty response
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 0,
        data: []
      });

      render(<BugList />);

      await waitFor(() => {
        expect(screen.getByText('No bugs found')).toBeInTheDocument();
        expect(screen.getByText('No bugs match your current filters.')).toBeInTheDocument();
      });
      
      console.log('✅ Empty state test passed');
    });
  });

  describe('Filtering', () => {
    it('should filter bugs by status', async () => {
      console.log('🧪 Testing status filtering...');
      
      const user = userEvent.setup();
      
      // Mock initial response
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 3,
        data: mockBugs
      });

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Change status filter
      const statusFilter = screen.getByLabelText(/Status:/);
      await user.selectOptions(statusFilter, 'Open');

      // Check that API was called with filter
      await waitFor(() => {
        expect(bugAPI.getAllBugs).toHaveBeenCalledWith({
          status: 'Open',
          priority: '',
          sortBy: 'createdAt',
          order: 'desc'
        });
      });
      
      console.log('✅ Status filtering test passed');
    });

    it('should filter bugs by priority', async () => {
      console.log('🧪 Testing priority filtering...');
      
      const user = userEvent.setup();
      
      // Mock initial response
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 3,
        data: mockBugs
      });

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Change priority filter
      const priorityFilter = screen.getByLabelText(/Priority:/);
      await user.selectOptions(priorityFilter, 'High');

      // Check that API was called with filter
      await waitFor(() => {
        expect(bugAPI.getAllBugs).toHaveBeenCalledWith({
          status: '',
          priority: 'High',
          sortBy: 'createdAt',
          order: 'desc'
        });
      });
      
      console.log('✅ Priority filtering test passed');
    });
  });

  describe('Sorting', () => {
    it('should sort bugs by title when clicking title header', async () => {
      console.log('🧪 Testing title sorting...');
      
      const user = userEvent.setup();
      
      // Mock initial response
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 3,
        data: mockBugs
      });

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Click title header to sort
      const titleHeader = screen.getByText(/Title/);
      await user.click(titleHeader);

      // Check that API was called with sort parameters
      await waitFor(() => {
        expect(bugAPI.getAllBugs).toHaveBeenCalledWith({
          status: '',
          priority: '',
          sortBy: 'title',
          order: 'desc'
        });
      });
      
      console.log('✅ Title sorting test passed');
    });

    it('should toggle sort order when clicking same header twice', async () => {
      console.log('🧪 Testing sort order toggle...');
      
      const user = userEvent.setup();
      
      // Mock responses
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 3,
        data: mockBugs
      });

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Click title header first time (should sort desc)
      const titleHeader = screen.getByText(/Title/);
      await user.click(titleHeader);

      await waitFor(() => {
        expect(bugAPI.getAllBugs).toHaveBeenCalledWith({
          status: '',
          priority: '',
          sortBy: 'title',
          order: 'desc'
        });
      });

      // Click title header second time (should sort asc)
      await user.click(titleHeader);

      await waitFor(() => {
        expect(bugAPI.getAllBugs).toHaveBeenCalledWith({
          status: '',
          priority: '',
          sortBy: 'title',
          order: 'asc'
        });
      });
      
      console.log('✅ Sort order toggle test passed');
    });
  });

  describe('Status Updates', () => {
    it('should update bug status when status dropdown is changed', async () => {
      console.log('🧪 Testing status update...');
      
      const user = userEvent.setup();
      
      // Mock responses
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 1,
        data: [mockBugs[0]]
      });

      bugAPI.updateBugStatus.mockResolvedValue({
        success: true,
        data: { ...mockBugs[0], status: 'In Progress' }
      });

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Find and change status dropdown
      const statusSelect = screen.getByDisplayValue('Open');
      await user.selectOptions(statusSelect, 'In Progress');

      // Check that API was called
      await waitFor(() => {
        expect(bugAPI.updateBugStatus).toHaveBeenCalledWith('1', 'In Progress');
      });
      
      console.log('✅ Status update test passed');
    });

    it('should handle status update errors', async () => {
      console.log('🧪 Testing status update error handling...');
      
      const user = userEvent.setup();
      
      // Mock responses
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 1,
        data: [mockBugs[0]]
      });

      bugAPI.updateBugStatus.mockRejectedValue(new Error('Update failed'));

      // Mock window.alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Try to update status
      const statusSelect = screen.getByDisplayValue('Open');
      await user.selectOptions(statusSelect, 'In Progress');

      // Check that error was handled
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Failed to update status: Update failed');
      });

      mockAlert.mockRestore();
      
      console.log('✅ Status update error handling test passed');
    });
  });

  describe('Bug Deletion', () => {
    it('should delete bug when delete button is clicked', async () => {
      console.log('🧪 Testing bug deletion...');
      
      const user = userEvent.setup();
      
      // Mock responses
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 1,
        data: [mockBugs[0]]
      });

      bugAPI.deleteBug.mockResolvedValue({
        success: true,
        data: mockBugs[0]
      });

      // Mock window.confirm
      const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => true);

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /🗑️/ });
      await user.click(deleteButton);

      // Check that confirmation was shown
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this bug?');

      // Check that API was called
      await waitFor(() => {
        expect(bugAPI.deleteBug).toHaveBeenCalledWith('1');
      });

      mockConfirm.mockRestore();
      
      console.log('✅ Bug deletion test passed');
    });

    it('should not delete bug when user cancels confirmation', async () => {
      console.log('🧪 Testing bug deletion cancellation...');
      
      const user = userEvent.setup();
      
      // Mock responses
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 1,
        data: [mockBugs[0]]
      });

      // Mock window.confirm to return false
      const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => false);

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /🗑️/ });
      await user.click(deleteButton);

      // Check that confirmation was shown
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this bug?');

      // Check that API was not called
      expect(bugAPI.deleteBug).not.toHaveBeenCalled();

      mockConfirm.mockRestore();
      
      console.log('✅ Bug deletion cancellation test passed');
    });
  });

  describe('Refresh Functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      console.log('🧪 Testing refresh functionality...');
      
      const user = userEvent.setup();
      
      // Mock responses
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 3,
        data: mockBugs
      });

      render(<BugList />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
      });

      // Click refresh button
      const refreshButton = screen.getByRole('button', { name: /🔄 Refresh/ });
      await user.click(refreshButton);

      // Check that API was called again
      await waitFor(() => {
        expect(bugAPI.getAllBugs).toHaveBeenCalledTimes(2);
      });
      
      console.log('✅ Refresh functionality test passed');
    });
  });

  describe('Data Display', () => {
    it('should display bug information correctly', async () => {
      console.log('🧪 Testing data display...');
      
      // Mock response
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 1,
        data: [mockBugs[0]]
      });

      render(<BugList />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Login Button Not Working')).toBeInTheDocument();
        expect(screen.getByText('The login button on the homepage does not respond to clicks')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Check priority badge styling
      const priorityBadge = screen.getByText('High');
      expect(priorityBadge).toHaveClass('priority-high');
      
      console.log('✅ Data display test passed');
    });

    it('should truncate long descriptions', async () => {
      console.log('🧪 Testing description truncation...');
      
      const longDescriptionBug = {
        ...mockBugs[0],
        description: 'This is a very long description that should be truncated when displayed in the table. It contains more than 100 characters to test the truncation functionality properly.'
      };

      // Mock response
      bugAPI.getAllBugs.mockResolvedValue({
        success: true,
        count: 1,
        data: [longDescriptionBug]
      });

      render(<BugList />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText(/This is a very long description that should be truncated/)).toBeInTheDocument();
        expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
      });
      
      console.log('✅ Description truncation test passed');
    });
  });
}); 