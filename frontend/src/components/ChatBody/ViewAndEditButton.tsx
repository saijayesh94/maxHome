import React from 'react';
import { Breadcrumbs, Link,Button,Stack,Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';




function ViewAndEditButton() {
  const location = useLocation();
  // console.log("LOCATION", location)
  const navigate = useNavigate();
  const { conversation } = location.state || {};

  // console.log(conversation);

  // Define breadcrumb items based on the current path
  const breadcrumbs = [
    { label: <HomeIcon />, path: '/' },
    { label: 'Create new Offer', path: '/chat-ui' },
    { label: 'View & Offer', path: '/edit-offer' }
  ];

  // Function to handle navigation when a breadcrumb is clicked
  const handleNavigation = (path:string) => {
    if(path === '/chat-ui'){
      navigate(path, { state: { conversation } });
      // console.log('path',path)     
    }else{
      navigate(path);
    }
  };

  // const handleDownload = () => {
  //   window.location.href = '/Get_Started_With_Smallpdf.pdf';
  // };

  return (
    <>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{fontSize: '12px'}} />}
        aria-label="breadcrumb"
        sx={{marginTop: { xs: '15%', sm: '10%', md: '8%' },borderTop: '1px solid', borderBottom: '1px solid', borderColor: '#DFE3EB',paddingTop: '3px', paddingBottom: '3px',paddingLeft: '18px' }}
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <Link
            key={index}
            color={location.pathname === breadcrumb.path ? '#2B3340' : '#697386'}
            onClick={() => handleNavigation(breadcrumb.path)}
            sx={{ cursor: 'pointer',fontSize: '12px' }}
            underline="none"
          >
            {breadcrumb.label}
          </Link>
        ))}
      </Breadcrumbs>

      <Box
        sx={{
          height: 'calc(100vh - 220px)', // Adjust the height as needed
          overflow: 'auto',
          overflowX: 'hidden',
          padding: '20px',
        }}
      >
        <iframe
          // src="https://example.com/document.pdf#view=fitH"
          src={location?.state?.pdfUrl}
          style={{ width: '100%', height: '100%' }}
          title="PDF Viewer"
        >
        </iframe>
      </Box>
    
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: '25px',
          backgroundColor: 'white',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '25px',
          paddingRight: '25px'
        }}
      >
        {/* <Button variant="outlined">Download Offer</Button> */}
        <a
          // href="#" 
          href={location?.state?.pdfUrl}
          target="_blank"
          // rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button variant="outlined" >
            Download Offer
          </Button>
        </a>
        <Button variant="contained" disabled>Save & Submit</Button>
      </Stack>
    </>
  );
}

export default ViewAndEditButton;
