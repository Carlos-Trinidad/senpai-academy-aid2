(function () {
  /* Configuración Inicial de Mensajes */
  let Message;
  Message = function (arg) {
    (this.text = arg.text), (this.message_side = arg.message_side);
    this.draw = (function (_this) {
      return function () {
        let $message;
        $message = $($(".message_template").clone().html());
        $message.addClass(_this.message_side).find(".text").html(_this.text);
        $(".messages").append($message);
        return setTimeout(function () {
          return $message.addClass("appeared");
        }, 0);
      };
    })(this);
    return this;
  };

  /* Funcionalidad del Asistente */
  $(function () {
    /* Declaración de variables necesarias para el funcionamiento */
    let getMessageText;
    let message_side;
    let drawMessage;
    let sendMessageAssistant;
    let sessionId;
    let context;

    let sendToneAnalyze = false;

    message_side = "right";

    /* Función para obtener el texto escrito por el usuario */
    getMessageText = function () {
      let $message_input;
      $message_input = $(".message_input");
      return $message_input.val();
    };

    sendClassifyImage = async function () {
      let formData = new FormData();
      let fileField = document.querySelector("#inputImage");
      formData.append("imagen", fileField.files[0]);

      try {
        let response = await fetch("/api/v1/watson/visual/classify", {
          method: "POST",
          body: formData,
        });

        response = await response.json();

        console.log('Success', response);

        drawMessage(response.texto, 'bot');

      } catch (error) {
        console.log(error);
      }
    }

    sendMessageAssistant = async function (texto) {

      let responseWatsonText = [];

      let payload = { text: texto, sessionId: sessionId };

      try {

        let response = await fetch("/api/v1/watson/message", {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        response = await response.json();

        // Eliminamos el ultimo mensaje dibujado (El mensaje de "Escribiendo...")
        $(".messages li").last().remove();

        console.log('Success: ', response);

        sessionId = response.sessionId;
        context = response.context;

        await response.result.forEach(generic => {
          if (generic.response_type === 'text') {
            responseWatsonText.push(generic.text);
          }
          else if (generic.response_type === 'option') {
            responseWatsonText.push(JSON.stringify(generic));
          }
          else if (generic.response_type === 'image') {
            responseWatsonText.push(`<img src="${generic.source}" width="250" height="150">`);
          }
          else {
            responseWatsonText.push(JSON.stringify(generic));
          }
        });

        if (response.intenciones && response.intenciones[0] && response.intenciones[0].intent === 'precio_habitacion') {
          responseWatsonText.push('<input type="file" name="imagen" id="inputImage"><button id="enviarImage" onclick="sendClassifyImage()">Enviar</button>');
        }

        if (response.context.skills['main skill'].user_defined) {
          if (context.skills["main skill"].user_defined.analizar_emocion) {
            sendToneAnalyze = true;
          }
        }

        return responseWatsonText;

      } catch (error) {
        console.log(error);
      }
    }

    sendMessageToneAnalyzer = async function (text) {
      $(".message_input").val("");
      let $messages = $(".messages");
      let message = new Message({
        text: text,
        message_side: "right",
      });
      message.draw();
      $messages.animate({ scrollTop: $messages.prop("scrollHeight") }, 300);


      let payload = { text: text, sessionId: sessionId, context: context };

      try {

        let message = new Message({
          text: "Escribiendo...",
          message_side: "left",
        });
        message.draw();

        let response = await fetch("/api/v1/watson/message/tone", {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        response = await response.json();

        console.log('Success: ', response);

        sendToneAnalyze = false;

        // Eliminamos el ultimo mensaje dibujado (El mensaje de "Escribiendo...")
        $(".messages li").last().remove();

        drawMessage(response.result[0].text, 'bot')

      } catch (error) { 
        console.log(error);
      }
    }

    /** Función para dibujar texto en pantalla */
    drawMessage = async function (text, user) {
      //Variables necesarias
      let $messages;
      let message;
      let messageAssistant;

      // Si el texto vuelve vacio se corta aquí la función.
      if (text.trim() === "") {
        return;
      }

      // Volvemos texto vacio el input donde el usuario ingreso su mensaje a enviar.
      $(".message_input").val("");

      // Obtenemos la etiqueta html contenedora de los mensajes
      $messages = $(".messages");

      // Detectamos si el mensaje fue enviado por un bot o por el usuario (Si es un bot se muestre a la izquierda, si fue el usuario a la derecha)
      message_side = user === "bot" ? "left" : "right";

      // Creamos un objeto mensaje con los valores de texto que nos pasaron como parametro y si se tiene que mostrar a la izquierda o derecha.
      message = new Message({
        text: text,
        message_side: message_side,
      });

      // Dibujamos el mensaje
      text === 'Mamperro' ? text = '' : message.draw();

      if (user === 'user') {

        let message = new Message({
          text: "Escribiendo...",
          message_side: "left",
        });
        message.draw();

        messageAssistant = await sendMessageAssistant(text);

        console.log(messageAssistant);

        for (let i = 0; i < messageAssistant.length; i++) {
          let text = messageAssistant[i];
          drawMessage(text, 'bot');
        }
      }

      return $messages.animate(
        { scrollTop: $messages.prop("scrollHeight") },
        300
      );
    };

    /* Funcionalidad click de botones */
    $(".send_message").click(function (e) {
      if (sendToneAnalyze) {
        sendMessageToneAnalyzer(getMessageText());
      }
      else {
        return drawMessage(getMessageText(), "user");
      }
    });
    $(".message_input").keyup(function (e) {
      if (e.which === 13) {
        if (sendToneAnalyze) {
          sendMessageToneAnalyzer(getMessageText());
        }
        else {
          return drawMessage(getMessageText(), "user");
        }
      }
    });
    drawMessage('Mamperro', 'user');

    //Funcionalidad de Audio
    let recording = false;

    startRecording = async function(){
      let audioIN = {audio: true};
      navigator.mediaDevices
        .getUserMedia(audioIN)
        .then(async function(mediaStreamObj) {
          let mediaRecorder = new MediaRecorder(mediaStreamObj);
          mediaRecorder.start();

          let stop = document.getElementById('send_audio');

          stop.addEventListener('click', function(ev) {
            if(recording && mediaRecorder.state !== 'inactive'){
              mediaRecorder.stop();
            }
          })

          let dataArray = [];

          mediaRecorder.ondataavailable = function (ev) {
            dataArray.push(ev.data);
          };
          
          mediaRecorder.onstop = async function(){

            let audioData = new Blob(dataArray, { type: 'audio/mp3' });

            dataArray = [];

            let audioSrc = window.URL.createObjectURL(audioData);

            console.log(audioSrc);

            recording = false;

            let formData = new FormData();
            formData.append("audio", audioData);
      
            try {
              let response = await fetch("/api/v1/watson/stt", {
                method: "POST",
                body: formData,
              });
      
              response = await response.json();
      
              console.log('Success', response);

              drawMessage(response.results[0].alternatives[0].transcript, "user");
      
            } catch (error) {
              console.log(error);
            }
            
          }
        })
        .catch(function(error){
          console.log(error);
        });
    }

    $(".send_audio").click(function (e) {
      if(!recording){
        recording = true;
        startRecording();
      }
    });
  });
}.call(this));
