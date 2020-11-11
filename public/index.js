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

      message_side = "right";
  
      /* Función para obtener el texto escrito por el usuario */
      getMessageText = function () {
        let $message_input;
        $message_input = $(".message_input");
        return $message_input.val();
      };
  
      /** Función para dibujar texto en pantalla */
      drawMessage = async function (text, user) {
        //Variables necesarias
        let $messages;
        let message;
  
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
        message.draw();
        
        return $messages.animate(
          { scrollTop: $messages.prop("scrollHeight") },
          300
        );
      };
  
      /* Funcionalidad click de botones */
      $(".send_message").click(function (e) {
        return drawMessage(getMessageText(), "bot");
      });
      $(".message_input").keyup(function (e) {
        if (e.which === 13) {
          return drawMessage(getMessageText(), "user");
        }
      });
    });
  }.call(this));
  