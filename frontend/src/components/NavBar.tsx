import React from 'react'
import {AppBar,Toolbar, IconButton,Typography} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar() {

  const navigate = useNavigate()
  const location = useLocation();

  const handleBackIconButton = ()=>{
    navigate('/')
  }

  const isHomePage = location.pathname === '/';

  return (
   <AppBar component="nav" sx={{backgroundColor: 'white'}}>
      <Toolbar>
        <IconButton sx={{border: '1px solid', borderColor: '#E3E8EE'}} onClick={handleBackIconButton}>
            <ArrowBackIosNewIcon sx={{color : '#292D32'}} />
        </IconButton>
        <Typography sx={{color: '#2B3340', paddingLeft: '16px'}}>
          {isHomePage ? 'Offers' : 'Create New Offer'}
        </Typography>
      </Toolbar>
   </AppBar> 
  )
}

export default NavBar