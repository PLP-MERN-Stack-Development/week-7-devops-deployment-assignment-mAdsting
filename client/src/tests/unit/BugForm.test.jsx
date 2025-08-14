/**
 * Unit tests for BugForm component
 * Tests form rendering, validation, submission, and error handling
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from '../../components/BugForm';
import { bugAPI } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  bugAPI: {
    createBug: jest.fn(),
    createNewBug: jest.fn(), // This is the intentional bug - wrong method name
  },
  handleAPIError: jest.fn()
}));

describe('BugForm Component', () => {
  const mockOnBugCreated = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    console.log('🧪 Setting up BugForm test...');
  });

  describe('Rendering', () => {
    it('should render the form with all required fields', () => {
      console.log('🧪 Testing form rendering...');
      
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      // Check for form elements
      expect(screen.getByText('🐛 Report New Bug')).toBeInTheDocument();
      expect(screen.getByText('Fill out the form below to report a new bug')).toBeInTheDocument();
      
      // Check for form fields
      expect(screen.getByLabelText(/Bug Title/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Priority/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Reported By/)).toBeInTheDocument();
      
      // Check for buttons
      expect(screen.getByRole('button', { name: /Create Bug/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
      
      console.log('✅ Form rendering test passed');
    });

    it('should render without cancel button when onCancel is not provided', () => {
      console.log('🧪 Testing form without cancel button...');
      
      render(<BugForm onBugCreated={mockOnBugCreated} />);

      expect(screen.getByRole('button', { name: /Create Bug/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset/ })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Cancel/ })).not.toBeInTheDocument();
      
      console.log('✅ Optional cancel button test passed');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      console.log('🧪 Testing form validation for empty fields...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /Create Bug/ });
      await user.click(submitButton);

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
        expect(screen.getByText('Description is required')).toBeInTheDocument();
        expect(screen.getByText('Reporter name is required')).toBeInTheDocument();
      });
      
      console.log('✅ Empty field validation test passed');
    });

    it('should show validation error for title exceeding 100 characters', async () => {
      console.log('🧪 Testing title length validation...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Bug Title/);
      const longTitle = 'a'.repeat(101); // 101 characters
      
      await user.type(titleInput, longTitle);
      
      const submitButton = screen.getByRole('button', { name: /Create Bug/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title cannot exceed 100 characters')).toBeInTheDocument();
      });
      
      console.log('✅ Title length validation test passed');
    });

    it('should show validation error for description exceeding 1000 characters', async () => {
      console.log('🧪 Testing description length validation...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      const descriptionInput = screen.getByLabelText(/Description/);
      const longDescription = 'a'.repeat(1001); // 1001 characters
      
      await user.type(descriptionInput, longDescription);
      
      const submitButton = screen.getByRole('button', { name: /Create Bug/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Description cannot exceed 1000 characters')).toBeInTheDocument();
      });
      
      console.log('✅ Description length validation test passed');
    });

    it('should show validation error for reporter name exceeding 50 characters', async () => {
      console.log('🧪 Testing reporter name length validation...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      const reporterInput = screen.getByLabelText(/Reported By/);
      const longName = 'a'.repeat(51); // 51 characters
      
      await user.type(reporterInput, longName);
      
      const submitButton = screen.getByRole('button', { name: /Create Bug/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Reporter name cannot exceed 50 characters')).toBeInTheDocument();
      });
      
      console.log('✅ Reporter name length validation test passed');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data successfully', async () => {
      console.log('🧪 Testing successful form submission...');
      
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          _id: '123',
          title: 'Test Bug',
          description: 'Test Description',
          priority: 'Medium',
          status: 'Open',
          reportedBy: 'Test User'
        }
      };

      // Mock successful API call
      bugAPI.createNewBug.mockResolvedValue(mockResponse);

      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      // Fill out the form
      await user.type(screen.getByLabelText(/Bug Title/), 'Test Bug');
      await user.type(screen.getByLabelText(/Description/), 'Test Description');
      await user.type(screen.getByLabelText(/Reported By/), 'Test User');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /Create Bug/ });
      await user.click(submitButton);

      // Wait for API call and success message
      await waitFor(() => {
        expect(bugAPI.createNewBug).toHaveBeenCalledWith({
          title: 'Test Bug',
          description: 'Test Description',
          priority: 'Medium',
          reportedBy: 'Test User'
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Bug created successfully! 🎉')).toBeInTheDocument();
      });

      // Check if callback was called
      expect(mockOnBugCreated).toHaveBeenCalledWith(mockResponse.data);
      
      console.log('✅ Successful submission test passed');
    });

    it('should handle API errors gracefully', async () => {
      console.log('🧪 Testing API error handling...');
      
      const user = userEvent.setup();
      const mockError = new Error('API Error');

      // Mock failed API call
      bugAPI.createNewBug.mockRejectedValue(mockError);

      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      // Fill out the form
      await user.type(screen.getByLabelText(/Bug Title/), 'Test Bug');
      await user.type(screen.getByLabelText(/Description/), 'Test Description');
      await user.type(screen.getByLabelText(/Reported By/), 'Test User');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /Create Bug/ });
      await user.click(submitButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/Failed to create bug/)).toBeInTheDocument();
      });

      // Check that callback was not called
      expect(mockOnBugCreated).not.toHaveBeenCalled();
      
      console.log('✅ API error handling test passed');
    });

    it('should disable form during submission', async () => {
      console.log('🧪 Testing form disabled state during submission...');
      
      const user = userEvent.setup();
      
      // Mock API call that takes time
      bugAPI.createNewBug.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      // Fill out the form
      await user.type(screen.getByLabelText(/Bug Title/), 'Test Bug');
      await user.type(screen.getByLabelText(/Description/), 'Test Description');
      await user.type(screen.getByLabelText(/Reported By/), 'Test User');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /Create Bug/ });
      await user.click(submitButton);

      // Check that form is disabled during submission
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button', { name: /Creating.../ })).toBeInTheDocument();
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      console.log('✅ Form disabled state test passed');
    });
  });

  describe('Form Reset', () => {
    it('should reset form fields when reset button is clicked', async () => {
      console.log('🧪 Testing form reset functionality...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      // Fill out the form
      await user.type(screen.getByLabelText(/Bug Title/), 'Test Bug');
      await user.type(screen.getByLabelText(/Description/), 'Test Description');
      await user.type(screen.getByLabelText(/Reported By/), 'Test User');

      // Click reset button
      const resetButton = screen.getByRole('button', { name: /Reset/ });
      await user.click(resetButton);

      // Check that fields are cleared
      expect(screen.getByLabelText(/Bug Title/)).toHaveValue('');
      expect(screen.getByLabelText(/Description/)).toHaveValue('');
      expect(screen.getByLabelText(/Reported By/)).toHaveValue('');
      expect(screen.getByLabelText(/Priority/)).toHaveValue('Medium');
      
      console.log('✅ Form reset test passed');
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      console.log('🧪 Testing cancel functionality...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      // Click cancel button
      const cancelButton = screen.getByRole('button', { name: /Cancel/ });
      await user.click(cancelButton);

      // Check that onCancel was called
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      
      console.log('✅ Cancel functionality test passed');
    });
  });

  describe('Character Count', () => {
    it('should display character count for description', async () => {
      console.log('🧪 Testing character count display...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      const descriptionInput = screen.getByLabelText(/Description/);
      
      // Check initial count
      expect(screen.getByText('0/1000 characters')).toBeInTheDocument();
      
      // Type some text
      await user.type(descriptionInput, 'Hello World');
      
      // Check updated count
      expect(screen.getByText('11/1000 characters')).toBeInTheDocument();
      
      console.log('✅ Character count test passed');
    });
  });

  describe('Priority Selection', () => {
    it('should allow changing priority selection', async () => {
      console.log('🧪 Testing priority selection...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      const prioritySelect = screen.getByLabelText(/Priority/);
      
      // Check default value
      expect(prioritySelect).toHaveValue('Medium');
      
      // Change to High
      await user.selectOptions(prioritySelect, 'High');
      expect(prioritySelect).toHaveValue('High');
      
      // Change to Low
      await user.selectOptions(prioritySelect, 'Low');
      expect(prioritySelect).toHaveValue('Low');
      
      console.log('✅ Priority selection test passed');
    });
  });

  describe('Error Clearing', () => {
    it('should clear validation errors when user starts typing', async () => {
      console.log('🧪 Testing error clearing on input...');
      
      const user = userEvent.setup();
      render(<BugForm onBugCreated={mockOnBugCreated} onCancel={mockOnCancel} />);

      // Submit empty form to trigger errors
      const submitButton = screen.getByRole('button', { name: /Create Bug/ });
      await user.click(submitButton);

      // Check that errors are shown
      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });

      // Start typing in title field
      const titleInput = screen.getByLabelText(/Bug Title/);
      await user.type(titleInput, 'Test');

      // Check that title error is cleared
      await waitFor(() => {
        expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
      });
      
      console.log('✅ Error clearing test passed');
    });
  });
}); 