const socket = io();

let recognition;
let isRecording = false;

const messages = document.getElementById('messages'); // Make sure this exists in your HTML
const micBtn = document.getElementById('micBtn');
const sendBtn = document.getElementById('sendBtn'); // Your send button
const input = document.getElementById('input'); // Your message input
const attachBtn = document.getElementById('attachBtn');
const fileInput = document.getElementById('fileInput');
const userScoreDiv = document.getElementById('userScore'); // For displaying score

// --- Speech Recognition ---

const startRecording = () => {
  if (isRecording) {
    stopRecording();
    return;
  }

  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'fa-IR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isRecording = true;
    console.log('شروع ضبط صدا');
    // TODO: update UI to show recording state
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    console.log('تشخیص داده شده:', transcript);
    if (transcript) {
      sendMessage(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.error('خطا در تشخیص گفتار:', event.error);
    alert('خطا در تشخیص گفتار: ' + event.error);
  };

  recognition.onend = () => {
    isRecording = false;
    console.log('پایان ضبط صدا');
    // TODO: update UI to show recording stopped
  };

  recognition.start();
};

const stopRecording = () => {
  if (recognition && isRecording) {
    recognition.stop();
    isRecording = false;
    console.log('ضبط صدا متوقف شد');
  }
};

micBtn?.addEventListener('click', startRecording);

// --- Message Sending and Receiving ---

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => {
    return `<a href="#" class="chat-link" onclick="event.preventDefault(); openLinkInModal('${url}')">${url}</a>`;
  });
}

function appendMessage({ type, content, sender }) {
  const li = document.createElement('li');
  li.className = sender === 'user' ? 'user' : 'bot';
  li.style.maxWidth = '80%';
  li.style.wordBreak = 'break-word';
  li.style.borderRadius = '12px';
  li.style.margin = '8px';
  li.style.padding = '10px';
  li.style.whiteSpace = 'pre-wrap';
  li.style.backgroundColor = sender === 'user' ? '#d1e7dd' : '#f8d7da';
  li.style.textAlign = sender === 'user' ? 'right' : 'left';

  if (type === 'text') {
    li.innerHTML = linkify(content);
  } else if (type === 'image') {
    const img = document.createElement('img');
    img.src = content;
    img.alt = 'تصویر';
    img.style.borderRadius = '8px';
    img.style.maxWidth = '100%';
    li.appendChild(img);
  } else if (type === 'audio') {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = content;
    audio.style.width = '100%';
    audio.style.borderRadius = '8px';
    li.appendChild(audio);
  } else if (type === 'video') {
    const video = document.createElement('video');
    video.controls = true;
    video.src = content;
    video.style.width = '100%';
    video.style.borderRadius = '8px';
    li.appendChild(video);
  } else {
    li.textContent = content;
  }

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

// Typing animation for bot text
function typeBotMessage(text) {
  const li = document.createElement('li');
  li.className = 'bot';
  li.style.maxWidth = '80%';
  li.style.wordBreak = 'break-word';
  li.style.borderRadius = '12px';
  li.style.margin = '8px';
  li.style.padding = '10px';
  li.style.whiteSpace = 'pre-wrap';
  li.style.backgroundColor = '#f8d7da';
  li.style.textAlign = 'left';

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;

  const words = text.split(' ');
  let i = 0;

  function typeNextWord() {
    if (i < words.length) {
      li.innerHTML += (i === 0 ? '' : ' ') + linkify(words[i]);
      i++;
      messages.scrollTop = messages.scrollHeight;
      setTimeout(typeNextWord, 150 + Math.random() * 100);
    }
  }
  typeNextWord();
}

// Send message function
function sendMessage(text) {
  appendMessage({ type: 'text', content: text, sender: 'user' });
  socket.emit('chat message', text);
  input.value = '';
}

// Send button
sendBtn?.addEventListener('click', () => {
  const text = input.value.trim();
  if (text) sendMessage(text);
});

// Enter key to send
input?.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});

// Attach file
attachBtn?.addEventListener('click', () => {
  fileInput.click();
});

fileInput?.addEventListener('change', async () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        const ext = file.name.split('.').pop().toLowerCase();
        let type = 'text';
        if (['mp3','wav','ogg'].includes(ext)) type = 'audio';
        else if (['jpg','jpeg','png','gif','bmp'].includes(ext)) type = 'image';
        else if (['mp4','avi','mov','webm'].includes(ext)) type = 'video';

        socket.emit('chat media message', `/uploads/${data.filename}`, type);
        appendMessage({ type, content: `/uploads/${data.filename}`, sender: 'user' });
        fileInput.value = '';
      } else {
        alert(data.error || 'خطا در آپلود فایل');
      }
    } catch {
      alert('خطا در ارتباط با سرور');
    }
  }
});

// Receive messages from server

socket.on('chat message', msg => {
  typeBotMessage(msg);
});

socket.on('chat media message', (fileUrl, fileType) => {
  appendMessage({ type: fileType, content: fileUrl, sender: 'bot' });
});

socket.on('voice reply', audioUrl => {
  appendMessage({ type: 'audio', content: audioUrl, sender: 'bot' });
});

// --- Modal for links ---

const modalBg = document.createElement('div');
modalBg.id = 'modalBg';
Object.assign(modalBg.style, {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.7)',
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});
modalBg.innerHTML = `
  <div id="modalContent" style="position: relative; width: 90vw; max-width: 600px; height: 80vh; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column;">
    <button id="modalCloseBtn" style="position: absolute; top: 8px; left: 8px; background: #e74c3c; border: none; color: white; font-size: 20px; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; z-index: 10;">&times;</button>
    <iframe id="modalIframe" title="نمایش لینک" style="flex-grow: 1; border: none; width: 100%; height: 100%;"></iframe>
  </div>
`;
document.body.appendChild(modalBg);

const modalIframe = document.getElementById('modalIframe');
const modalCloseBtn = document.getElementById('modalCloseBtn');

function openLinkInModal(url) {
  modalIframe.src = url;
  modalBg.style.display = 'flex';
}

modalCloseBtn.onclick = () => {
  modalBg.style.display = 'none';
  modalIframe.src = '';
};

modalBg.onclick = e => {
  if (e.target === modalBg) {
    modalCloseBtn.click();
  }
};

// --- Load and display user score ---

async function loadUserScore(userId) {
  try {
    const res = await fetch(`/api/users/${userId}/score`);
    if (!res.ok) throw new Error('Failed to fetch score');
    const data = await res.json();
    const scoreDiv = document.getElementById('userScore');
    if (scoreDiv) {
      scoreDiv.textContent = `امتیاز شما: ${data.totalScore}`;
    }
  } catch (err) {
    console.error(err);
  }
}

// Assuming userId stored in localStorage or global variable
const userId = localStorage.getItem('userId');
if (userId) {
  loadUserScore(userId);
} else {
  console.warn('User ID not found, cannot load score');
}
