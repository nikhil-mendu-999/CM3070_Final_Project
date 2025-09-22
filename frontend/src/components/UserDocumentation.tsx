import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Accordion, AccordionSummary, 
  AccordionDetails, Chip, Alert, Button, Divider, List, ListItem, 
  ListItemIcon, ListItemText, Paper, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const UserDocumentation = () => {
  const [expandedPanel, setExpandedPanel] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" fontWeight={700} color="primary" mb={2}>
          Identity Platform User Guide
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          Complete documentation for managing your digital identity, profiles, and privacy settings
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          This guide covers all features of your Identity Platform. Use the sections below to find exactly what you need.
        </Alert>
      </Box>

      {/* Quick Start Card */}
      <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
            🚀 Quick Start Guide
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                New Users
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="1. Create your account" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="2. Set up your first profile" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="3. Choose your privacy settings" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="4. Connect social accounts (optional)" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Key Features
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Multiple Profiles" variant="outlined" />
                <Chip label="Context Management" variant="outlined" />
                <Chip label="Consent Control" variant="outlined" />
                <Chip label="Activity Monitoring" variant="outlined" />
                <Chip label="GDPR Compliance" variant="outlined" />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Documentation Sections */}
      
      {/* Getting Started */}
      <Accordion 
        expanded={expandedPanel === 'getting-started'} 
        onChange={handleAccordionChange('getting-started')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>Getting Started</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>Creating Your Account</Typography>
          <Typography paragraph>
            Welcome to your Identity Platform! Follow these detailed steps to get started:
          </Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Step 1: Sign Up</Typography>
            <Typography paragraph>
              1. Click "Create Account" on the landing page
              <br />2. Enter your email address and create a secure password
              <br />3. Verify your email address using the confirmation link
              <br />4. Complete the initial setup wizard
            </Typography>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Pro Tip:</strong> Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
            </Alert>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Step 2: Understanding the Dashboard</Typography>
            <Typography paragraph>
              Your dashboard is divided into several key sections:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText 
                  primary="Profiles" 
                  secondary="Create and manage multiple identity profiles for different contexts"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText 
                  primary="Contexts" 
                  secondary="Organize your profiles into meaningful groups (work, personal, etc.)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon /></ListItemIcon>
                <ListItemText 
                  primary="Account & Privacy" 
                  secondary="Manage your account settings and privacy preferences"
                />
              </ListItem>
            </List>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Profile Management */}
      <Accordion 
        expanded={expandedPanel === 'profiles'} 
        onChange={handleAccordionChange('profiles')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>Profile Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>Creating and Managing Profiles</Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>What are Profiles?</Typography>
            <Typography paragraph>
              Profiles are different versions of your identity that you can use in various contexts. 
              For example, you might have a "Professional" profile for work-related services and a 
              "Personal" profile for social media and entertainment platforms.
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Creating a New Profile</Typography>
            <Typography paragraph>
              <strong>Step 1:</strong> Navigate to the Profiles section in your dashboard
              <br /><strong>Step 2:</strong> Click the "Create New Profile" button
              <br /><strong>Step 3:</strong> Fill in the profile details:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Profile Name" 
                  secondary="A unique identifier for this profile (e.g., 'Work Profile')"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Label" 
                  secondary="A short, descriptive label (e.g., 'work', 'personal')"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Display Name" 
                  secondary="The name that will be shown to third-party applications"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Context" 
                  secondary="Choose which context this profile belongs to"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Visibility" 
                  secondary="Set to Private (only you can see) or Public (visible to approved apps)"
                />
              </ListItem>
            </List>
            <Typography paragraph>
              <strong>Step 4:</strong> Click "CREATE" to save your new profile
            </Typography>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>Important:</strong> You can always edit profile details later, but some changes may affect how third-party applications access your information.
            </Alert>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Profile Attributes</Typography>
            <Typography paragraph>
              Each profile can contain different personal information:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight={600}>Basic Information:</Typography>
                <List dense>
                  <ListItem>• Full Name</ListItem>
                  <ListItem>• Email Address</ListItem>
                  <ListItem>• Phone Number</ListItem>
                  <ListItem>• Date of Birth</ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight={600}>Additional Details:</Typography>
                <List dense>
                  <ListItem>• Gender</ListItem>
                  <ListItem>• Relationship Status</ListItem>
                  <ListItem>• Location</ListItem>
                  <ListItem>• Professional Info</ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Context Management */}
      <Accordion 
        expanded={expandedPanel === 'contexts'} 
        onChange={handleAccordionChange('contexts')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>Context Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>Understanding Contexts</Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography paragraph>
              Contexts help you organize your profiles into meaningful groups. Think of contexts as 
              different areas of your life where you might want to present different aspects of your identity.
            </Typography>
            
            <Typography variant="h6" fontWeight={600} mb={2}>Common Context Examples:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">Professional</Typography>
                    <Typography variant="body2">
                      Work-related profiles with business email, LinkedIn, professional achievements
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">Personal</Typography>
                    <Typography variant="body2">
                      Social profiles with personal interests, hobbies, casual information
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">Educational</Typography>
                    <Typography variant="body2">
                      Academic profiles for learning platforms, courses, certifications
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Creating a New Context</Typography>
            <Typography paragraph>
              <strong>Step 1:</strong> Go to the Contexts section
              <br /><strong>Step 2:</strong> Click "Create New Context"
              <br /><strong>Step 3:</strong> Enter a meaningful name (e.g., "Work", "Personal", "Gaming")
              <br /><strong>Step 4:</strong> Add a description explaining what this context is for
              <br /><strong>Step 5:</strong> Save your new context
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Privacy & Security */}
      <Accordion 
        expanded={expandedPanel === 'privacy'} 
        onChange={handleAccordionChange('privacy')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>Privacy & Security</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>Controlling Your Privacy</Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Profile Visibility Settings</Typography>
            <Typography paragraph>
              Each profile has two visibility options:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><SecurityIcon color="error" /></ListItemIcon>
                <ListItemText 
                  primary="Private" 
                  secondary="Only you can see this profile. No third-party applications can access it unless you explicitly grant permission."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SecurityIcon color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Public" 
                  secondary="This profile can be shared with third-party applications when you give consent."
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Managing Consent</Typography>
            <Typography paragraph>
              The "My Consents" section shows all applications that have access to your information:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="View Active Consents" 
                  secondary="See which apps currently have access to your profiles"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Revoke Access" 
                  secondary="Remove an application's access to your information at any time"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Monitor Usage" 
                  secondary="Track when and how your information is being accessed"
                />
              </ListItem>
            </List>

            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Your Rights:</strong> You can revoke consent for any application at any time. This will immediately stop that app from accessing your information.
            </Alert>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Activity Monitoring */}
      <Accordion 
        expanded={expandedPanel === 'activity'} 
        onChange={handleAccordionChange('activity')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <InfoIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>Activity Monitoring</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>Understanding Your Activity Log</Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography paragraph>
              Your Activity Log shows a complete history of actions taken on your account:
            </Typography>
            
            <Typography variant="h6" fontWeight={600} mb={2}>Types of Activities Logged:</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Profile Updates" 
                  secondary="When you create, edit, or delete profiles"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Context Changes" 
                  secondary="When you create or modify contexts"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Consent Actions" 
                  secondary="When you grant or revoke access to third-party applications"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Login Activity" 
                  secondary="When you sign in to your account"
                />
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Reading Activity Entries</Typography>
            <Typography paragraph>
              Each activity entry shows:
            </Typography>
            <List dense>
              <ListItem>• <strong>When:</strong> Date and time of the action</ListItem>
              <ListItem>• <strong>Action:</strong> What type of action was performed</ListItem>
              <ListItem>• <strong>Target:</strong> What was affected by the action</ListItem>
              <ListItem>• <strong>Details:</strong> Additional context about the change</ListItem>
            </List>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* GDPR & Compliance */}
      <Accordion 
        expanded={expandedPanel === 'gdpr'} 
        onChange={handleAccordionChange('gdpr')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={600}>GDPR & Data Rights</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>Your Data Rights</Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography paragraph>
              Under GDPR and other privacy regulations, you have several important rights regarding your personal data:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={600} mb={1}>Right to Access</Typography>
                <Typography paragraph>
                  You can view all your personal data at any time through your dashboard.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={600} mb={1}>Right to Portability</Typography>
                <Typography paragraph>
                  Export your data in a machine-readable format using the "Export My Data" button.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={600} mb={1}>Right to Rectification</Typography>
                <Typography paragraph>
                  Edit or correct your personal information at any time through profile management.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={600} mb={1}>Right to Erasure</Typography>
                <Typography paragraph>
                  Delete your account and all associated data using the "Delete My Account" option.
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>Account Deletion</Typography>
            <Typography>
              Deleting your account is permanent and irreversible. All your profiles, contexts, and activity history will be permanently removed from our systems within 30 days.
            </Typography>
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* Troubleshooting */}
      <Accordion 
        expanded={expandedPanel === 'troubleshooting'} 
        onChange={handleAccordionChange('troubleshooting')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <WarningIcon sx={{ mr: 2, color: 'warning.main' }} />
          <Typography variant="h5" fontWeight={600}>Troubleshooting & FAQ</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" fontWeight={600} mb={2}>Common Issues and Solutions</Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Can't Create a New Profile?</Typography>
            <List>
              <ListItem>• Ensure all required fields are filled out</ListItem>
              <ListItem>• Check that the profile name is unique</ListItem>
              <ListItem>• Verify you haven't reached the profile limit</ListItem>
              <ListItem>• Try refreshing the page and attempting again</ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Application Not Showing in Consents?</Typography>
            <List>
              <ListItem>• The app may not have requested access yet</ListItem>
              <ListItem>• Check if you denied the initial consent request</ListItem>
              <ListItem>• Contact the application's support team</ListItem>
              <ListItem>• Try logging out and back in to your account</ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Forgot Your Password?</Typography>
            <List>
              <ListItem>• Click "Forgot Password" on the login page</ListItem>
              <ListItem>• Enter your email address</ListItem>
              <ListItem>• Check your email for a reset link</ListItem>
              <ListItem>• Follow the instructions to create a new password</ListItem>
            </List>
          </Paper>

          <Alert severity="info">
            <Typography variant="h6" fontWeight={600}>Need More Help?</Typography>
            <Typography>
              If you're still experiencing issues, please contact our support team at support@identityplatform.com 
              with a detailed description of the problem.
            </Typography>
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* Footer */}
      <Box textAlign="center" mt={6} p={3}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary">
          Last updated: September 2025 | Identity Platform v2.0
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          For additional support, contact us at support@identityplatform.com
        </Typography>
      </Box>
    </Box>
  );
};

export default UserDocumentation;
