import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Pagination, Snackbar, Alert, CircularProgress, AppBar, Toolbar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useCallback } from 'react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Check for token on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('authToken'); 
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // Fetch users
  const fetchUsers = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showSnackbar(error.message, 'error');
      } else {
        showSnackbar('An unknown error occurred', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies should be stable
  
  // Fetch users on `currentPage` change
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;
    
    try {
      await axios.put(`https://reqres.in/api/users/${selectedUser.id}`, editFormData);
      
      // Update user in the local state
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editFormData }
          : user
      );
      setUsers(updatedUsers);
      
      setEditDialogOpen(false);
      showSnackbar('User updated successfully', 'success');
    } catch (error: unknown) {
      if (error instanceof Error) {
        showSnackbar(error.message, 'error');
      } else {
        showSnackbar('An unknown error occurred', 'error');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      await axios.delete(`https://reqres.in/api/users/${selectedUser.id}`);
      
      // Remove user from the local state
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      
      setDeleteDialogOpen(false);
      showSnackbar('User deleted successfully', 'success');
    } catch (error: unknown) {
      if (error instanceof Error) {
        showSnackbar(error.message, 'error');
      } else {
        showSnackbar('An unknown error occurred', 'error');
      }
    }
    
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown> | null, value: number) => {
    setCurrentPage(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken'); 
    navigate('/');
  };
  

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User List
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={3} sx={{ maxWidth: '1200px', justifyContent: 'center' }}>
              {users?.map(user => (
              <Grid item xs={12} sm={6} md={3} key={String(user.id)}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ 
                          width: 100, 
                          height: 100, 
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                        image={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2" align="center">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {user.email}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button 
                          startIcon={<EditIcon />} 
                          variant="outlined" 
                          color="primary"
                          onClick={() => handleEditClick(user)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button 
                          startIcon={<DeleteIcon />} 
                          variant="outlined" 
                          color="error"
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            </Box>

            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          </>
        )}

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="first_name"
              label="First Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editFormData.first_name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="last_name"
              label="Last Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editFormData.last_name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={editFormData.email}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete {selectedUser?.first_name} {selectedUser?.last_name}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UsersList;