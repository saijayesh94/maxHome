import React from 'react'
import {Card,CardContent,IconButton,Typography,AspectRatio} from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom'


function CreateNewOfferCard() {

  const navigate = useNavigate();

  const handleIconButton = ()=>{
    navigate('/chat-ui')
  }

  return (
    <Card sx={{ width: 320, marginTop: '7%', marginLeft: '20px' }}>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <IconButton  onClick={handleIconButton}>
          <AddIcon />
        </IconButton>
      </AspectRatio>
      <CardContent>
      <Typography fontSize="lg" fontWeight="lg">Create New Offer</Typography>
          <Typography >
            To be Created
          </Typography>
      </CardContent>
    </Card>
  )
}

export default CreateNewOfferCard