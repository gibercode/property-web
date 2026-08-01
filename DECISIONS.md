# Decisiones

## 01. Donde vive la validacion de las reglas de estado y por que ahi

La validacion vive en el backend. Ahi se encuentran las reglas del negocio para que no dependan de la UI y para evitar que un cliente modificado pueda forzar transiciones invalidas.

## 02. Como garantizas que un usuario no pueda modificar recursos ajenos

Se valida el id del usuario autenticado obtenido desde el token contra el propietario del recurso. Si no coincide, el backend no permite ejecutar la accion.

## 03. Donde guardas el token en el cliente y que riesgo asumes

El token se guarda en `localStorage` usando persistencia de Zustand. El riesgo asumido es que, ante un XSS (Cross-site scripting), el token podria ser leido desde el navegador.

## 04. Que deuda tecnica asumiste conscientemente por el limite de tiempo

Quedo pendiente mejorar el logout en frontend y backend porque no hay manejo real de sesiones, y tambien falto hacer una versión responsive del front.
