import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profiles from 'src/components/Profiles';
import * as api from 'src/api';

// Mock the API module
jest.mock('src/api');

const mockGetProfiles = api.getProfiles;
const mockCreateProfile = api.createProfile;
const mockDeleteProfile = api.deleteProfile;
const mockGetContexts = api.getContexts;

describe('Profiles UI', () => {
  beforeEach(() => {
    mockGetProfiles.mockResolvedValue([
      {
        id: 1,
        label: 'Demo',
        displayName: 'Demonstrator',
        visibility: 'public',
        profilePicture: '',
        gender: 'Man',
        sexuality: 'Straight',
        relationshipStatus: 'Single',
        context: '',
        createdAt: new Date()
      }
    ]);
    mockGetContexts.mockResolvedValue([{ id: 1, name: 'TestCtx' }]);
    mockCreateProfile.mockResolvedValue({ success: true });
    mockDeleteProfile.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile list and create form', async () => {
    render(<Profiles token="dummy" userId={42} />);
    expect(await screen.findByText(/Your Profiles/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Create new profile form')).toBeInTheDocument();
  });

  it('can create a new profile', async () => {
    render(<Profiles token="dummy" userId={42} />);
    // Query all textboxes and fill in by position
    const inputs = await screen.findAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'TestUser1' } });      // Profile Name
    fireEvent.change(inputs[1], { target: { value: 'LabelX' } });         // Label
    fireEvent.change(inputs[2], { target: { value: 'DisplayNameX' } });   // Display Name
    fireEvent.click(await screen.findByLabelText('Create profile'));
    await waitFor(() => {
      expect(mockCreateProfile).toHaveBeenCalled();
      expect(screen.getByText('Profile created.')).toBeInTheDocument();
    });
  });

  it('can delete a profile', async () => {
    window.confirm = () => true;
    render(<Profiles token="dummy" userId={42} />);
    const deleteBtns = await screen.findAllByLabelText('Delete profile');
    fireEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(mockDeleteProfile).toHaveBeenCalled();
      expect(screen.getByText('Profile deleted.')).toBeInTheDocument();
    });
  });
});
