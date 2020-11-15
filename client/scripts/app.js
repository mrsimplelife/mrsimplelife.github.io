// eslint-disable-next-line
const app = {
  server: 'http://52.78.206.149:3000/messages',
  messages: [],
  rooms: [],
  init() {
    this.$roomSelect = document.querySelector('#rooms');
    this.$roomnameInput = document.querySelector('#roonname');
    this.$usernameInput = document.querySelector('#username');
    this.$textInput = document.querySelector('#text');
    this.$spinner = document.querySelector('.spinner');
    this.$chats = document.querySelector('#chats');
    this.$sendButton = document.querySelector('#send-btn');
    this.$roomSelect && this.$roomSelect.addEventListener('change', () => {
      this.$spinner && (this.$spinner.style.opacity = 1);
      this.clearMessages();
      this.$roomnameInput.value = this.$roomSelect.value;

    });
    this.$sendButton && this.$sendButton.addEventListener('click', () => {
      if (!this.$roomnameInput.value || !this.$usernameInput.value || !this.$textInput.value) {
        return alert('입력해야지?');
      }
      this.$spinner && (this.$spinner.style.opacity = 1);
      this.send({
        roomname: this.$roomnameInput.value,
        username: this.$usernameInput.value,
        text: this.$textInput.value
      });
    });
    // this.autoFetch();
  },
  send(message) {
    fetch(this.server, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(() => {
      this.$textInput && (this.$textInput.value = '');
      if (this.$roomSelect && this.$roomSelect.value !== this.$roomnameInput.value) {
        this.clearMessages();
        if (!this.rooms.includes(this.$roomnameInput.value)) {
          this.addOptions(this.$roomnameInput.value);
        }
        this.$roomSelect.value = this.$roomnameInput.value;
      }
    });
  },
  fetch(callback) {
    fetch(this.server)
      .then(res => res.json())
      .then(callback);
  },
  fetchForRoom(callback) {
    fetch(`${this.server}?roomname=${this.$roomSelect.value}`)
      .then(res => res.json())
      .then(callback);
  },
  clearMessages() {
    this.messages = [];
    this.$chats.innerHTML = '';
  },
  renderMessage(message) {
    this.messages.push(message);
    const $chat = document.createElement('div');
    const $username = document.createElement('div');
    const $text = document.createElement('div');
    $chat.className = 'chat';
    $username.className = 'username';
    $text.className = 'text';
    $username.textContent = message.username;
    $text.textContent = message.text;
    $chat.appendChild($username);
    $chat.appendChild($text);
    this.$chats.appendChild($chat);
  },
  autoFetch() {
    setInterval(() => {
      if (this.$roomSelect && this.$roomSelect.value !== '') {
        this.fetchForRoom(json => {
          for (let i = this.messages.length; i < json.results.length; i++) {
            this.renderMessage(json.results[i]);
          }
          this.$spinner && (this.$spinner.style.opacity = 0);
        });
      }
      else {
        this.fetch(json => {
          for (let i = this.messages.length; i < json.results.length; i++) {
            this.renderMessage(json.results[i]);
            if (json.results[i].roomname && !this.rooms.includes(json.results[i].roomname)) {
              this.addOptions(json.results[i].roomname);
            }
          }
          this.$spinner && (this.$spinner.style.opacity = 0);
        });
      }
    }, 1000);
  },

  addOptions(room) {
    this.rooms.push(room);
    const $option = document.createElement('option');
    $option.value = room;
    $option.textContent = room;
    this.$roomSelect && this.$roomSelect.appendChild($option);
  },
};

app.init();