        const messages = document.getElementById('messages')
        const textarea = document.getElementById('textarea')
        const username = document.getElementById('username')
        const postbutton = document.getElementById('postbutton')
        const clearbutton = document.getElementById('clearbutton')
        
        const socket = io.connect('http://127.0.0.1:4000')
        if(socket !== undefined){
                console.log('Connected to socket...');
                socket.on('output', function(data){
                    if(data.length){
                        data.forEach(element => {
                            var message = document.createElement('div')
                            var messagenamedate = document.createElement('div')
                            var messagems = document.createElement('div')
                            messagenamedate.classList.add('element1')
                            messagems.classList.add('element2')
                            messagenamedate.innerText = element.name+"   at    "+element.date.slice(0,10)+" "+element.date.slice(12,19)+":"
                            messagems.innerText = element.message
                            message.appendChild(messagenamedate)
                            message.appendChild(messagems)
                            message.classList.add('chat-message')
                            message.classList.add('message-card')
                            message.classList.add('card')
                            messages.appendChild(message)
                        });
                    }
                });
                postbutton.addEventListener('click', () =>{
                    
                    socket.emit('chat', {
                        name:username.value,
                        message:textarea.value,
                        date: new Date()
                    });
                })
                clearbutton.addEventListener('click', function(){
                    socket.emit('clear');
                });

                socket.on('cleared', function(){
                    messages.textContent = '';
                });
            }