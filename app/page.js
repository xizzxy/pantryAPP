'use client'
import { useState, useEffect } from "react";
import { auth, firestore } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, getDocs, query, setDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import WelcomePage from "./welcomePage";
import { Lora } from 'next/font/google';

const lora = Lora({ weight: ['400', '700'], subsets: ['latin'] });

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);
        updateInventory(user.uid);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateInventory = async (uid) => {
    const snapshot = query(collection(firestore, 'inventory', uid, 'items'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory', userId, 'items'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory(userId);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory', userId, 'items'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory(userId);
  };

  const filteredInventory = inventory
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!isAuthenticated) {
    return <WelcomePage />;
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundColor: '#2c3338',
        color: '#eee',
        fontFamily: '"Open Sans", sans-serif',
      }}
    >
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          backgroundColor: '#ea4c88',
          color: '#eee',
          fontFamily: '"Open Sans", sans-serif',
          borderRadius: '0.25rem',
          padding: '0.75rem 1.5rem',
          border: '2px solid transparent',
          '&:hover': {
            backgroundColor: '#d44179',
            border: '2px solid #eee',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Logout
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#3b4148',
            border: 'none',
            borderRadius: '0.25rem',
            boxShadow: '0 15px 25px rgba(0,0,0,0.6)', // Box shadow for modal
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            color: '#eee',
            fontFamily: '"Open Sans", sans-serif',
          }}
        >
          <Typography variant="h6">Add new items!</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                backgroundColor: '#fff7f8', // Light pink background
                color: '#333',
                fontFamily: '"Open Sans", sans-serif',
                borderRadius: '0.25rem',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ea4c88',
                  },
                  '&:hover fieldset': {
                    borderColor: '#d44179',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#d44179',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                backgroundColor: '#fff7f8', // Light pink background
                color: '#333',
                fontFamily: '"Open Sans", sans-serif',
                '&:hover': {
                  backgroundColor: '#ffd1e0', // Slightly darker pink on hover
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack
        direction="row-reverse"
        justifyContent="center"
        alignItems="center"
        width="700px"
        spacing={2}
        mt={2}
      >
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: '#ea4c88',
            color: '#eee',
            fontFamily: '"Open Sans", sans-serif',
            borderRadius: '0.25rem',
            padding: '0.75rem 1.5rem',
            border: '2px solid transparent',
            '&:hover': {
              backgroundColor: '#d44179',
              border: '2px solid #eee',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Add new Item!
        </Button>
        <Box width="700px" mt={2}>
          <TextField
            variant="outlined"
            placeholder="Search items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: '100%',
              backgroundColor: '#fff7f8', // Light pink background
              color: '#333',
              fontFamily: '"Open Sans", sans-serif',
              borderRadius: '0.25rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ea4c88',
                },
                '&:hover fieldset': {
                  borderColor: '#d44179',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d44179',
                },
              },
              '& input': {
                padding: '0.75rem 1rem',
                borderRadius: '0.25rem',
              },
            }}
          />
        </Box>
      </Stack>
      <Box
        border="1px solid #333"
        mt={2}
        sx={{
          width: '700px',
          borderRadius: '0.25rem',
          overflow: 'hidden',
        }}
      >
        <Box
          width="100%"
          height="100px"
          sx={{
            backgroundColor: '#FFC0CB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d44179',
            fontFamily: lora.style.fontFamily, // Apply Lora font to "Online Pantry"
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Add text shadow
          }}
        >
          <Typography variant="h2">Online Pantry</Typography>
        </Box>
        <Stack
          width="100%"
          height="300px"
          spacing={3}
          sx={{
            overflow: 'auto',
            backgroundColor: '#2c3338',
            color: '#eee',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)', // Add box shadow to the inventory container
          }}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#ffd1e0"
              p={5}
              borderRadius="0.25rem"
              color="#eee"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.3)" // Add box shadow to each inventory item
            >
              <Typography variant="h4" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h4" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  sx={{
                    backgroundColor: '#fff7f8', // Light pink background
                    color: '#333',
                    fontFamily: '"Open Sans", sans-serif',
                    borderRadius: '0.25rem',
                    padding: '0.75rem 1.5rem',
                    '&:hover': {
                      backgroundColor: '#ffd1e0', // Slightly darker pink on hover
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add Item
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{
                    backgroundColor: '#fff7f8', // Light pink background
                    color: '#333',
                    fontFamily: '"Open Sans", sans-serif',
                    borderRadius: '0.25rem',
                    padding: '0.75rem 1.5rem',
                    '&:hover': {
                      backgroundColor: '#ffd1e0', // Slightly darker pink on hover
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Remove Item
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
