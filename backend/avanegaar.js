const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const AVANGAR_SPEECH_TOKEN = process.env.AVANGAR_SPEECH_TOKEN;
const AVANGAR_TTS_TOKEN = process.env.AVANGAR_TTS_TOKEN;

async function speechToText(audioFilePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioFilePath));
  const response = await axios.post(
    'https://api.ivira.ai/partai/speechRecognition',
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${AVANGAR_SPEECH_TOKEN}`
      }
    }
  );
  return response.data.text;
}

async function textToSpeech(text) {
  const response = await axios.post(
    'https://api.ivira.ai/partai/TextToSpeech',
    { text, lang: 'fa' },
    {
      headers: {
        Authorization: `Bearer ${AVANGAR_TTS_TOKEN}`
      }
    }
  );
  return response.data.audioUrl;
}

module.exports = { speechToText, textToSpeech };
