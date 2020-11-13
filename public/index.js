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

    message_side = "right";

    /* Función para obtener el texto escrito por el usuario */
    getMessageText = function () {
      let $message_input;
      $message_input = $(".message_input");
      return $message_input.val();
    };

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

        return responseWatsonText;

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
      return drawMessage(getMessageText(), "user");
    });
    $(".message_input").keyup(function (e) {
      if (e.which === 13) {
        return drawMessage(getMessageText(), "user");
      }
    });
    drawMessage('Mamperro', 'user');
  });
}.call(this));
