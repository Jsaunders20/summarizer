function WHISPER(audioBlob, language) {
  
    const formData = {
    'model': 'whisper-1',
    'file': audioBlob,
    'language': language
    };  
  
    const url = 'https://api.openai.com/v1/audio/transcriptions';
    const options = {
      'method' : 'post',
      'payload': formData,
      'headers': {
        'Authorization': "Bearer " + GPT_API_KEY
      }
    };
  
    const res = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(res.getContentText());
    return data.text  
  }
