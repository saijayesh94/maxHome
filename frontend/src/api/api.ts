import axios from 'axios';

export async function chartAPI(payload: any) {
  try {
    let data = JSON.stringify(payload);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://maxhome-api-chat.deepnetlabs.com/chat',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function sendMail(payload: any) {
  try {
    let data = JSON.stringify(payload);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://maxhome-api-pdf.deepnetlabs.com/fill_pdf',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

