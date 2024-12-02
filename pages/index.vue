<template>
  <div>
    <h1>채팅방</h1>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        {{ msg }}
      </div>
    </div>
    <input
      v-model="newMessage"
      type="text"
      placeholder="메시지를 입력하세요"
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage">전송</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const socket = ref<WebSocket | null>(null);
const messages = ref<string[]>([]);
const newMessage = ref<string>('');

// 로컬 저장소에서 메시지 로드
function loadMessagesFromLocal() {
  const storedMessages = localStorage.getItem('chatMessages');
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
  }
}

// 로컬 저장소에 메시지 저장
function saveMessagesToLocal() {
  localStorage.setItem('chatMessages', JSON.stringify(messages.value));
}

// WebSocket 연결
function connectWebSocket() {
  socket.value = new WebSocket('ws://localhost:3001');

  socket.value.onmessage = async (event) => {
    let messageData;

    if (event.data instanceof Blob) {
      messageData = await event.data.text();
    } else {
      messageData = event.data;
    }

    try {
      const message = JSON.parse(messageData);
      if (message.content) {
        messages.value.push(message.content);
      }
    } catch {
      messages.value.push('수신 메시지를 처리할 수 없습니다.');
    }

    saveMessagesToLocal();
  };
}

// 메시지 전송
function sendMessage() {
  if (newMessage.value.trim() && socket.value) {
    const message = JSON.stringify({ content: newMessage.value });
    socket.value.send(message); // JSON 형식으로 전송
    newMessage.value = '';
  }
}

// WebSocket 연결 관리
onMounted(() => {
  loadMessagesFromLocal();
  connectWebSocket();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>

<style>
.chat-box {
  border: 1px solid #ddd;
  padding: 10px;
  height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.message {
  margin-bottom: 5px;
}
</style>
