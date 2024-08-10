import { useState } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(firestore, 'users', user.uid), { name });
      }
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <Box
      className="align"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#2c3338',
        fontFamily: '"Open Sans", sans-serif',
      }}
    >
      <Box
        className="grid"
        sx={{
          width: '90%',
          maxWidth: '20rem',
          marginInline: 'auto',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <form
          className="form login"
          onSubmit={e => {
            e.preventDefault();
            handleAuth();
          }}
          sx={{
            display: 'grid',
            gap: '0.875rem',
          }}
        >
          <Box className="form__field" sx={{ display: 'flex' }}>
            <Box
              component="label"
              htmlFor="login__username"
              sx={{
                backgroundColor: '#363b41',
                borderRadius: '0.25rem 0 0 0.25rem',
                paddingInline: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg className="icon" style={{ width: '1em', height: '1em', fill: '#606468' }}>
                <use xlinkHref="#icon-user"></use>
              </svg>
              <span className="hidden" style={{ position: 'absolute', clip: 'rect(0,0,0,0)', height: '1px', width: '1px', margin: '-1px', overflow: 'hidden', padding: '0', border: '0' }}>Username</span>
            </Box>
            <TextField
              id="login__username"
              name="email"
              autoComplete="email"
              placeholder="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#3b4148',
                  color: '#eee',
                  borderRadius: '0 0.25rem 0.25rem 0',
                  padding: '1rem',
                  border: 'none',
                },
              }}
              sx={{
                flex: 1,
                '&:hover': {
                  backgroundColor: '#434a52',
                },
              }}
            />
          </Box>

          <Box className="form__field" sx={{ display: 'flex' }}>
            <Box
              component="label"
              htmlFor="login__password"
              sx={{
                backgroundColor: '#363b41',
                borderRadius: '0.25rem 0 0 0.25rem',
                paddingInline: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg className="icon" style={{ width: '1em', height: '1em', fill: '#606468' }}>
                <use xlinkHref="#icon-lock"></use>
              </svg>
              <span className="hidden" style={{ position: 'absolute', clip: 'rect(0,0,0,0)', height: '1px', width: '1px', margin: '-1px', overflow: 'hidden', padding: '0', border: '0' }}>Password</span>
            </Box>
            <TextField
              id="login__password"
              name="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#3b4148',
                  color: '#eee',
                  borderRadius: '0 0.25rem 0.25rem 0',
                  padding: '1rem',
                  border: 'none',
                },
              }}
              sx={{
                flex: 1,
                '&:hover': {
                  backgroundColor: '#434a52',
                },
              }}
            />
          </Box>

          <Box className="form__field" sx={{ marginTop: '1rem' }}>
            <Button
              type="submit"
              sx={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#ea4c88',
                color: '#eee',
                fontWeight: 700,
                textTransform: 'uppercase',
                borderRadius: '0.25rem',
                '&:hover': {
                  backgroundColor: '#d44179',
                },
              }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </Box>
        </form>

        {error && <Typography color="error" textAlign="center">{error}</Typography>}

        <Typography
          className="text--center"
          sx={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: '#eee',
          }}
        >
          No account? <a href="#" onClick={() => setIsLogin(!isLogin)} style={{ color: '#eee', textDecoration: 'underline' }}>{isLogin ? 'Sign Up' : 'Sign In'}</a>
          <svg className="icon" style={{ marginLeft: '0.5rem', width: '1em', height: '1em', fill: '#eee' }}>
            <use xlinkHref="#icon-arrow-right"></use>
          </svg>
        </Typography>
      </Box>

      <svg xmlns="http://www.w3.org/2000/svg" className="icons" style={{ display: 'none' }}>
        <symbol id="icon-arrow-right" viewBox="0 0 1792 1792">
          <path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" />
        </symbol>
        <symbol id="icon-lock" viewBox="0 0 1792 1792">
          <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
        </symbol>
        <symbol id="icon-user" viewBox="0 0 1792 1792">
          <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
        </symbol>
      </svg>
    </Box>
  );
}
